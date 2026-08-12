import React, { useState, useEffect, startTransition } from "react";
import { SECTIONS, DEFAULT_TESTS, loadLicense, verifyLicenseSig, licenseStatus, SHEET_ID, WEBHOOK_URL } from "./constants/data.js";
import { C, Btn, toInputDate, uid } from "./utils/helpers.jsx";
import {
  initDatabase,
  dbSavePatients,
  dbSaveResults,
  dbSaveSingleResult,
  dbDeleteResult,
  dbSaveStaff,
  dbSaveTests,
  dbSaveHospital,
  dbSaveAccounts,
  dbSaveDraft,
  dbDeleteDraft
} from "./utils/db.js";
import { downloadResultAsPDF, generateResultPDFDataUri } from "./utils/pdfGenerator.js";
import { Icon } from "./components/common/Icons.jsx";

import { SerialKeyGate, LicenseExpiredGate } from "./components/gates/SerialKeyGate.jsx";
import { SwitchProfileModal } from "./components/common/SwitchProfileModal.jsx";
import { PDFPreviewModal } from "./components/common/PDFPreviewModal.jsx";
import { DashboardView } from "./components/views/DashboardView.jsx";
import { LabEntry } from "./components/views/LabEntry.jsx";
import { SummaryView } from "./components/views/SummaryView.jsx";
import { ReportsView } from "./components/views/ReportsView.jsx";
import { PatientsView } from "./components/views/PatientsView.jsx";
import { PersonnelView } from "./components/views/PersonnelView.jsx";
import { ParametersView } from "./components/views/ParametersView.jsx";
import { HospitalView } from "./components/views/HospitalView.jsx";
import { WelcomePage } from "./components/views/WelcomePage.jsx";
import { LoginPage } from "./components/views/LoginPage.jsx";
import { AccountsView } from "./components/views/AccountsView.jsx";
import { TemplatesView } from "./components/views/TemplatesView.jsx";
import { BarcodeView } from "./components/views/BarcodeView.jsx";

