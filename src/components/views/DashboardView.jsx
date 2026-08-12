import React, { useState, useMemo, useRef, useEffect } from "react";
import { C, Btn, inp, Card, CardHead, fmtDate, toInputDate, calcAge } from "../../utils/helpers.jsx";
import { Icon } from "../common/Icons.jsx";
import { SECTIONS } from "../../constants/data.js";

// Custom Module SVG Icons
function ModuleSVG({ id, size = 22 }) {
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" };
  switch (id) {
    case "hematology":
      return <svg {...props}><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>;
    case "bloodchem":
      return <svg {...props}><path d="M10 2v7.31L4.75 18.1A2 2 0 0 0 6.47 21h11.06a2 2 0 0 0 1.72-2.9L14 9.31V2"/><line x1="8.5" y1="2" x2="15.5" y2="2"/><line x1="7" y1="15" x2="17" y2="15"/></svg>;
    case "urinalysis":
      return <svg {...props}><path d="M14.5 2v17.5a2.5 2.5 0 0 1-5 0V2"/><line x1="8.5" y1="2" x2="15.5" y2="2"/><path d="M9.5 12h5"/></svg>;
    case "serology":
      return <svg {...props}><circle cx="12" cy="12" r="3"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="5" r="2"/><circle cx="12" cy="20" r="2"/><line x1="12" y1="15" x2="12" y2="18"/><line x1="9.8" y1="9.8" x2="6.5" y2="6.5"/><line x1="14.2" y1="9.8" x2="17.5" y2="6.5"/></svg>;
    case "bloodtyping":
      return <svg {...props}><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>;
    case "fecalysis":
      return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/><circle cx="8" cy="16" r="1"/></svg>;
    case "microbiology":
      return <svg {...props}><path d="M6 18h12"/><path d="M12 18v-4"/><path d="M9 14h6"/><path d="M12 10a4 4 0 0 0-4-4H7a1 1 0 0 0-1 1v4"/><circle cx="12" cy="6" r="2"/></svg>;
    case "coagulation":
      return <svg {...props}><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></svg>;
    default:
      return <svg {...props}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><line x1="9" y1="12" x2="11" y2="12"/><line x1="9" y1="16" x2="15" y2="16"/></svg>;
  }
}

// Module Color Styling
const MODULE_THEMES = {
  hematology: { accent: "#dc2626", bg: "#fef2f2" },
  bloodchem: { accent: "#7c3aed", bg: "#f5f3ff" },
  urinalysis: { accent: "#d97706", bg: "#fffbeb" },
  serology: { accent: "#0d9488", bg: "#f0fdf4" },
  bloodtyping: { accent: "#991b1b", bg: "#fef2f2" },
  fecalysis: { accent: "#65a30d", bg: "#f7fee7" },
  microbiology: { accent: "#16a34a", bg: "#f0fdf4" },
  coagulation: { accent: "#ea580c", bg: "#fff7ed" },
  othertests: { accent: "#475569", bg: "#f8fafc" }
};

