import { useState, useEffect } from "react";
import { SECTIONS, DEFAULT_TESTS, dbLoad, dbSave, loadLicense, verifyLicenseSig, licenseStatus } from "./constants/data.js";
import { C, toInputDate, dbLoadChunked, dbSaveChunked, uid } from "./utils/helpers.jsx";
import { downloadResultAsPDF } from "./utils/pdfGenerator.js";
import { Icon } from "./components/common/Icons.jsx";

import { SerialKeyGate, LicenseExpiredGate } from "./components/gates/SerialKeyGate.jsx";
import { SwitchProfileModal } from "./components/common/SwitchProfileModal.jsx";
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
  const [licState, setLicState] = useState("loading");
  const [licData, setLicData] = useState(null);
  const [showKeyEntry, setShowKeyEntry] = useState(false);

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
        setLicState("none");
        setShowKeyEntry(true);
        return;
      }
      const status = licenseStatus(savedLic);
      setLicData(savedLic);
      setLicState(status);
      if (status === "valid") {
        setShowKeyEntry(false);
      } else if (status === "expired") {
        setShowKeyEntry(false);
      } else {
        setShowKeyEntry(true);
      }
    }
    checkSavedLicense();
  }, []);

  const handleActivated = () => {
    const savedLic = loadLicense();
    setLicData(savedLic || { type: "lifetime" });
    setLicState("valid");
    setShowKeyEntry(false);
  };

  if (licState === "loading") {
    return (
      <div style={{ minHeight: "100vh", background: "#0F2D52", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif", fontSize: 14 }}>
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
  const [tests, setTests] = useState(null);
  const [hospital, setHospital] = useState({ name: "", address: "", phone: "", setupDone: false });
  const [accounts, setAccounts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [switchModal, setSwitchModal] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [printQ, setPrintQ] = useState([]);
  const [crossSectionPatientId, setCrossSectionPatientId] = useState("");

  // Declared BEFORE useEffect dependencies
  const curSection = view.startsWith("lab:") ? view.slice(4) : null;
  const secDef = curSection ? SECTIONS.find(s => s.id === curSection) : null;

  useEffect(() => {
    setPatients(dbLoadChunked("lims_p3", []));
    setStaff(dbLoad("lims_s3", []));
    setResults(dbLoadChunked("lims_r3", []));
    const savedTests = dbLoad("lims_t3", null);
    if (savedTests) {
      const merged = { ...savedTests };
      Object.keys(DEFAULT_TESTS).forEach(k => {
        if (!merged[k] || merged[k].length === 0) merged[k] = JSON.parse(JSON.stringify(DEFAULT_TESTS[k]));
      });
      setTests(merged);
    } else {
      setTests(DEFAULT_TESTS);
    }
    const hi = dbLoad("lims_h3", null);
    if (hi) setHospital(hi);
    const accs = dbLoad("lims_accounts", []);
    if (accs.length === 0) {
      const defaultAccounts = [{ id: uid(), username: "admin", password: "admin123", role: "Admin", name: "Administrator", createdAt: toInputDate() }];
      setAccounts(defaultAccounts);
      dbSave("lims_accounts", defaultAccounts);
    } else {
      setAccounts(accs);
    }
    setLoaded(true);
  }, []);

  const sp = v => { setPatients(v); dbSaveChunked("lims_p3", v); };
  const ss = v => { setStaff(v); dbSave("lims_s3", v); };
  const sr = v => { setResults(v); dbSaveChunked("lims_r3", v); };
  const st = v => { setTests(v); dbSave("lims_t3", v); };
  const sh = v => { setHospital(v); dbSave("lims_h3", v); };
  const sa = v => { setAccounts(v); dbSave("lims_accounts", v); };

  const addResult = r => { const u = [r, ...results]; sr(u); };
  useEffect(() => { if (crossSectionPatientId) setCrossSectionPatientId(""); }, [curSection]);
  const delResult = id => sr(results.filter(r => r.id !== id));
  const editResult = r => sr(results.map(x => x.id === r.id ? r : x));

  useEffect(() => {
    if (!printQ || printQ.length === 0) return;
    const isBatch = !!printQ._batch;
    const [next, ...rest] = printQ;
    const pt = patients.find(p => p.id === next.patientId);
    downloadResultAsPDF(next, pt, hospital, isBatch, staff)
      .then(() => {
        setResults(prev => {
          const updated = prev.map(r => r.id === next.id ? { ...r, printed: true, printedAt: new Date().toISOString() } : r);
          dbSave("lims_r3", updated);
          return updated;
        });
        if (rest.length > 0) {
          setTimeout(() => {
            const nextQ = [...rest];
            if (isBatch) nextQ._batch = true;
            setPrintQ(nextQ);
          }, 600);
        } else setPrintQ([]);
      })
      .catch(e => { console.error(e); setPrintQ(rest); });
  }, [printQ]);

  if (!loaded || !tests) return <div style={{ padding: 40, textAlign: "center", fontFamily: "'Inter', sans-serif", color: C.muted }}>Loading Enterprise LIMS…</div>;
  if (!hospital.setupDone) return <WelcomePage hospital={hospital} onSave={h => { const v = { ...h, setupDone: true }; sh(v); }}/>;
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
    <div style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: 13, background: C.bg, minHeight: "100vh", display: "flex", flexDirection: "column", color: C.text }}>
      
      {/* Top Enterprise Header */}
      <header style={{ background: C.primary, color: "#fff", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 8px rgba(15,45,82,0.15)", zIndex: 10 }}>
        
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.2)" }}>
            <Icon name="hospital" size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-.01em", color: "#fff" }}>{hospital.name || "Enterprise LIMS"}</div>
            <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.6)", letterSpacing: ".04em", textTransform: "uppercase" }}>Clinical Information System</div>
          </div>
        </div>

        {/* User Info & Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <HeaderClock />
          <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.15)" }} />
          
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13, boxShadow: "0 2px 6px rgba(37,99,235,0.3)" }}>
              {currentUser.name ? currentUser.name.slice(0, 2).toUpperCase() : "US"}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontWeight: 600, fontSize: 13, color: "#fff", lineHeight: 1.2 }}>{currentUser.name}</span>
              <span style={{ fontSize: 10.5, color: "#93c5fd", fontWeight: 500, marginTop: 2 }}>{currentUser.role}</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 6, marginLeft: 8 }}>
            <button onClick={() => setSwitchModal(true)} style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6, padding: "6px 10px", cursor: "pointer", fontSize: 11.5, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
              <Icon name="switch" size={14} color="#fff" /> Switch
            </button>
            <button onClick={() => setCurrentUser(null)} style={{ background: "rgba(239,68,68,0.2)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 6, padding: "6px 10px", cursor: "pointer", fontSize: 11.5, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
              <Icon name="logout" size={14} color="#fca5a5" /> Exit
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        
        {/* Navigation Sidebar */}
        <aside style={{ width: 220, background: C.sidebarBg, display: "flex", flexDirection: "column", padding: "16px 12px", borderRight: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: ".08em", padding: "0 10px 10px 10px" }}>Core Modules</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
            {navItems.map(n => {
              const active = view === n.id;
              return (
                <button
                  key={n.id}
                  onClick={() => setView(n.id)}
                  style={{
                    width: "100%",
                    background: active ? C.accent : "transparent",
                    border: "none",
                    borderRadius: 8,
                    color: active ? "#fff" : "rgba(255,255,255,0.7)",
                    padding: "9px 12px",
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    fontSize: 13,
                    fontWeight: active ? 600 : 500,
                    transition: "all .15s ease-in-out"
                  }}
                >
                  <Icon name={n.icon} size={18} color={active ? "#fff" : "rgba(255,255,255,0.6)"} />
                  <span>{n.label}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Content Area */}
        <main style={{ flex: 1, padding: 24, overflowY: "auto", background: C.bg }}>
          {view === "dashboard" && <DashboardView results={results} patients={patients} sections={SECTIONS} onNav={setView} onPrint={r => setPrintQ(q => [...q, r])}/>}
          {curSection && <LabEntry key={curSection} section={curSection} secDef={secDef} tests={tests} patients={patients} staff={staff} results={results} hospital={hospital} onSave={addResult} onPrint={r => setPrintQ(q => [...q, r])} onSwitchSection={(v, pId) => { if (pId) setCrossSectionPatientId(pId); setView(v); }} preSelectedTests={barcodeNav?.section === curSection ? barcodeNav.testIds : null} prePatientId={barcodeNav?.section === curSection ? barcodeNav.patientId : crossSectionPatientId}/>}
          {view === "reports" && <ReportsView results={results} patients={patients} staff={staff} onPrint={r => setPrintQ(q => [...q, r])} onBatchPrint={q => setPrintQ(q)} onDelete={delResult} onEdit={editResult}/>}
          {view === "patients" && <PatientsView data={patients} onSave={sp}/>}
          {view === "personnel" && <PersonnelView data={staff} onSave={ss}/>}
          {view === "parameters" && <ParametersView tests={tests} onSave={st}/>}
          {view === "templates" && <TemplatesView sections={SECTIONS} hospital={hospital}/>}
          {view === "summary" && <SummaryView results={results} patients={patients} hospital={hospital}/>}
          {view === "hospitalinfo" && <HospitalView data={hospital} onSave={sh}/>}
          {view === "accounts" && <AccountsView accounts={accounts} onSave={sa}/>}
          {view === "barcode" && <BarcodeView patients={patients} tests={tests} sections={SECTIONS} onNav={(v, bNav) => { if (bNav) setBarcodeNav(bNav); setView(v); }}/>}
        </main>
      </div>

      {switchModal && <SwitchProfileModal accounts={accounts} currentUser={currentUser} onSwitch={u => { setCurrentUser(u); setSwitchModal(false); }} onClose={() => setSwitchModal(false)}/>}
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
      <div style={{ fontSize: 13, fontWeight: 600, fontVariantNumeric: "tabular-nums", letterSpacing: ".02em", color: "#fff" }}>
        {time.toLocaleTimeString("en-US", { hour12: false })}
      </div>
      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", marginTop: 1 }}>
        {time.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
      </div>
    </div>
  );
}