export default function App() {
  const [licState, setLicState] = useState("checking");
  const [licData, setLicData] = useState(null);
  const [showKeyEntry, setShowKeyEntry] = useState(false);

  const recheckSheet = async (lic) => {
    if (!lic || !lic.keyHash || !SHEET_ID) return "ok";
    try {
      const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);

      const text = await res.text();
      const json = JSON.parse(text.slice(47, -2));
      const rows = json?.table?.rows || [];

      for (const row of rows) {
        const rowHash = (row.c[0]?.v || "").trim();
        if (rowHash !== lic.keyHash) continue;

        const rowStatus = (row.c[3]?.v || "").toLowerCase().trim();
        const rowExpiry = row.c[6]?.v || "";

        if (["revoked", "banned", "disabled", "expired"].includes(rowStatus)) return rowStatus;

        if (rowExpiry) {
          const expDate = new Date(rowExpiry);
          if (!isNaN(expDate.getTime()) && Date.now() > expDate.getTime()) return "expired";
        }
        return "ok";
      }
      return "ok";
    } catch (e) {
      return "ok";
    }
  };

  const sendToSheet = async (keyHash, deviceId, expiresAt) => {
    if (!WEBHOOK_URL) return;
    try {
      const body = new URLSearchParams({ keyHash, deviceId, expiresAt });
      await fetch(WEBHOOK_URL, { method: "POST", body });
    } catch (e) {}
  };

  useEffect(() => {
    async function checkSavedLicense() {
      const savedLic = loadLicense();
      if (!savedLic) {
        setLicState("none");
        setShowKeyEntry(true);
        return;
      }

      const isSigValid = await verifyLicenseSig(savedLic);
      if (!isSigValid) {
        localStorage.removeItem("medlims_license");
        setLicState("none");
        setShowKeyEntry(true);
        return;
      }

      const localStatus = licenseStatus(savedLic);
      if (localStatus === "expired") {
        setLicData(savedLic);
        setLicState("expired");
        return;
      }

      setLicData(savedLic);
      setLicState("valid");
      setShowKeyEntry(false);

      recheckSheet(savedLic).then((sheetStatus) => {
        if (["revoked", "banned", "disabled"].includes(sheetStatus)) {
          localStorage.removeItem("medlims_license");
          setLicState("none");
          setShowKeyEntry(true);
        } else if (sheetStatus === "expired") {
          setLicState("expired");
        }
      });

      if (savedLic.keyHash && savedLic.deviceId) {
        const expiresAtStr = savedLic.expiresAt && savedLic.expiresAt !== "lifetime"
          ? new Date(savedLic.expiresAt).toISOString().slice(0, 10)
          : "lifetime";
        sendToSheet(savedLic.keyHash, savedLic.deviceId, expiresAtStr);
      }
    }

    checkSavedLicense();
  }, []);

  useEffect(() => {
    if (licState !== "valid" || !licData) return;
    const interval = setInterval(async () => {
      const sheetStatus = await recheckSheet(licData);
      if (["revoked", "banned", "disabled"].includes(sheetStatus)) {
        localStorage.removeItem("medlims_license");
        setLicState("none");
        setShowKeyEntry(true);
      } else if (sheetStatus === "expired") {
        setLicState("expired");
      }
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [licState, licData]);

  const handleActivated = () => {
    const savedLic = loadLicense();
    setLicData(savedLic || { type: "lifetime" });
    setLicState("valid");
    setShowKeyEntry(false);
  };

  if (licState === "checking") {
    return (
      <div style={{ minHeight: "100vh", background: "#0d213a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif", fontSize: 14 }}>
        Verifying License…
      </div>
    );
  }

  if (licState === "none" || showKeyEntry) {
    return <SerialKeyGate onActivated={handleActivated} />;
  }

  if (licState === "expired") {
    return <LicenseExpiredGate licType={licData?.type} onReactivate={() => setShowKeyEntry(true)} />;
  }

  return <AppMain licData={licData} />;
}

function AppMain({ licData }) {
  const [view, setView] = useState("dashboard");
  const [barcodeNav, setBarcodeNav] = useState(null);
  const [patients, setPatients] = useState([]);
  const [staff, setStaff] = useState([]);
  const [results, setResults] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [preDraft, setPreDraft] = useState(null);
  const [tests, setTests] = useState(null);
  const [hospital, setHospital] = useState({ name: "BAIS DISTRICT HOSPITAL", address: "", phone: "", setupDone: false });
  const [accounts, setAccounts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [switchModal, setSwitchModal] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [crossSectionPatientId, setCrossSectionPatientId] = useState("");

  const [previewPdfObj, setPreviewPdfObj] = useState(null);

  const [printQ, setPrintQ] = useState([]);
  const [batchTotal, setBatchTotal] = useState(0);
  const [batchDone, setBatchDone] = useState(0);
  const [batchActive, setBatchActive] = useState(false);
  const [batchCurrentName, setBatchCurrentName] = useState("");

  const curSection = view.startsWith("lab:") ? view.slice(4) : null;
  const secDef = curSection ? SECTIONS.find(s => s.id === curSection) : null;

  const changeView = (newView) => {
    if (document.activeElement && typeof document.activeElement.blur === "function") {
      document.activeElement.blur();
    }
    startTransition(() => {
      setView(newView);
    });
  };

  useEffect(() => {
    async function loadDexieData() {
      const defaultAccounts = [{ id: uid(), username: "admin", password: "admin123", role: "Admin", name: "Administrator", createdAt: toInputDate() }];
      const defaultHospital = { name: "BAIS DISTRICT HOSPITAL", address: "", phone: "", setupDone: false };

      const data = await initDatabase(DEFAULT_TESTS, defaultAccounts, defaultHospital);
      setPatients(data.patients);
      setResults(data.results);
      setStaff(data.staff);
      setTests(data.tests);
      setHospital(data.hospital);
      setAccounts(data.accounts);
      setDrafts(data.drafts || []);
      setLoaded(true);
    }

    loadDexieData();
  }, []);

  const sp = (v) => { setPatients(v); dbSavePatients(v); };
  const ss = (v) => { setStaff(v); dbSaveStaff(v); };
  const sr = (v) => { setResults(v); dbSaveResults(v); };
  const st = (v) => { setTests(v); dbSaveTests(v); };
  const sh = (v) => { setHospital(v); dbSaveHospital(v); };
  const sa = (v) => { setAccounts(v); dbSaveAccounts(v); };

  const addResult = (r) => {
    const updated = [r, ...results];
    setResults(updated);
    dbSaveSingleResult(r);
  };

  useEffect(() => {
    if (crossSectionPatientId) setCrossSectionPatientId("");
  }, [curSection]);

  const delResult = (id) => {
    setResults(results.filter((r) => r.id !== id));
    dbDeleteResult(id);
  };

  const editResult = (r) => {
    const updated = results.map((x) => (x.id === r.id ? r : x));
    setResults(updated);
    dbSaveSingleResult(r);
  };

  const handleSaveDraft = (draftObj) => {
    setDrafts((prev) => {
      const exists = prev.find((d) => d.id === draftObj.id);
      return exists ? prev.map((d) => (d.id === draftObj.id ? draftObj : d)) : [draftObj, ...prev];
    });
    dbSaveDraft(draftObj);
  };

  const handleDeleteDraft = (id) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
    dbDeleteDraft(id);
  };

  const handleResumeDraft = (draftObj) => {
    setPreDraft(draftObj);
    changeView("lab:" + draftObj.section);
  };

  const handleTriggerPrint = async (resultObj) => {
    const pt = patients.find((p) => p.id === resultObj.patientId);
    try {
      const { dataUri, filename } = await generateResultPDFDataUri(resultObj, pt, hospital, staff);
      setPreviewPdfObj({ dataUri, filename, resultObj, pt });
    } catch (e) {
      console.error(e);
      downloadResultAsPDF(resultObj, pt, hospital, false, staff);
    }
  };

  const handleConfirmPrintFromPreview = () => {
    if (!previewPdfObj) return;
    const { resultObj, pt } = previewPdfObj;
    downloadResultAsPDF(resultObj, pt, hospital, false, staff).then(() => {
      setResults((prev) => {
        const updated = prev.map((r) => (r.id === resultObj.id ? { ...r, printed: true, printedAt: new Date().toISOString() } : r));
        const currentUpdated = updated.find((r) => r.id === resultObj.id);
        if (currentUpdated) dbSaveSingleResult(currentUpdated);
        return updated;
      });
      setPreviewPdfObj(null);
    });
  };

  const closeBatchOverlay = () => {
    setBatchActive(false);
    setBatchTotal(0);
    setBatchDone(0);
    setBatchCurrentName("");
    setPrintQ([]);
  };

  useEffect(() => {
    if (!printQ || printQ.length === 0) {
      return;
    }

    const isBatch = !!printQ._batch;
    if (isBatch && !batchActive) {
      setBatchTotal(printQ.length);
      setBatchDone(0);
      setBatchActive(true);
    }

    const [next, ...rest] = printQ;
    const pt = patients.find((p) => p.id === next.patientId);
    if (isBatch) setBatchCurrentName(pt?.name || "Patient");

    downloadResultAsPDF(next, pt, hospital, staff)
      .then(() => {
        setResults((prev) => {
          const updated = prev.map((r) => (r.id === next.id ? { ...r, printed: true, printedAt: new Date().toISOString() } : r));
          const currentUpdated = updated.find((r) => r.id === next.id);
          if (currentUpdated) dbSaveSingleResult(currentUpdated);
          return updated;
        });
        if (isBatch) setBatchDone((prev) => prev + 1);
        if (rest.length > 0) {
          setTimeout(() => {
            const nextQ = [...rest];
            if (isBatch) nextQ._batch = true;
            setPrintQ(nextQ);
          }, 600);
        } else {
          setPrintQ([]);
        }
      })
      .catch((e) => {
        console.error(e);
        if (isBatch) setBatchDone((prev) => prev + 1);
        setPrintQ(rest);
      });
  }, [printQ]);

  if (!loaded || !tests) return <div style={{ padding: 40, textAlign: "center", fontFamily: "'Inter', sans-serif", color: C.muted }}>Loading Enterprise LIMS Database…</div>;
  if (!hospital.setupDone) return <WelcomePage hospital={hospital} onSave={(h) => { const v = { ...h, setupDone: true }; sh(v); }}/>;
  if (!currentUser) return <LoginPage accounts={accounts} onLogin={setCurrentUser} hospital={hospital}/>;

  const isAdmin = currentUser?.role === "Admin";
  const navItems = [
    { id: "dashboard",   icon: "dashboard",  label: "Dashboard" },
    { id: "patients",    icon: "patients",   label: "Patients" },
    { id: "personnel",   icon: "personnel",  label: "Personnel" },
    { id: "parameters",  icon: "parameters", label: "Parameters" },
    { id: "templates",   icon: "templates",  label: "Templates" },
    { id: "reports",     icon: "reports",    label: "Reports" },
    { id: "summary",     icon: "summary",    label: "Summary" },
    { id: "barcode",     icon: "barcode",    label: "Barcode" },
    { id: "hospitalinfo",icon: "hospitalinfo", label: "Hospital Info" },
    ...(isAdmin ? [{ id: "accounts", icon: "accounts", label: "User Accounts" }] : []),
  ];

  return (
    <div style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: 13, background: C.bg, height: "100vh", display: "flex", flexDirection: "column", color: C.text, overflow: "hidden" }}>
      <style>{`
        input, select, textarea {
          -webkit-user-select: text !important;
          user-select: text !important;
          pointer-events: auto !important;
        }
      `}</style>
      
      {/* ── 1. TOP HEADER BAR WITH CUSTOM B-CROSS LOGO ── */}
      <header style={{ background: "#0d213a", color: "#fff", padding: "0 20px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.2)", zIndex: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.3)", padding: 2, overflow: "hidden" }}>
            <img src={hospital.logoUri || "/icons/icon.png"} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} onError={(e) => { e.target.style.display = "none"; }} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 14, letterSpacing: "0.02em", color: "#fff", lineHeight: 1.2 }}>
              {hospital.name || "BAIS DISTRICT HOSPITAL"}
            </div>
            <div style={{ fontSize: 9.5, color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginTop: 1 }}>
              CLINICAL INFORMATION SYSTEM
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <HeaderClock />
          <div style={{ width: 1, height: 26, background: "rgba(255,255,255,0.15)" }} />
          
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 12 }}>
              {(currentUser.name || currentUser.username || "AD").slice(0, 2).toUpperCase()}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: "#fff", lineHeight: 1.1 }}>{currentUser.name || "Administrator"}</span>
              <span style={{ fontSize: 11, color: "#93c5fd", fontWeight: 500, marginTop: 2 }}>{currentUser.role || "Admin"}</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginLeft: 6 }}>
            <button onClick={() => setSwitchModal(true)} style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
              <Icon name="switch" size={14} color="#fff" /> Switch
            </button>
            <button onClick={() => setCurrentUser(null)} style={{ background: "#dc2626", color: "#fff", border: "none", borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
              <Icon name="logout" size={14} color="#fff" /> Exit
            </button>
          </div>
        </div>
      </header>

      {/* ── 2. SIDEBAR & MAIN BODY ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        
        {/* Sidebar */}
        <aside style={{ width: 220, background: "#0b1d33", display: "flex", flexDirection: "column", padding: "16px 12px", borderRight: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0 10px 12px 10px" }}>
            CORE MODULES
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1, overflowY: "auto" }}>
            {navItems.map((n) => {
              const active = view === n.id || (n.id === "dashboard" && curSection !== null);
              return (
                <button
                  key={n.id}
                  onClick={() => {
                    if (n.id === "dashboard") setPreDraft(null);
                    changeView(n.id);
                  }}
                  style={{
                    width: "100%",
                    background: active ? "#2563eb" : "transparent",
                    border: "none",
                    borderRadius: 8,
                    color: active ? "#ffffff" : "#94a3b8",
                    padding: "10px 14px",
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    fontSize: 13,
                    fontWeight: active ? 700 : 500,
                    transition: "all .15s ease-in-out"
                  }}
                >
                  <Icon name={n.icon} size={18} color={active ? "#ffffff" : "#94a3b8"} />
                  <span>{n.label}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Content View Area */}
        <main style={{ flex: 1, padding: 24, overflowY: "auto", background: C.bg }}>
          {view === "dashboard" && (
            <DashboardView
              results={results}
              patients={patients}
              drafts={drafts}
              sections={SECTIONS}
              onNav={(v) => { setPreDraft(null); changeView(v); }}
              onPrint={handleTriggerPrint}
              onBatchPrint={(q) => { const batchQ = [...q]; batchQ._batch = true; setPrintQ(batchQ); }}
              onResumeDraft={handleResumeDraft}
            />
          )}
          {curSection && (
            <LabEntry
              key={curSection + (preDraft?.id || "")}
              section={curSection}
              secDef={secDef}
              tests={tests}
              patients={patients}
              staff={staff}
              results={results}
              hospital={hospital}
              onSave={addResult}
              onPrint={handleTriggerPrint}
              onSwitchSection={(v, pId) => { if (pId) setCrossSectionPatientId(pId); setPreDraft(null); changeView(v); }}
              preSelectedTests={barcodeNav?.section === curSection ? barcodeNav.testIds : null}
              prePatientId={barcodeNav?.section === curSection ? barcodeNav.patientId : crossSectionPatientId}
              preDraft={preDraft}
              onSaveDraft={handleSaveDraft}
              onDeleteDraft={handleDeleteDraft}
            />
          )}
          {view === "reports" && <ReportsView results={results} patients={patients} staff={staff} onPrint={handleTriggerPrint} onBatchPrint={(q) => { const batchQ = [...q]; batchQ._batch = true; setPrintQ(batchQ); }} onDelete={delResult} onEdit={editResult}/>}
          {view === "patients" && <PatientsView data={patients} onSave={sp}/>}
          {view === "personnel" && <PersonnelView data={staff} onSave={ss}/>}
          {view === "parameters" && <ParametersView tests={tests} onSave={st}/>}
          {view === "templates" && <TemplatesView sections={SECTIONS} hospital={hospital}/>}
          {view === "summary" && <SummaryView results={results} patients={patients} hospital={hospital}/>}
          {view === "hospitalinfo" && <HospitalView data={hospital} onSave={sh}/>}
          {view === "accounts" && <AccountsView accounts={accounts} onSave={sa}/>}
          {view === "barcode" && <BarcodeView patients={patients} tests={tests} sections={SECTIONS} onNav={(v, bNav) => { if (bNav) setBarcodeNav(bNav); changeView(v); }}/>}
        </main>
      </div>

      {switchModal && <SwitchProfileModal accounts={accounts} currentUser={currentUser} onSwitch={(u) => { setCurrentUser(u); setSwitchModal(false); }} onClose={() => setSwitchModal(false)}/>}

      {previewPdfObj && (
        <PDFPreviewModal
          pdfDataUri={previewPdfObj.dataUri}
          filename={previewPdfObj.filename}
          onPrint={handleConfirmPrintFromPreview}
          onClose={() => setPreviewPdfObj(null)}
        />
      )}

      {/* Batch Print Progress Overlay */}
      {batchActive && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(15,45,74,.85)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "36px 44px", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,.4)", minWidth: 360, maxWidth: 440, position: "relative" }}>
            
            <button
              onClick={closeBatchOverlay}
              style={{ position: "absolute", top: 12, right: 12, background: "transparent", border: "none", fontSize: 18, color: C.muted, cursor: "pointer", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}
              title="Close overlay"
            >
              ✕
            </button>

            <div style={{ width: 64, height: 64, borderRadius: "50%", margin: "0 auto 20px", background: batchDone >= batchTotal ? "#dcfce7" : "#e8f4fb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, border: batchDone >= batchTotal ? "3px solid #86efac" : `3px solid ${C.accentMid}` }}>
              {batchDone >= batchTotal ? "✅" : "🖨"}
            </div>
            
            <div style={{ fontWeight: 700, fontSize: 18, color: C.primary, marginBottom: 6 }}>
              {batchDone >= batchTotal ? "Batch Print Complete!" : "Printing Results…"}
            </div>
            
            <div style={{ fontSize: 36, fontWeight: 800, color: batchDone >= batchTotal ? C.success : C.accent, letterSpacing: "-0.02em", margin: "8px 0" }}>
              {batchDone} / {batchTotal}
            </div>
            
            <div style={{ background: "#e2e8f0", borderRadius: 6, height: 8, overflow: "hidden", marginBottom: 14 }}>
              <div style={{ height: "100%", borderRadius: 6, transition: "width .4s ease", background: batchDone >= batchTotal ? "#22c55e" : `linear-gradient(90deg, ${C.accent}, ${C.accentMid})`, width: `${batchTotal > 0 ? Math.round((batchDone / batchTotal) * 100) : 0}%` }} />
            </div>
            
            {batchDone < batchTotal && batchCurrentName && (
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>
                Now printing: <strong style={{ color: C.text }}>{batchCurrentName}</strong>
              </div>
            )}
            
            <div style={{ fontSize: 11, color: C.faint, marginBottom: batchDone >= batchTotal ? 16 : 0 }}>
              {batchDone >= batchTotal ? "All results have been sent to the printer." : "Please wait — do not close the application."}
            </div>

            {batchDone >= batchTotal && (
              <button
                onClick={closeBatchOverlay}
                style={Btn("accent", { height: 36, padding: "0 24px", fontSize: 13, width: "100%", justifyContent: "center" })}
              >
                ✓ Close Window
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function HeaderClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ textAlign: "right" }}>
      <div style={{ fontSize: 13, fontWeight: 700, fontVariantNumeric: "tabular-nums", letterSpacing: ".02em", color: "#fff", lineHeight: 1.1 }}>
        {time.toLocaleTimeString("en-US", { hour12: false })}
      </div>
      <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2, fontWeight: 500 }}>
        {time.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
      </div>
    </div>
  );
}
