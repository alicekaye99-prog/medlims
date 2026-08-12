import React, { useState, useEffect, useMemo, useRef } from "react";
import { C, Btn, inp, Field, Card, CardHead, uid, toInputDate, calcAge, fmtDate, getFlag } from "../../utils/helpers.jsx";
import { Icon } from "../common/Icons.jsx";
import { SECTIONS } from "../../constants/data.js";

export function LabEntry({
  section,
  secDef,
  tests = {},
  patients = [],
  staff = [],
  results = [],
  hospital,
  onSave,
  onPrint,
  onSwitchSection,
  preSelectedTests,
  prePatientId,
  preDraft,
  onSaveDraft,
  onDeleteDraft,
}) {
  const safeTests = tests || {};
  const secGroups = Array.isArray(safeTests[section]) ? safeTests[section] : [];
  const safePatients = Array.isArray(patients) ? patients : [];
  const safeStaff = Array.isArray(staff) ? staff : [];

  const [patientId, setPatientId] = useState(preDraft?.patientId || prePatientId || "");
  const [patientSearch, setPatientSearch] = useState("");
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const patientDropdownRef = useRef(null);

  const selectedPatient = safePatients.find((p) => p && p.id === patientId);

  const latest10Patients = useMemo(() => {
    return [...safePatients]
      .sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0))
      .slice(0, 10);
  }, [safePatients]);

  const filteredPatients = useMemo(() => {
    if (!patientSearch.trim()) return latest10Patients;
    const term = patientSearch.toLowerCase();
    return safePatients.filter(
      (p) =>
        p &&
        ((p.name || "").toLowerCase().includes(term) ||
          (p.mrn || p.pid || "").toLowerCase().includes(term) ||
          (p.id || "").toLowerCase().includes(term))
    );
  }, [safePatients, latest10Patients, patientSearch]);

  const [physician, setPhysician] = useState(preDraft?.physician || "");
  const [pathologist, setPathologist] = useState(preDraft?.pathologist || "");
  const [medtech, setMedtech] = useState(preDraft?.medtech || "");
  const [validatedBy, setValidatedBy] = useState(preDraft?.validatedBy || "");
  const [ward, setWard] = useState(preDraft?.ward || "");
  const [remarks, setRemarks] = useState(preDraft?.remarks || preDraft?.remark || "");

  const nowDT = () => {
    const n = new Date();
    return (
      n.getFullYear() +
      "-" +
      String(n.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(n.getDate()).padStart(2, "0") +
      "T" +
      String(n.getHours()).padStart(2, "0") +
      ":" +
      String(n.getMinutes()).padStart(2, "0")
    );
  };
  const [datetime, setDatetime] = useState(nowDT());

  const [catalogSearch, setCatalogSearch] = useState("");
  const [expandedGroups, setExpandedGroups] = useState({ 0: true, 1: true, 2: true, 3: true, 4: true });

  const [testValues, setTestValues] = useState(preDraft?.values || {});
  const [brands, setBrands] = useState(preDraft?.brands || {});
  const [countValues, setCountValues] = useState(preDraft?.countValues || {});
  const [manualMode, setManualMode] = useState({});
  const [savedSuccessObj, setSavedSuccessObj] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const isFormBasedSection = section === "fecalysis" || section === "urinalysis";

  const [ticked, setTicked] = useState(() => {
    const t = {};
    if (preDraft) {
      if (preDraft.ticked) Object.assign(t, preDraft.ticked);
      if (preDraft.values) {
        Object.keys(preDraft.values).forEach((id) => {
          if (preDraft.values[id]) t[id] = true;
        });
      }
    } else if (preSelectedTests && Array.isArray(preSelectedTests)) {
      preSelectedTests.forEach((id) => (t[id] = true));
    }
    return t;
  });

  useEffect(() => {
    if (section !== "fecalysis") return;
    const parasiteIds = ["fascaris", "ftrich", "fhook"];
    setTestValues((prev) => {
      const next = { ...prev };
      parasiteIds.forEach((id) => {
        if (!next[id]) next[id] = "NO OVA OF PARASITE SEEN";
      });
      if (!next["famoeba"]) next["famoeba"] = "NONE SEEN";
      return next;
    });
    setTicked((prev) => {
      const next = { ...prev };
      parasiteIds.forEach((id) => (next[id] = true));
      next["famoeba"] = true;
      return next;
    });
  }, [section]);

  useEffect(() => {
    if (prePatientId) setPatientId(prePatientId);
  }, [prePatientId]);

  useEffect(() => {
    if (!preDraft && safeStaff.length > 0) {
      const mt = safeStaff.find((s) => s && (s.role === "Medical Technologist" || s.role === "MedTech"));
      if (mt) setMedtech(mt.name);
      const path = safeStaff.find((s) => s && s.role === "Pathologist");
      if (path) {
        setPathologist(path.name);
        setValidatedBy(path.name);
      }
    }
  }, [safeStaff, preDraft]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (patientDropdownRef.current && !patientDropdownRef.current.contains(e.target)) {
        setShowPatientDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleGroupExpand = (idx) => {
    setExpandedGroups((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const isTicked = (id) => isFormBasedSection || !!ticked[id];

  const toggleTick = (id) => {
    setTicked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleManual = (id) => {
    setManualMode((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleResultChange = (id, val) => {
    setTestValues((prev) => ({ ...prev, [id]: val }));
    if (val && !ticked[id]) {
      setTicked((prev) => ({ ...prev, [id]: true }));
    }
  };

  const handleSetAllNegative = (grp) => {
    const newT = { ...ticked };
    const newV = { ...testValues };
    (grp.tests || []).forEach((t) => {
      newT[t.id] = true;
      const hasNegOpt = t.options?.some((o) => String(o).toLowerCase() === "negative");
      const normalIsNeg = String(t.normalText || "").toLowerCase() === "negative";
      if (normalIsNeg || hasNegOpt || !t.options?.length) {
        newV[t.id] = "Negative";
      }
    });
    setTicked(newT);
    setTestValues(newV);
  };

  const handleAllNegativeUrinalysis = () => {
    const chemIds = ["uprot", "ugluc", "uketo", "ubld", "uleuk", "ubili", "unitrite", "uurobili"];
    setTestValues((prev) => {
      const next = { ...prev };
      chemIds.forEach((id) => (next[id] = "Negative"));
      return next;
    });
  };

  const handleNormalMicroUrinalysis = () => {
    setTestValues((prev) => ({
      ...prev,
      uwbc: "0 - 2",
      urbc: "0 - 1",
      uep: "Few",
      ubact: "None",
      umucus: "None",
      ucryst: "None",
      ucasts: "None",
    }));
  };

  const selectedTestObjects = useMemo(() => {
    const list = [];
    secGroups.forEach((group) => {
      if (!group) return;
      (group.tests || []).forEach((test) => {
        if (test && isTicked(test.id)) {
          list.push({ ...test, groupName: group.group || "General Tests" });
        }
      });
    });
    return list;
  }, [secGroups, ticked, isFormBasedSection]);

  const handleSaveDraft = () => {
    if (!patientId) {
      alert("Please select a patient before saving a draft.");
      return;
    }

    const draftObj = {
      id: preDraft?.id || uid(),
      patientId,
      section,
      sectionLabel: secDef?.label || section,
      values: testValues,
      ticked,
      brands,
      countValues,
      remarks,
      ward,
      physician,
      medtech,
      pathologist,
      validatedBy,
      updatedAt: new Date().toISOString()
    };

    if (onSaveDraft) onSaveDraft(draftObj);

    setToastMsg(`Draft saved for ${selectedPatient?.name || "Patient"}`);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handleSave = (shouldPrint = false) => {
    if (!selectedPatient) {
      alert("Please select a patient before saving.");
      return;
    }

    if (selectedTestObjects.length === 0) {
      alert("Please select or tick at least one test parameter.");
      return;
    }

    const lines = selectedTestObjects.map((t) => {
      let val = testValues[t.id] || "";
      if (section === "fecalysis" && !val) {
        if (["fascaris", "ftrich", "fhook"].includes(t.id)) val = "NO OVA OF PARASITE SEEN";
        if (t.id === "famoeba") val = "NONE SEEN";
      }

      if ((t.showCount || t.id === "ucasts" || String(t.name || "").toLowerCase() === "casts") && countValues[t.id]) {
        const cnt = String(countValues[t.id]).trim();
        if (cnt) val = val ? `${cnt} - ${val}` : cnt;
      }

      const flag = getFlag(t, val);
      return {
        testId: t.id,
        testName: t.name,
        groupName: t.groupName,
        value: val,
        unit: t.unit || "",
        normalRange: t.normalText || (t.normalMin !== undefined ? `${t.normalMin} - ${t.normalMax}` : ""),
        normalMin: t.normalMin,
        normalMax: t.normalMax,
        flag: flag,
        brand: brands[t.id] || "",
        showBrand: t.showBrand || false,
        showUnit: t.showUnit !== false,
        showNormal: t.showNormal !== false,
        showFlag: t.showFlag !== false,
      };
    });

    const dtVal = datetime || nowDT();
    const dtDate = dtVal ? dtVal.slice(0, 10) : toInputDate();
    const dtRaw = dtVal ? dtVal.slice(11, 16) : "";
    const fmt12 = (t24) => {
      if (!t24) return "";
      const [h, m] = t24.split(":");
      let hh = parseInt(h, 10);
      const ap = hh >= 12 ? "PM" : "AM";
      hh = hh % 12 || 12;
      return `${hh}:${m} ${ap}`;
    };

    const resNumber = "RES-" + String(results.length + 1).padStart(5, "0");

    const newResult = {
      id: uid(),
      resultNo: resNumber,
      patientId: selectedPatient.id,
      patientName: selectedPatient.name, // EMBEDDED FAIL-SAFE METADATA
      patientMrn: selectedPatient.mrn || selectedPatient.pid || "",
      section,
      sectionLabel: secDef?.label || section,
      date: dtDate,
      time: fmt12(dtRaw),
      ward: ward || "OP",
      physician: physician || "",
      medtech: medtech || "",
      medtechLic: staff.find((s) => s.name === medtech)?.licenseNo || "",
      validatedBy: validatedBy || "",
      validatedByLic: staff.find((s) => s.name === validatedBy)?.licenseNo || "",
      pathologist: pathologist || "",
      pathologistLic: staff.find((s) => s.name === pathologist)?.licenseNo || "",
      remarks: remarks.trim(),
      remark: remarks.trim(),
      lines,
      printed: false,
      createdAt: new Date().toISOString(),
    };

    onSave(newResult);

    if (preDraft && onDeleteDraft) {
      onDeleteDraft(preDraft.id);
    }

    setSavedSuccessObj(newResult);
    setShowConfirm(true);

    if (shouldPrint && onPrint) {
      onPrint(newResult);
    }
  };

  const resetForm = () => {
    setTestValues({});
    setTicked({});
    setBrands({});
    setCountValues({});
    setManualMode({});
    setRemarks("");
    setSavedSuccessObj(null);
    setShowConfirm(false);
  };

  const getRefText = (test) => {
    if (test.normalText) return test.normalText;
    if (test.normalMin !== undefined && test.normalMax !== undefined) return `${test.normalMin} – ${test.normalMax}`;
    if (test.normalMin !== undefined) return `≥ ${test.normalMin}`;
    if (test.normalMax !== undefined) return `≤ ${test.normalMax}`;
    return "Normal";
  };

  const renderSingleFieldRow = (test) => {
    const val = testValues[test.id] || "";
    const isDropdown = test.inputType === "dropdown" || (Array.isArray(test.options) && test.options.length > 0);
    const useManual = !!manualMode[test.id];
    const refStr = getRefText(test);
    const flag = val ? getFlag(test, val) : "";

    return (
      <div key={test.id} style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
          <span style={{ fontWeight: 600, fontSize: 13, color: C.text }}>{test.name}</span>
          <span style={{ fontSize: 11, color: C.faint }}>Ref: {refStr}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6, width: 240, justifyContent: "flex-end" }}>
          {isDropdown && (
            <button
              type="button"
              title={useManual ? "Switch to dropdown" : "Switch to manual typing"}
              onClick={() => toggleManual(test.id)}
              style={{
                background: useManual ? "#eff6ff" : "#f0fdf4",
                border: `1px solid ${useManual ? "#bfdbfe" : "#bbf7d0"}`,
                color: useManual ? "#1d4ed8" : "#15803d",
                borderRadius: 5,
                padding: "2px 6px",
                fontSize: 10,
                fontWeight: 700,
                cursor: "pointer",
                height: 28,
              }}
            >
              {useManual ? "✎ Text" : "▾ Dropdown"}
            </button>
          )}

          {isDropdown && !useManual ? (
            <select
              value={val}
              onChange={(e) => handleResultChange(test.id, e.target.value)}
              style={inp({ width: 140, height: 32, fontWeight: 600 })}
            >
              <option value="">— Select —</option>
              {(test.options || []).map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={val}
              onChange={(e) => handleResultChange(test.id, e.target.value)}
              placeholder="Enter result"
              style={inp({ width: 140, height: 32 })}
            />
          )}

          {(test.showCount || test.id === "ucasts" || String(test.name || "").toLowerCase() === "casts") && (
            <input
              type="number"
              min="0"
              value={countValues[test.id] || ""}
              onChange={(e) => setCountValues({ ...countValues, [test.id]: e.target.value })}
              placeholder="# ct"
              style={inp({ width: 50, height: 32, textAlign: "center", fontWeight: 700, background: "#f5f3ff", color: "#5b21b6" })}
            />
          )}

          {test.unit && <span style={{ fontSize: 11, color: C.muted, minWidth: 32 }}>{test.unit}</span>}

          {flag ? (
            <span style={{ padding: "2px 6px", borderRadius: 8, fontSize: 10, fontWeight: 700, background: flag === "HI" ? C.dangerLight : C.accentLight, color: flag === "HI" ? C.danger : C.accent }}>
              {flag === "HI" ? "▲ HIGH" : "▼ LOW"}
            </span>
          ) : val ? (
            <span style={{ padding: "2px 6px", borderRadius: 8, fontSize: 10, fontWeight: 700, background: C.successLight, color: C.success }}>
              ✓ NORMAL
            </span>
          ) : null}
        </div>
      </div>
    );
  };

  const renderParasitologyBlock = (grp) => {
    const parasiteIds = ["fascaris", "ftrich", "fhook"];
    const amoeba = (grp.tests || []).find((t) => t.id === "famoeba");
    const noOvaTests = (grp.tests || []).filter((t) => parasiteIds.includes(t.id));

    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {noOvaTests.map((t) => {
          const val = testValues[t.id] || "NO OVA OF PARASITE SEEN";
          const isSeen = val !== "NO OVA OF PARASITE SEEN";

          return (
            <div key={t.id} style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontWeight: 600, fontSize: 13, color: C.text }}>{t.name}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 12 }}>
                  <input
                    type="radio"
                    name={`para_${t.id}`}
                    checked={!isSeen}
                    onChange={() => handleResultChange(t.id, "NO OVA OF PARASITE SEEN")}
                    style={{ accentColor: C.accent }}
                  />
                  <span style={{ fontWeight: !isSeen ? 700 : 400, color: !isSeen ? C.primary : C.text }}>
                    NO OVA OF PARASITE SEEN
                  </span>
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 12 }}>
                  <input
                    type="radio"
                    name={`para_${t.id}`}
                    checked={isSeen}
                    onChange={() => handleResultChange(t.id, "Seen: ")}
                    style={{ accentColor: C.accent }}
                  />
                  <span style={{ fontWeight: isSeen ? 700 : 400, color: isSeen ? C.primary : C.text }}>Seen</span>
                </label>

                {isSeen && (
                  <input
                    type="text"
                    value={val.startsWith("Seen: ") ? val.slice(6) : val}
                    onChange={(e) => handleResultChange(t.id, "Seen: " + e.target.value)}
                    placeholder="Count / coverslip"
                    style={inp({ width: 120, height: 28, fontSize: 11 })}
                  />
                )}
              </div>
            </div>
          );
        })}

        {amoeba && (() => {
          const val = testValues[amoeba.id] || "NONE SEEN";

          return (
            <div style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontWeight: 600, fontSize: 13, color: C.text }}>Amoeba</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 12 }}>
                  <input
                    type="radio"
                    name="para_amoeba"
                    checked={val === "NONE SEEN"}
                    onChange={() => handleResultChange(amoeba.id, "NONE SEEN")}
                    style={{ accentColor: C.accent }}
                  />
                  <span style={{ fontWeight: val === "NONE SEEN" ? 700 : 400 }}>None Seen</span>
                </label>

                <div style={{ display: "flex", gap: 16, paddingLeft: 20 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 12 }}>
                    <input
                      type="radio"
                      name="para_amoeba"
                      checked={val === "Cyst Seen"}
                      onChange={() => handleResultChange(amoeba.id, "Cyst Seen")}
                      style={{ accentColor: C.accent }}
                    />
                    <span style={{ fontWeight: val === "Cyst Seen" ? 700 : 400 }}>Cyst Seen</span>
                  </label>

                  <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 12 }}>
                    <input
                      type="radio"
                      name="para_amoeba"
                      checked={val === "Trophozoites Seen"}
                      onChange={() => handleResultChange(amoeba.id, "Trophozoites Seen")}
                      style={{ accentColor: C.accent }}
                    />
                    <span style={{ fontWeight: val === "Trophozoites Seen" ? 700 : 400 }}>Trophozoites Seen</span>
                  </label>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    );
  };

  if (showConfirm && savedSuccessObj) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <Card style={{ padding: 32, maxWidth: 520, width: "100%", textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.successLight, color: C.success, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px auto" }}>
            <Icon name="check" size={32} color={C.success} />
          </div>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: "0 0 6px 0" }}>Result Finalized & Saved</h2>
          <p style={{ fontSize: 13, color: C.muted, margin: "0 0 20px 0" }}>
            Record <strong>{savedSuccessObj.resultNo}</strong> for <strong>{selectedPatient?.name}</strong> has been saved to LIS permanent archive.
          </p>

          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 20 }}>
            <button onClick={() => onPrint && onPrint(savedSuccessObj)} style={Btn("accent", { height: 38, padding: "0 20px" })}>
              🖨 Print PDF Report
            </button>
            <button onClick={resetForm} style={Btn("ghost", { height: 38, padding: "0 20px" })}>
              ➕ New Entry
            </button>
          </div>

          <div style={{ paddingTop: 16, borderTop: `1px solid ${C.border}`, textAlign: "left" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", marginBottom: 8 }}>
              Add another exam for {selectedPatient?.name} in:
            </div>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {SECTIONS.filter((s) => s.id !== section).map((s) => (
                <button
                  key={s.id}
                  onClick={() => onSwitchSection && onSwitchSection("lab:" + s.id, selectedPatient?.id)}
                  style={{ padding: "5px 12px", borderRadius: 6, border: `1px solid ${C.accent}`, background: "#fff", color: C.accent, fontWeight: 600, fontSize: 11, cursor: "pointer" }}
                >
                  + {s.label}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, pb: 70, position: "relative" }}>
      
      {/* Toast Notif */}
      {toastMsg && (
        <div style={{ position: "fixed", bottom: 80, right: 24, background: C.primary, color: "#fff", padding: "10px 18px", borderRadius: 8, zIndex: 2000, fontWeight: 600, boxShadow: "0 10px 25px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="check" size={16} color={C.success} />
          {toastMsg}
        </div>
      )}

      {/* Form Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: 0 }}>
            {secDef?.label || section} <span style={{ color: C.muted, fontWeight: 500 }}>› Result Entry Form</span>
          </h1>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleSaveDraft} style={{ ...Btn("ghost", { height: 36, padding: "0 18px" }), border: `1.5px solid ${C.warning}`, color: C.warning }}>
            Save as Draft
          </button>
          <button onClick={() => handleSave(true)} style={Btn("accent", { height: 36, padding: "0 18px" })}>
            Save & Print Report
          </button>
        </div>
      </div>

      {/* Draft Banner */}
      {preDraft && (
        <div style={{ background: C.warningLight, border: "1px solid #fde68a", color: "#92400e", padding: "10px 14px", borderRadius: 8, fontSize: 12.5, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="hospitalinfo" size={18} color="#92400e" />
          <span>Draft Loaded: Resuming in-progress entry for <strong>{selectedPatient?.name || "Patient"}</strong>.</span>
        </div>
      )}

      {/* Patient & Staff Header */}
      <Card style={{ padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative", minWidth: 280 }} ref={patientDropdownRef}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#eff6ff", color: C.accent, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${C.accentMid}` }}>
              <Icon name="userOutline" size={22} color={C.accent} />
            </div>

            <div>
              {selectedPatient ? (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{selectedPatient.name}</span>
                    <button
                      onClick={() => { setPatientId(""); setShowPatientDropdown(true); }}
                      style={{ background: "transparent", border: "none", color: C.accent, fontSize: 11, fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}
                    >
                      Change
                    </button>
                  </div>

                  <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>
                    PID: {selectedPatient.mrn || selectedPatient.pid || selectedPatient.id.slice(0, 8).toUpperCase()} • {selectedPatient.gender || "Male"} • {selectedPatient.age || calcAge(selectedPatient.dob)}
                  </div>
                </div>
              ) : (
                <div style={{ position: "relative", width: 240 }}>
                  <input
                    type="text"
                    value={patientSearch}
                    onChange={(e) => { setPatientSearch(e.target.value); setShowPatientDropdown(true); }}
                    onFocus={() => setShowPatientDropdown(true)}
                    placeholder="Search patient or ID..."
                    style={{ width: "100%", height: 36, paddingLeft: 10, paddingRight: 10, borderRadius: 6, border: `1px solid ${showPatientDropdown ? C.accent : C.border}`, fontSize: 12, outline: "none", boxSizing: "border-box" }}
                  />

                  {showPatientDropdown && (
                    <div style={{ position: "absolute", top: "100%", left: 0, right: 0, maxHeight: 220, background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, boxShadow: "0 8px 20px rgba(0,0,0,0.15)", zIndex: 500, padding: 6, display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", padding: "4px 6px" }}>
                        {patientSearch.trim() ? "Search Results:" : "Recent Patients:"}
                      </div>

                      <div style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: 2, maxHeight: 170 }}>
                        {filteredPatients.length === 0 ? (
                          <div style={{ padding: 10, textAlign: "center", fontSize: 11.5, color: C.muted }}>No matching patients</div>
                        ) : (
                          filteredPatients.map((p) => (
                            <div
                              key={p.id}
                              onClick={() => { setPatientId(p.id); setShowPatientDropdown(false); setPatientSearch(""); }}
                              style={{ padding: "6px 8px", borderRadius: 4, background: "transparent", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = C.accentLight)}
                              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                            >
                              <div>
                                <div style={{ fontWeight: 600, fontSize: 12, color: C.text }}>{p.name}</div>
                                <div style={{ fontSize: 10.5, color: C.muted }}>ID: {p.mrn || p.pid || p.id.slice(0, 8)}</div>
                              </div>
                              <span style={{ fontSize: 10.5, color: C.accent, fontWeight: 600 }}>Select →</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", flex: 1, justifyContent: "flex-end" }}>
            <Field label="DATE & TIME">
              <input
                type="datetime-local"
                value={datetime}
                onChange={(e) => setDatetime(e.target.value)}
                style={inp({ width: 160, height: 32 })}
              />
            </Field>

            <Field label="WARD / ROOM">
              <input
                type="text"
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                placeholder="OP / Ward"
                style={inp({ width: 90, height: 32 })}
              />
            </Field>

            <Field label="PHYSICIAN">
              <input
                list="physician-list"
                value={physician}
                onChange={(e) => setPhysician(e.target.value)}
                placeholder="Physician..."
                style={inp({ width: 130, height: 32 })}
              />
              <datalist id="physician-list">
                {safeStaff.filter((s) => s && (s.role === "Physician" || String(s.role || "").includes("Doctor"))).map((s) => (
                  <option key={s.id} value={s.name} />
                ))}
              </datalist>
            </Field>

            <Field label="PATHOLOGIST *">
              <input
                list="pathologist-list"
                value={pathologist}
                onChange={(e) => setPathologist(e.target.value)}
                placeholder="Pathologist..."
                style={inp({ width: 130, height: 32 })}
              />
              <datalist id="pathologist-list">
                {safeStaff.filter((s) => s && s.role === "Pathologist").map((s) => (
                  <option key={s.id} value={s.name} />
                ))}
              </datalist>
            </Field>

            <Field label="PERFORMED BY *">
              <input
                list="medtech-list"
                value={medtech}
                onChange={(e) => setMedtech(e.target.value)}
                placeholder="MedTech..."
                style={inp({ width: 130, height: 32 })}
              />
              <datalist id="medtech-list">
                {safeStaff.filter((s) => s && (s.role === "Medical Technologist" || s.role === "MedTech")).map((s) => (
                  <option key={s.id} value={s.name} />
                ))}
              </datalist>
            </Field>

            <Field label="VALIDATED BY">
              <input
                list="validator-list"
                value={validatedBy}
                onChange={(e) => setValidatedBy(e.target.value)}
                placeholder="Validator..."
                style={inp({ width: 130, height: 32 })}
              />
              <datalist id="validator-list">
                {safeStaff.map((s) => (
                  <option key={s.id} value={s.name} />
                ))}
              </datalist>
            </Field>
          </div>
        </div>
      </Card>

      {/* Urinalysis Layout */}
      {section === "urinalysis" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card>
              <CardHead title="Physical Examination" icon={<Icon name="parameters" size={18} color={C.accent} />} />
              <div style={{ display: "flex", flexDirection: "column" }}>
                {(secGroups.find((g) => g.group === "Physical Examination")?.tests || []).map((t) => renderSingleFieldRow(t))}
              </div>
            </Card>

            <Card>
              <CardHead
                title="Chemical Examination"
                icon={<Icon name="parameters" size={18} color={C.accent} />}
                right={
                  <button
                    type="button"
                    onClick={handleAllNegativeUrinalysis}
                    style={{ background: "#eff6ff", border: "1px solid #bfdbfe", color: "#2563eb", padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: "pointer" }}
                  >
                    ⚡ All Negative
                  </button>
                }
              />
              <div style={{ display: "flex", flexDirection: "column" }}>
                {(secGroups.find((g) => g.group === "Chemical Examination")?.tests || []).map((t) => renderSingleFieldRow(t))}
              </div>
            </Card>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card>
              <CardHead
                title="Microscopic Examination"
                icon={<Icon name="parameters" size={18} color={C.accent} />}
                right={
                  <button
                    type="button"
                    onClick={handleNormalMicroUrinalysis}
                    style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: "pointer" }}
                  >
                    ⚡ Normal Micro
                  </button>
                }
              />
              <div style={{ display: "flex", flexDirection: "column" }}>
                {(secGroups.find((g) => g.group === "Microscopic Examination")?.tests || []).map((t) => renderSingleFieldRow(t))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Fecalysis Layout */}
      {section === "fecalysis" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card>
              <CardHead title="Macroscopic" icon={<Icon name="parameters" size={18} color={C.accent} />} />
              <div style={{ display: "flex", flexDirection: "column" }}>
                {(secGroups.find((g) => g.group === "Macroscopic")?.tests || []).map((t) => renderSingleFieldRow(t))}
              </div>
            </Card>

            <Card>
              <CardHead title="Microscopic" icon={<Icon name="parameters" size={18} color={C.accent} />} />
              <div style={{ display: "flex", flexDirection: "column" }}>
                {(secGroups.find((g) => g.group === "Microscopic")?.tests || []).map((t) => renderSingleFieldRow(t))}
              </div>
            </Card>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card>
              <CardHead title="Parasitology" icon={<Icon name="parameters" size={18} color={C.accent} />} />
              {renderParasitologyBlock(secGroups.find((g) => g.group === "Parasitology") || { tests: [] })}
            </Card>
          </div>
        </div>
      )}

      {/* Catalog-based Sections */}
      {!isFormBasedSection && (
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 16 }}>
          <Card style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: C.text }}>Test Catalog</span>

            <input
              type="text"
              placeholder="Search tests..."
              value={catalogSearch}
              onChange={(e) => setCatalogSearch(e.target.value)}
              style={inp({ width: "100%", height: 32, paddingLeft: 10 })}
            />

            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
              {secGroups.map((group, gIdx) => {
                if (!group) return null;
                const isExpanded = expandedGroups[gIdx] !== false;
                const matchingTests = (group.tests || []).filter((t) =>
                  t && (t.name || "").toLowerCase().includes(catalogSearch.toLowerCase())
                );

                if (catalogSearch && matchingTests.length === 0) return null;

                return (
                  <div key={gIdx} style={{ border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
                    <div
                      onClick={() => toggleGroupExpand(gIdx)}
                      style={{ padding: "8px 12px", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
                    >
                      <div style={{ fontWeight: 700, fontSize: 12, color: C.accent, display: "flex", alignItems: "center", gap: 6 }}>
                        <Icon name="parameters" size={14} color={C.accent} />
                        {group.group} ({(group.tests || []).length})
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleSetAllNegative(group); }}
                          style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", padding: "2px 6px", borderRadius: 4, fontSize: 10, fontWeight: 700, cursor: "pointer" }}
                        >
                          ✓ All Neg
                        </button>
                        <Icon name={isExpanded ? "chevronUp" : "chevronDown"} size={14} color={C.muted} />
                      </div>
                    </div>

                    {isExpanded && (
                      <div style={{ padding: "6px 12px", display: "flex", flexDirection: "column", gap: 6, background: "#fff" }}>
                        {(matchingTests.length > 0 ? matchingTests : group.tests || []).map((test) => {
                          if (!test) return null;
                          const isChecked = isTicked(test.id);

                          return (
                            <label
                              key={test.id}
                              style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: C.text, cursor: "pointer", padding: "3px 0" }}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleTick(test.id)}
                                style={{ width: 15, height: 15, accentColor: C.accent, cursor: "pointer" }}
                              />
                              <span style={{ fontWeight: isChecked ? 600 : 400 }}>{test.name}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <CardHead
              title={`Selected Tests (${selectedTestObjects.length})`}
              sub="Fill in results for active parameters below"
              icon={<Icon name="reports" size={18} color={C.accent} />}
            />

            {selectedTestObjects.length === 0 ? (
              <div style={{ padding: 48, textAlign: "center", color: C.faint, fontSize: 12.5 }}>
                No tests selected yet. Select tests from the catalog on the left.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "8px 16px", background: "#f8fafc", borderBottom: `1px solid ${C.border}`, display: "grid", gridTemplateColumns: "1fr 220px 100px", fontWeight: 700, fontSize: 11, color: C.muted, textTransform: "uppercase" }}>
                  <span>TEST</span>
                  <span style={{ textAlign: "center" }}>RESULT</span>
                  <span style={{ textAlign: "right" }}>FLAG / STATUS</span>
                </div>

                {selectedTestObjects.map((test) => {
                  const val = testValues[test.id] || "";
                  const refStr = getRefText(test);
                  const isDropdown = test.inputType === "dropdown" || (Array.isArray(test.options) && test.options.length > 0);
                  const useManual = !!manualMode[test.id];
                  const flag = val ? getFlag(test, val) : "";

                  return (
                    <div key={test.id} style={{ padding: "10px 16px", borderBottom: `1px solid ${C.border}`, display: "grid", gridTemplateColumns: "1fr 220px 100px", alignItems: "center" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <span style={{ fontWeight: 600, fontSize: 13, color: C.text }}>{test.name}</span>
                        <span style={{ fontSize: 11, color: C.faint }}>Ref: {refStr}</span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
                        {isDropdown && (
                          <button
                            type="button"
                            title={useManual ? "Switch to dropdown" : "Switch to manual typing"}
                            onClick={() => toggleManual(test.id)}
                            style={{
                              background: useManual ? "#eff6ff" : "#f0fdf4",
                              border: `1px solid ${useManual ? "#bfdbfe" : "#bbf7d0"}`,
                              color: useManual ? "#1d4ed8" : "#15803d",
                              borderRadius: 5,
                              padding: "2px 5px",
                              fontSize: 10,
                              fontWeight: 700,
                              cursor: "pointer",
                              height: 28,
                            }}
                          >
                            {useManual ? "✎" : "▾"}
                          </button>
                        )}

                        {isDropdown && !useManual ? (
                          <select
                            value={val}
                            onChange={(e) => handleResultChange(test.id, e.target.value)}
                            style={inp({ width: 120, height: 32, fontWeight: 600 })}
                          >
                            <option value="">— Select —</option>
                            {(test.options || []).map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={val}
                            onChange={(e) => handleResultChange(test.id, e.target.value)}
                            placeholder="Result..."
                            style={inp({ width: 120, height: 32, textAlign: "center", fontWeight: 600 })}
                          />
                        )}

                        {test.unit && <span style={{ fontSize: 11, color: C.muted }}>{test.unit}</span>}
                      </div>

                      <div style={{ textAlign: "right" }}>
                        {flag ? (
                          <span style={{ padding: "2px 8px", borderRadius: 10, fontSize: 10, fontWeight: 800, background: flag === "HI" ? C.dangerLight : C.accentLight, color: flag === "HI" ? C.danger : C.accent }}>
                            {flag === "HI" ? "▲ HIGH" : "▼ LOW"}
                          </span>
                        ) : val ? (
                          <span style={{ padding: "2px 8px", borderRadius: 12, background: C.successLight, color: C.success, fontSize: 10.5, fontWeight: 700 }}>
                            ✓ NORMAL
                          </span>
                        ) : (
                          <span style={{ padding: "2px 8px", borderRadius: 12, background: "#f1f5f9", color: C.muted, fontSize: 10.5, fontWeight: 500 }}>
                            PENDING
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Remarks Section */}
      <Card style={{ marginTop: 8 }}>
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase" }}>
            REMARKS / CLINICAL IMPRESSION
          </label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Clinical impression or remarks..."
            rows={2}
            style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 12.5, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
          />
        </div>
      </Card>

      {/* Sticky Bottom Action Bar */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 220,
          right: 0,
          background: "#ffffff",
          borderTop: `1px solid ${C.border}`,
          boxShadow: "0 -4px 16px rgba(0,0,0,0.06)",
          padding: "10px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 1000,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "#eff6ff", color: C.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="reports" size={20} color={C.accent} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13.5, color: C.text }}>
              {selectedTestObjects.length} Tests Selected
            </div>
            <div style={{ fontSize: 11.5, color: C.muted }}>
              Save as Draft to resume later, or Save Final Result to archive permanently
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={handleSaveDraft}
            style={{ ...Btn("ghost", { height: 38, padding: "0 20px", fontSize: 13 }), border: `1.5px solid ${C.warning}`, color: C.warning, background: C.warningLight }}
          >
            💾 Save as Draft
          </button>

          <button onClick={() => handleSave(false)} style={Btn("accent", { height: 38, padding: "0 24px", fontSize: 13 })}>
            ✓ Save Final Result
          </button>
        </div>
      </div>
    </div>
  );
}