export function DashboardView({ results = [], patients = [], drafts = [], sections = [], onNav, onPrint, onBatchPrint, onResumeDraft }) {
  const today = toInputDate();

  // Fast O(1) Patient Lookup Map
  const patientMap = useMemo(() => {
    const map = new Map();
    patients.forEach((p) => map.set(p.id, p));
    return map;
  }, [patients]);

  const isToday = (item) => {
    if (!item) return false;
    const d = item.date || "";
    const ca = (item.createdAt || "").slice(0, 10);
    return d === today || ca === today;
  };

  // Metrics
  const patientsToday = useMemo(() => {
    return patients.filter((p) => isToday(p)).length;
  }, [patients, today]);

  const testsToday = useMemo(() => {
    return results.filter((r) => isToday(r)).length;
  }, [results, today]);

  // Today's Abnormal Flags Grouped by Exam Submission Record
  const flagsGroupedByRecord = useMemo(() => {
    const list = [];
    results.filter((r) => isToday(r)).forEach((r) => {
      const p = patientMap.get(r.patientId);
      const flagLines = (r.lines || []).filter((l) => l.flag === "HI" || l.flag === "LO");
      if (flagLines.length > 0) {
        list.push({
          recordId: r.id || uid(),
          resultNo: r.resultNo || (r.id ? r.id.slice(0, 8) : "RES-000"),
          patientName: p ? p.name : "Test Patient",
          patientMrn: p ? (p.mrn || p.pid || "MRN-000") : "MRN-000",
          sectionLabel: r.sectionLabel || r.section || "Laboratory",
          sectionId: r.section,
          date: r.date,
          time: r.time || "Today",
          dateTimeStr: `${fmtDate(r.date)} ${r.time ? `(${r.time})` : ""}`.trim(),
          resultObj: r,
          lines: flagLines.map((line) => ({
            testName: line.testName || "Parameter",
            value: `${line.value || ""} ${line.unit || ""}`.trim(),
            flag: line.flag || "HI"
          }))
        });
      }
    });
    return list;
  }, [results, today, patientMap]);

  const totalFlaggedCount = useMemo(() => {
    return flagsGroupedByRecord.reduce((sum, item) => sum + item.lines.length, 0);
  }, [flagsGroupedByRecord]);

  // Quicksearch states
  const [qsQuery, setQsQuery] = useState("");
  const [debouncedQsQuery, setDebouncedQsQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
  // Selected Patient for Lookup Modal
  const [modalPatient, setModalPatient] = useState(null);

  // Modals state
  const [activeModal, setActiveSecModal] = useState(null); // 'flags' | 'drafts' | 'quicksearch'
  const [flagSortBy, setFlagSortBy] = useState("time");
  const [modalChecked, setModalChecked] = useState({});

  // Modal Paginations (30 per page)
  const [flagPage, setFlagPage] = useState(1);
  const [qsPage, setQsPage] = useState(1);
  const [draftPage, setDraftPage] = useState(1);
  const MODAL_PER_PAGE = 30;

  // Debounce quicksearch
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQsQuery(qsQuery);
    }, 200);
    return () => clearTimeout(timer);
  }, [qsQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Matching patients for live dropdown
  const matchingPatients = useMemo(() => {
    const term = debouncedQsQuery.toLowerCase().trim();
    if (!term) return [];
    return patients.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(term) ||
        (p.mrn || p.pid || "").toLowerCase().includes(term)
    ).slice(0, 8);
  }, [debouncedQsQuery, patients]);

  const qsPatientRecords = useMemo(() => {
    if (!modalPatient) return [];
    return results.filter((r) => r.patientId === modalPatient.id);
  }, [modalPatient, results]);

  const totalQsPages = Math.max(1, Math.ceil(qsPatientRecords.length / MODAL_PER_PAGE));
  const paginatedQsRecords = useMemo(() => {
    return qsPatientRecords.slice((qsPage - 1) * MODAL_PER_PAGE, qsPage * MODAL_PER_PAGE);
  }, [qsPatientRecords, qsPage]);

  const selectPatientForLookup = (pt) => {
    setModalPatient(pt);
    setShowDropdown(false);
    setQsPage(1);
    setActiveSecModal("quicksearch");
    setModalChecked({});
  };

  const toggleModalCheck = (id) => {
    setModalChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSelectAllModal = (records) => {
    const allChecked = records.length > 0 && records.every(r => modalChecked[r.id]);
    if (allChecked) {
      setModalChecked({});
    } else {
      const next = {};
      records.forEach(r => { next[r.id] = true; });
      setModalChecked(next);
    }
  };

  const handleBatchPrintFromModal = () => {
    const selectedIds = Object.keys(modalChecked).filter((k) => modalChecked[k]);
    if (selectedIds.length === 0) return alert("Please select at least one record using the checkboxes.");

    const itemsToPrint = results.filter((r) => selectedIds.includes(r.id));
    if (onBatchPrint) onBatchPrint(itemsToPrint);
    setActiveSecModal(null);
    setModalChecked({});
  };

  // Sort & Paginate Flags by Exam Record
  const sortedFlagRecords = useMemo(() => {
    return [...flagsGroupedByRecord].sort((a, b) => {
      if (flagSortBy === "name") return (a.patientName || "").localeCompare(b.patientName || "");
      if (flagSortBy === "module") return (a.sectionLabel || "").localeCompare(b.sectionLabel || "");
      return (b.time || "").localeCompare(a.time || "");
    });
  }, [flagsGroupedByRecord, flagSortBy]);

  const totalFlagPages = Math.max(1, Math.ceil(sortedFlagRecords.length / MODAL_PER_PAGE));
  const paginatedFlagRecords = useMemo(() => {
    return sortedFlagRecords.slice((flagPage - 1) * MODAL_PER_PAGE, flagPage * MODAL_PER_PAGE);
  }, [sortedFlagRecords, flagPage]);

  // Paginate Drafts
  const totalDraftPages = Math.max(1, Math.ceil(drafts.length / MODAL_PER_PAGE));
  const paginatedDrafts = useMemo(() => {
    return drafts.slice((draftPage - 1) * MODAL_PER_PAGE, draftPage * MODAL_PER_PAGE);
  }, [drafts, draftPage]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      
      {/* 1. Prominent Quicksearch Bar with Live Dropdown */}
      <Card style={{ padding: "12px 18px", display: "flex", alignItems: "center", gap: 14, position: "relative" }}>
        <div style={{ position: "relative", flex: 1, display: "flex", alignItems: "center" }} ref={dropdownRef}>
          <div style={{ position: "absolute", left: 12, color: C.muted, display: "flex", alignItems: "center" }}>
            <Icon name="search" size={18} color={C.muted} />
          </div>
          <input
            type="text"
            value={qsQuery}
            onChange={(e) => {
              setQsQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => {
              if (qsQuery.trim()) setShowDropdown(true);
            }}
            placeholder="Search patient by name or ID (e.g. 'Juan Dela Cruz' or 'PT-00001')..."
            style={inp({ width: "100%", height: 40, paddingLeft: 38, paddingRight: 80, fontSize: 13.5, background: "#f8fafc", fontWeight: 500 })}
          />
          <span style={{ position: "absolute", right: 12, background: C.border, color: C.muted, fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, fontFamily: "monospace" }}>
            Ctrl + K
          </span>

          {/* Live Search Dropdown Panel */}
          {showDropdown && qsQuery.trim() && (
            <div style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: 6, background: "#fff", borderRadius: 10, border: `1px solid ${C.border}`, boxShadow: "0 12px 30px rgba(0,0,0,0.15)", zIndex: 1500, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "8px 12px", background: C.surface, borderBottom: `1px solid ${C.border}`, fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase" }}>
                Matching Patients ({matchingPatients.length})
              </div>

              {matchingPatients.length === 0 ? (
                <div style={{ padding: 16, textAlign: "center", color: C.muted, fontSize: 12 }}>
                  No patient found matching "{qsQuery}".
                </div>
              ) : (
                matchingPatients.map((pt) => {
                  const ptRecCount = results.filter((r) => r.patientId === pt.id).length;
                  return (
                    <div
                      key={pt.id}
                      onClick={() => selectPatientForLookup(pt)}
                      style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}`, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = C.accentLight)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{pt.name}</div>
                        <div style={{ fontSize: 11, color: C.muted }}>
                          ID: {pt.mrn || pt.pid || pt.id.slice(0, 8)} • {calcAge(pt.dob)} • {pt.gender || "—"}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: C.surface, color: C.muted, border: `1px solid ${C.border}` }}>
                          {ptRecCount} exam(s)
                        </span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: C.accent }}>View Records →</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        <span style={{ fontSize: 11.5, color: C.muted, whiteSpace: "nowrap" }}>
          Instant lookup across all 9 lab modules
        </span>
      </Card>

      {/* 2. Top Stat Cards (4 Horizontal Equal Width Grid) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        
        {/* Card 1: Patients Added Today */}
        <Card style={{ padding: 16, borderTop: `4px solid ${C.accent}`, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Patients Added Today
            </span>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: C.accentLight, color: C.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="patients" size={20} color={C.accent} />
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: C.accent, lineHeight: 1 }}>{patientsToday}</div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 8 }}>{patients.length} total registered</div>
        </Card>

        {/* Card 2: Tests Recorded Today */}
        <Card style={{ padding: 16, borderTop: `4px solid #0d9488`, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Tests Recorded Today
            </span>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: "#f0fdf4", color: "#0d9488", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="reports" size={20} color="#0d9488" />
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#0d9488", lineHeight: 1 }}>{testsToday}</div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 8 }}>{results.length} total records</div>
        </Card>

        {/* Card 3: Flags Today (Clickable) */}
        <Card
          onClick={(e) => {
            e.preventDefault();
            setFlagPage(1);
            setActiveSecModal("flags");
          }}
          style={{
            padding: 16,
            borderTop: `4px solid ${C.danger}`,
            background: "linear-gradient(180deg, #ffffff 0%, #fef2f2 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            cursor: "pointer",
            userSelect: "none",
            transition: "transform 0.15s ease, box-shadow 0.15s ease"
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(220, 38, 38, 0.15)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(15,23,42,0.05)"; }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Flags Today (High/Low)
            </span>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: C.dangerLight, color: C.danger, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="hospitalinfo" size={20} color={C.danger} />
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: C.danger, lineHeight: 1 }}>{totalFlaggedCount}</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
            <span style={{ fontSize: 11, color: C.muted }}>Abnormal values</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFlagPage(1);
                setActiveSecModal("flags");
              }}
              style={Btn("danger", { height: 26, fontSize: 10.5, padding: "0 10px" })}
            >
              View Details →
            </button>
          </div>
        </Card>

        {/* Card 4: Drafts (Clickable) */}
        <Card
          onClick={(e) => {
            e.preventDefault();
            setDraftPage(1);
            setActiveSecModal("drafts");
          }}
          style={{
            padding: 16,
            borderTop: `4px solid #475569`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            cursor: "pointer",
            userSelect: "none",
            transition: "transform 0.15s ease, box-shadow 0.15s ease"
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(71, 85, 105, 0.15)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(15,23,42,0.05)"; }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Drafts
            </span>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: C.surface, color: "#475569", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="reports" size={20} color="#475569" />
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#475569", lineHeight: 1 }}>{drafts.length}</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
            <span style={{ fontSize: 11, color: C.muted }}>In-progress entries</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setDraftPage(1);
                setActiveSecModal("drafts");
              }}
              style={Btn("ghost", { height: 26, fontSize: 10.5, padding: "0 10px" })}
            >
              Resume →
            </button>
          </div>
        </Card>

      </div>

      {/* 3. Laboratory Entry Modules Grid (9 Distinct Cards) */}
      <Card style={{ padding: 20 }}>
        <CardHead title="Laboratory Entry Modules" sub="Select a module to enter test results or manage active entries" icon={<Icon name="dashboard" size={18} color={C.accent} />} />
        
        <div style={{ padding: "16px 0 0 0", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {sections.map((sec) => {
            const countToday = results.filter((r) => r.section === sec.id && isToday(r)).length;
            const theme = MODULE_THEMES[sec.id] || { accent: C.accent, bg: C.accentLight };
            const isZero = countToday === 0;

            return (
              <div
                key={sec.id}
                onClick={() => onNav("lab:" + sec.id)}
                style={{
                  padding: "16px 18px",
                  borderRadius: 12,
                  border: `1.5px solid ${isZero ? C.border : theme.accent + "50"}`,
                  background: isZero ? "#fcfcfc" : "#ffffff",
                  opacity: isZero ? 0.75 : 1,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  transition: "all 0.18s ease",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.accent;
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = isZero ? C.border : theme.accent + "50";
                  e.currentTarget.style.opacity = isZero ? "0.75" : "1";
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.02)";
                }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 10, background: theme.bg, color: theme.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <ModuleSVG id={sec.id} size={22} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 13.5, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {sec.label}
                  </div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
                    {countToday} recorded today
                  </div>
                </div>

                <span style={{ fontSize: 13, color: theme.accent, fontWeight: 700 }}>→</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 4. MODALS */}

      {/* Modal A: Flags Today Detail (Grouped Card Layout) */}
      {activeModal === "flags" && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setActiveSecModal(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#ffffff", borderRadius: 14, width: "100%", maxWidth: 880, maxHeight: "85vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 25px 50px rgba(0,0,0,0.3)" }}>
            <div style={{ padding: "16px 20px", background: "#fef2f2", borderBottom: "1px solid #fecaca", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#dc2626", fontWeight: 700, fontSize: 15 }}>
                <Icon name="hospitalinfo" size={20} color="#dc2626" />
                Abnormal Flags Today ({totalFlaggedCount} Flagged Values across {flagsGroupedByRecord.length} Exam Record{flagsGroupedByRecord.length !== 1 ? "s" : ""})
              </div>
              <button onClick={() => setActiveSecModal(null)} style={{ background: "transparent", border: "none", color: "#dc2626", fontSize: 18, cursor: "pointer", fontWeight: 700 }}>✕</button>
            </div>

            <div style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", borderBottom: "1px solid #e2e8f0", flexShrink: 0 }}>
              <span style={{ fontSize: 12, color: "#64748b" }}>Grouped by patient exam record. Select checkboxes to batch print reports.</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>SORT BY:</span>
                <select value={flagSortBy} onChange={(e) => setFlagSortBy(e.target.value)} style={inp({ height: 30, fontSize: 11.5 })}>
                  <option value="time">Time Recorded</option>
                  <option value="name">Patient Name</option>
                  <option value="module">Module</option>
                </select>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12, minHeight: 200 }}>
              {paginatedFlagRecords.length === 0 ? (
                <div style={{ padding: 40, textAlign: "center", color: "#64748b", fontSize: 13 }}>No abnormal flags recorded today.</div>
              ) : (
                paginatedFlagRecords.map((record, rIdx) => (
                  <div key={record.recordId || rIdx} style={{ border: "1px solid #cbd5e1", borderRadius: 8, overflow: "hidden", background: "#ffffff", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column" }}>
                    {/* Record Header */}
                    <div style={{ padding: "10px 14px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <input
                          type="checkbox"
                          checked={!!modalChecked[record.recordId]}
                          onChange={() => toggleModalCheck(record.recordId)}
                          style={{ accentColor: "#2563eb", width: 16, height: 16, cursor: "pointer" }}
                        />
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontWeight: 700, fontSize: 13.5, color: "#0f172a" }}>{record.patientName || "Unknown Patient"}</span>
                          {record.patientMrn && (
                            <span style={{ fontSize: 11.5, color: "#64748b" }}>({record.patientMrn})</span>
                          )}
                          <span style={{ padding: "2px 8px", borderRadius: 6, background: "#eff6ff", color: "#2563eb", fontSize: 10.5, fontWeight: 700, border: "1px solid #bfdbfe" }}>
                            {record.sectionLabel || "Laboratory"}
                          </span>
                          <span style={{ fontSize: 11, color: "#64748b" }}>
                            • {record.dateTimeStr || "Today"} • Serial: <strong style={{ fontFamily: "monospace", color: "#0d213a" }}>{record.resultNo || "—"}</strong>
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onPrint && onPrint(record.resultObj)}
                        style={{
                          background: "#eff6ff",
                          color: "#2563eb",
                          border: "1px solid #bfdbfe",
                          borderRadius: 6,
                          padding: "5px 12px",
                          fontSize: 11.5,
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6
                        }}
                      >
                        🖨 Print Section Report
                      </button>
                    </div>

                    {/* Indented Parameter Sub-Rows */}
                    <div style={{ padding: "4px 0", background: "#ffffff", display: "flex", flexDirection: "column" }}>
                      {(record.lines || []).map((line, lIdx) => (
                        <div
                          key={lIdx}
                          style={{
                            padding: "8px 14px 8px 36px",
                            borderBottom: lIdx === record.lines.length - 1 ? "none" : "1px solid #f1f5f9",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontSize: 12.5,
                            color: "#0f172a"
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ color: "#94a3b8", fontWeight: 700 }}>└─</span>
                            <span style={{ fontWeight: 600, color: "#0f172a" }}>{line.testName || "Parameter"}</span>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <span style={{ fontWeight: 700, fontSize: 13, color: line.flag === "HI" ? "#dc2626" : "#2563eb" }}>
                              {line.value || "—"}
                            </span>
                            <span style={{ padding: "2px 8px", borderRadius: 10, fontSize: 10, fontWeight: 800, background: line.flag === "HI" ? "#fef2f2" : "#eff6ff", color: line.flag === "HI" ? "#dc2626" : "#2563eb", border: line.flag === "HI" ? "1px solid #fecaca" : "1px solid #bfdbfe" }}>
                              {line.flag === "HI" ? "▲ HIGH" : "▼ LOW"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{ padding: "12px 20px", background: "#f8fafc", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: "#64748b" }}>{Object.keys(modalChecked).filter(k => modalChecked[k]).length} record(s) selected</span>
                {totalFlagPages > 1 && (
                  <span style={{ fontSize: 11.5, color: "#64748b" }}>• Page {flagPage} of {totalFlagPages}</span>
                )}
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                {totalFlagPages > 1 && (
                  <>
                    <button disabled={flagPage <= 1} onClick={() => setFlagPage((p) => p - 1)} style={Btn("ghost", { height: 28, fontSize: 11 })}>‹ Prev</button>
                    <button disabled={flagPage >= totalFlagPages} onClick={() => setFlagPage((p) => p + 1)} style={Btn("ghost", { height: 28, fontSize: 11 })}>Next ›</button>
                  </>
                )}
                <button onClick={handleBatchPrintFromModal} style={Btn("accent", { height: 32, fontSize: 12 })}>🖨 Batch Print Selected</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal B: Drafts List */}
      {activeModal === "drafts" && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setActiveSecModal(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 14, width: "100%", maxWidth: 820, maxHeight: "85vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 25px 50px rgba(0,0,0,0.3)" }}>
            <div style={{ padding: "16px 20px", background: C.primary, color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="reports" size={18} color="#fff" />
                In-Progress Drafts ({drafts.length} Unfinished Forms)
              </div>
              <button onClick={() => setActiveSecModal(null)} style={{ background: "transparent", border: "none", color: "#fff", fontSize: 18, cursor: "pointer" }}>✕</button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.border}`, color: C.muted, fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
                    <th style={{ padding: "8px 10px" }}>Status</th>
                    <th style={{ padding: "8px 10px" }}>Patient Name</th>
                    <th style={{ padding: "8px 10px" }}>Module / Section</th>
                    <th style={{ padding: "8px 10px" }}>Last Saved</th>
                    <th style={{ padding: "8px 10px", textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {drafts.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: 32, textAlign: "center", color: C.muted }}>No saved drafts currently.</td>
                    </tr>
                  ) : (
                    paginatedDrafts.map((draft) => {
                      const pt = patientMap.get(draft.patientId);
                      return (
                        <tr
                          key={draft.id}
                          style={{ borderBottom: `1px solid ${C.border}`, cursor: "pointer" }}
                          onClick={() => { setActiveSecModal(null); if (onResumeDraft) onResumeDraft(draft); }}
                        >
                          <td style={{ padding: "8px 10px" }}>
                            <span style={{ padding: "2px 8px", borderRadius: 10, background: C.warningLight, color: C.warning, fontSize: 10.5, fontWeight: 700 }}>● DRAFT</span>
                          </td>
                          <td style={{ padding: "8px 10px", fontWeight: 600, color: C.text }}>{pt ? pt.name : "Patient"}</td>
                          <td style={{ padding: "8px 10px" }}>
                            <span style={{ padding: "2px 8px", borderRadius: 6, background: C.accentLight, color: C.accent, fontSize: 11, fontWeight: 600 }}>{draft.sectionLabel || draft.section}</span>
                          </td>
                          <td style={{ padding: "8px 10px", color: C.muted }}>{fmtDate(draft.updatedAt || draft.date)}</td>
                          <td style={{ padding: "8px 10px", textAlign: "right" }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveSecModal(null);
                                if (onResumeDraft) onResumeDraft(draft);
                              }}
                              style={Btn("accent", { height: 26, fontSize: 11 })}
                            >
                              Resume →
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {totalDraftPages > 1 && (
              <div style={{ padding: "12px 20px", background: C.surface, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11.5, color: C.muted }}>Page {draftPage} of {totalDraftPages}</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <button disabled={draftPage <= 1} onClick={() => setDraftPage((p) => p - 1)} style={Btn("ghost", { height: 28, fontSize: 11 })}>‹ Prev</button>
                  <button disabled={draftPage >= totalDraftPages} onClick={() => setDraftPage((p) => p + 1)} style={Btn("ghost", { height: 28, fontSize: 11 })}>Next ›</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal C: Quicksearch Results */}
      {activeModal === "quicksearch" && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setActiveSecModal(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 14, width: "100%", maxWidth: 880, maxHeight: "85vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 25px 50px rgba(0,0,0,0.3)" }}>
            <div style={{ padding: "16px 20px", background: C.primary, color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="search" size={18} color="#fff" />
                Patient Records Lookup — {modalPatient ? modalPatient.name : "Select Patient"}
              </div>
              <button onClick={() => setActiveSecModal(null)} style={{ background: "transparent", border: "none", color: "#fff", fontSize: 18, cursor: "pointer" }}>✕</button>
            </div>

            {/* Header Patient Search Switcher */}
            <div style={{ padding: "12px 20px", background: C.surface, borderBottom: `1px solid ${C.border}`, display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase" }}>SWITCH PATIENT:</span>
              <input
                type="text"
                value={qsQuery}
                onChange={(e) => setQsQuery(e.target.value)}
                placeholder="Type patient name to switch..."
                style={inp({ flex: 1, height: 32 })}
              />
              {matchingPatients.length > 0 && (
                <select
                  onChange={(e) => {
                    const found = patients.find((p) => p.id === e.target.value);
                    if (found) selectPatientForLookup(found);
                  }}
                  style={inp({ height: 32, fontSize: 12 })}
                  value={modalPatient?.id || ""}
                >
                  {matchingPatients.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.mrn || p.pid})</option>
                  ))}
                </select>
              )}
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
              {!modalPatient ? (
                <div style={{ padding: 40, textAlign: "center", color: C.muted }}>No patient selected.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ padding: 12, background: C.surface, borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12, display: "flex", justifyContent: "space-between" }}>
                    <span><strong>Patient:</strong> {modalPatient.name} ({modalPatient.mrn || modalPatient.pid})</span>
                    <span><strong>Total Exams Recorded:</strong> {qsPatientRecords.length}</span>
                  </div>

                  {qsPatientRecords.length === 0 ? (
                    <div style={{ padding: 20, textAlign: "center", color: C.muted }}>No lab records for this patient yet.</div>
                  ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, textAlign: "left" }}>
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${C.border}`, color: C.muted, fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
                          <th style={{ padding: "8px 10px", width: 30 }}>
                            <input
                              type="checkbox"
                              checked={qsPatientRecords.length > 0 && qsPatientRecords.every(r => modalChecked[r.id])}
                              onChange={() => toggleSelectAllModal(qsPatientRecords)}
                              style={{ accentColor: C.accent }}
                            />
                          </th>
                          <th style={{ padding: "8px 10px" }}>Result Serial</th>
                          <th style={{ padding: "8px 10px" }}>Module</th>
                          <th style={{ padding: "8px 10px" }}>Date Recorded</th>
                          <th style={{ padding: "8px 10px" }}>Status</th>
                          <th style={{ padding: "8px 10px", textAlign: "right" }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedQsRecords.map((r) => (
                          <tr key={r.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                            <td style={{ padding: "8px 10px" }}>
                              <input type="checkbox" checked={!!modalChecked[r.id]} onChange={() => toggleModalCheck(r.id)} style={{ accentColor: C.accent }} />
                            </td>
                            <td style={{ padding: "8px 10px", fontWeight: 700, fontFamily: "monospace", color: C.primary }}>{r.resultNo || r.id.slice(0, 8)}</td>
                            <td style={{ padding: "8px 10px" }}>
                              <span style={{ padding: "2px 8px", borderRadius: 6, background: C.accentLight, color: C.accent, fontSize: 11, fontWeight: 600 }}>{r.sectionLabel || r.section}</span>
                            </td>
                            <td style={{ padding: "8px 10px", color: C.muted }}>{fmtDate(r.date)} {r.time ? `(${r.time})` : ""}</td>
                            <td style={{ padding: "8px 10px" }}>
                              <span style={{ padding: "2px 8px", borderRadius: 10, fontSize: 10.5, fontWeight: 700, background: r.printed ? C.successLight : C.warningLight, color: r.printed ? C.success : C.warning }}>
                                {r.printed ? "PRINTED" : "PENDING"}
                              </span>
                            </td>
                            <td style={{ padding: "8px 10px", textAlign: "right" }}>
                              <button
                                onClick={() => onPrint && onPrint(r)}
                                style={{
                                  background: "#eff6ff",
                                  color: "#2563eb",
                                  border: "1px solid #bfdbfe",
                                  borderRadius: 6,
                                  padding: "4px 10px",
                                  fontSize: 11,
                                  fontWeight: 700,
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 4
                                }}
                              >
                                🖨 Print
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>

            <div style={{ padding: "12px 20px", background: C.surface, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: C.muted }}>{Object.keys(modalChecked).filter(k => modalChecked[k]).length} item(s) selected</span>
                {totalQsPages > 1 && (
                  <span style={{ fontSize: 11.5, color: C.muted }}>• Page {qsPage} of {totalQsPages}</span>
                )}
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                {totalQsPages > 1 && (
                  <>
                    <button disabled={qsPage <= 1} onClick={() => setQsPage((p) => p - 1)} style={Btn("ghost", { height: 28, fontSize: 11 })}>‹ Prev</button>
                    <button disabled={qsPage >= totalQsPages} onClick={() => setQsPage((p) => p + 1)} style={Btn("ghost", { height: 28, fontSize: 11 })}>Next ›</button>
                  </>
                )}
                <button onClick={handleBatchPrintFromModal} style={Btn("accent", { height: 32, fontSize: 12 })}>🖨 Batch Print Selected</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
