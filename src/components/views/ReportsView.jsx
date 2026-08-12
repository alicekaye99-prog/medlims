import React, { useState, useMemo, useEffect } from "react";
import { C, Btn, inp, Field, Card, CardHead, fmtDate, calcAge, getFlag } from "../../utils/helpers.jsx";
import { SECTIONS } from "../../constants/data.js";
import { Icon } from "../common/Icons.jsx";

export function ReportsView({
  results = [],
  patients = [],
  staff = [],
  onPrint,
  onBatchPrint,
  onDelete,
  onEdit,
}) {
  const [activeTab, setActiveTab] = useState("all");
  const [searches, setSearches] = useState({});
  const [filterDate, setFilterDate] = useState("");
  const [sortBy, setSortBy] = useState("date_desc");
  const [resultPage, setResultPage] = useState(1);
  const RESULTS_PER_PAGE = 50;

  const [sel, setSel] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editLines, setEditLines] = useState([]);
  const [editWard, setEditWard] = useState("");
  const [editPhysician, setEditPhysician] = useState("");
  const [editMedtech, setEditMedtech] = useState("");
  const [editPathologist, setEditPathologist] = useState("");
  const [editValidatedBy, setEditValidatedBy] = useState("");
  const [editRemark, setEditRemark] = useState("");

  const [batchMode, setBatchMode] = useState(false);
  const [checked, setChecked] = useState({});

  // Fast O(1) patient map
  const patientMap = useMemo(() => {
    const map = new Map();
    patients.forEach((p) => map.set(p.id, p));
    return map;
  }, [patients]);

  const getP = (patientId) => patientMap.get(patientId);

  // Debounced search query
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const currentSearch = searches[activeTab] || "";

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(currentSearch);
    }, 200);
    return () => clearTimeout(timer);
  }, [currentSearch, activeTab]);

  useEffect(() => {
    if (sel) {
      const fresh = results.find((r) => r.id === sel.id);
      if (fresh) setSel(fresh);
    }
  }, [results]);

  useEffect(() => {
    setResultPage(1);
  }, [activeTab, filterDate, debouncedSearch, sortBy]);

  const toggleCheck = (id) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  const checkedIds = Object.keys(checked).filter((id) => checked[id]);
  const exitBatch = () => {
    setBatchMode(false);
    setChecked({});
  };

  const startEdit = () => {
    if (!sel) return;
    setEditLines((sel.lines || []).map((l) => ({ ...l })));
    setEditWard(sel.ward || "");
    setEditPhysician(sel.physician || "");
    setEditMedtech(sel.medtech || "");
    setEditPathologist(sel.pathologist || "");
    setEditValidatedBy(sel.validatedBy || "");
    setEditRemark(sel.remarks || sel.remark || "");
    setEditMode(true);
  };

  const cancelEdit = () => {
    setEditMode(false);
    setEditLines([]);
  };

  const saveEdit = () => {
    if (!sel) return;
    const updated = {
      ...sel,
      ward: editWard,
      physician: editPhysician,
      remarks: editRemark,
      remark: editRemark,
      medtech: editMedtech,
      medtechLic: staff.find((s) => s.name === editMedtech)?.licenseNo || sel.medtechLic || "",
      pathologist: editPathologist,
      pathologistLic: staff.find((s) => s.name === editPathologist)?.licenseNo || sel.pathologistLic || "",
      validatedBy: editValidatedBy,
      validatedByLic: staff.find((s) => s.name === editValidatedBy)?.licenseNo || sel.validatedByLic || "",
      lines: editLines.map((l) => {
        const flag = getFlag(l, l.value);
        return { ...l, flag };
      }),
    };

    onEdit(updated);
    setSel(updated);
    setEditMode(false);
  };

  const addEditLine = () => {
    setEditLines((prev) => [
      ...prev,
      { testName: "", value: "", unit: "", normalRange: "", flag: "", showUnit: true, showNormal: true, showFlag: true },
    ]);
  };

  const removeEditLine = (idx) => {
    setEditLines((prev) => prev.filter((_, j) => j !== idx));
  };

  // Ultra-fast O(1) sorting with fast string comparisons
  const processedResults = useMemo(() => {
    let list = activeTab === "all" ? results : results.filter((r) => r.section === activeTab);
    if (filterDate) list = list.filter((r) => r.date === filterDate);

    const q = debouncedSearch.toLowerCase().trim();
    if (q) {
      list = list.filter((r) => {
        const p = patientMap.get(r.patientId);
        return (
          (p?.name || "").toLowerCase().includes(q) ||
          (r.resultNo || "").toLowerCase().includes(q) ||
          (r.date || "").includes(q) ||
          (r.sectionLabel || "").toLowerCase().includes(q) ||
          (p?.mrn || p?.pid || "").toLowerCase().includes(q)
        );
      });
    }

    return [...list].sort((a, b) => {
      const pa = patientMap.get(a.patientId);
      const pb = patientMap.get(b.patientId);
      switch (sortBy) {
        case "date_desc":
          return (b.date || "").localeCompare(a.date || "");
        case "date_asc":
          return (a.date || "").localeCompare(b.date || "");
        case "name_az":
          return (pa?.name || "").localeCompare(pb?.name || "");
        case "name_za":
          return (pb?.name || "").localeCompare(pa?.name || "");
        case "resultno":
          return (a.resultNo || "").localeCompare(b.resultNo || "");
        case "flags":
          return (b.lines?.filter((l) => l.flag).length || 0) - (a.lines?.filter((l) => l.flag).length || 0);
        case "not_printed":
          return (a.printed ? 1 : 0) - (b.printed ? 1 : 0);
        default:
          return 0;
      }
    });
  }, [results, activeTab, filterDate, debouncedSearch, sortBy, patientMap]);

  const totalPages = Math.max(1, Math.ceil(processedResults.length / RESULTS_PER_PAGE));
  const filtered = useMemo(() => {
    return processedResults.slice((resultPage - 1) * RESULTS_PER_PAGE, resultPage * RESULTS_PER_PAGE);
  }, [processedResults, resultPage]);

  const allChecked = filtered.length > 0 && filtered.every((r) => checked[r.id]);
  const toggleAll = () => {
    if (allChecked) {
      setChecked({});
    } else {
      const n = {};
      filtered.forEach((r) => (n[r.id] = true));
      setChecked(n);
    }
  };

  const doBatchPrint = () => {
    const toBatch = filtered.filter((r) => checked[r.id]);
    if (toBatch.length === 0) return alert("No results selected for batch printing.");
    onBatchPrint(toBatch);
    exitBatch();
  };

  const tabs = [
    { id: "all", label: "All Sections", icon: "reports" },
    ...SECTIONS.map((s) => ({ id: s.id, label: s.label, icon: s.icon })),
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header */}
      <Card style={{ padding: "16px 20px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="reports" size={22} color={C.accent} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: C.text }}>Reports & Result History Archive</div>
            <div style={{ fontSize: 11.5, color: C.muted }}>Search, filter, batch print, edit, and inspect recorded laboratory examinations</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11, color: C.muted, fontWeight: 700 }}>DATE:</span>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              style={inp({ height: 32, fontSize: 12 })}
            />
            {filterDate && (
              <button onClick={() => setFilterDate("")} style={Btn("ghost", { height: 32, fontSize: 11 })}>✕</button>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11, color: C.muted, fontWeight: 700 }}>SORT:</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={inp({ height: 32, fontSize: 12 })}>
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="name_az">Patient A – Z</option>
              <option value="name_za">Patient Z – A</option>
              <option value="resultno">Result Serial No.</option>
              <option value="flags">Abnormal Flags First</option>
              <option value="not_printed">Unprinted First</option>
            </select>
          </div>

          {!batchMode ? (
            <button onClick={() => { setBatchMode(true); setChecked({}); }} style={Btn("ghost", { height: 32 })}>
              ☑ Batch Mode
            </button>
          ) : (
            <>
              <button onClick={doBatchPrint} style={Btn("accent", { height: 32 })}>
                🖨 Batch Print ({checkedIds.length})
              </button>
              <button onClick={exitBatch} style={Btn("ghost", { height: 32 })}>
                ✕ Cancel
              </button>
            </>
          )}
        </div>
      </Card>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4 }}>
        {tabs.map((tab) => {
          const cnt = tab.id === "all" ? results.length : results.filter((r) => r.section === tab.id).length;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSel(null); }}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: `1px solid ${isActive ? C.accent : C.border}`,
                background: isActive ? C.accent : "#fff",
                color: isActive ? "#fff" : C.text,
                fontWeight: isActive ? 700 : 500,
                fontSize: 12,
                cursor: "pointer",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>{tab.label}</span>
              <span style={{ padding: "1px 6px", borderRadius: 10, background: isActive ? "rgba(255,255,255,0.25)" : C.surface, color: isActive ? "#fff" : C.muted, fontSize: 10 }}>
                {cnt}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search box */}
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <input
          value={searches[activeTab] || ""}
          onChange={(e) => setSearches({ ...searches, [activeTab]: e.target.value })}
          placeholder={`Search in ${tabs.find((t) => t.id === activeTab)?.label}...`}
          style={inp({ width: "100%", maxWidth: 380 })}
        />
        <span style={{ fontSize: 12, color: C.muted }}>
          Showing {processedResults.length} records {totalPages > 1 && `(Page ${resultPage} of ${totalPages})`}
        </span>
      </div>

      {/* Main Grid: List + Detail */}
      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 16 }}>
        {/* Result List */}
        <Card style={{ display: "flex", flexDirection: "column", maxHeight: "70vh", overflow: "hidden" }}>
          <CardHead
            title="Records List"
            sub={`${processedResults.length} matching`}
            right={
              batchMode && (
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, cursor: "pointer" }}>
                  <input type="checkbox" checked={allChecked} onChange={toggleAll} style={{ accentColor: C.accent }} />
                  Select Page
                </label>
              )
            }
          />

          <div style={{ overflowY: "auto", flex: 1 }}>
            {processedResults.length === 0 ? (
              <div style={{ padding: 32, textAlign: "center", color: C.muted, fontSize: 12 }}>
                No records found.
              </div>
            ) : (
              filtered.map((r) => {
                const pt = getP(r.patientId);
                const isSelected = sel?.id === r.id;
                const isChecked = !!checked[r.id];
                const isPrinted = !!r.printed;

                return (
                  <div
                    key={r.id}
                    onClick={() => (batchMode ? toggleCheck(r.id) : setSel(r))}
                    style={{
                      padding: "10px 14px",
                      borderBottom: `1px solid ${C.border}`,
                      background: isChecked ? C.accentLight : isSelected ? C.accentLight : isPrinted ? "#f0fdf4" : "#fff",
                      borderLeft: isChecked || isSelected ? `4px solid ${C.accent}` : isPrinted ? `4px solid ${C.success}` : "4px solid transparent",
                      cursor: "pointer",
                      display: "flex",
                      gap: 10,
                      alignItems: "center",
                    }}
                  >
                    {batchMode && (
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleCheck(r.id)}
                        onClick={(e) => e.stopPropagation()}
                        style={{ accentColor: C.accent }}
                      />
                    )}

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                        <span style={{ fontWeight: 700, fontSize: 12, color: C.primary, fontFamily: "monospace" }}>
                          {r.resultNo || r.id.slice(0, 8)}
                        </span>
                        <span style={{ fontSize: 11, color: C.muted }}>{fmtDate(r.date)}</span>
                      </div>

                      <div style={{ fontWeight: 600, fontSize: 12.5, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {pt ? pt.name : "Unknown Patient"}
                      </div>

                      <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 4 }}>
                        <span style={{ padding: "1px 6px", borderRadius: 4, background: C.surface, border: `1px solid ${C.border}`, fontSize: 10, color: C.muted }}>
                          {r.sectionLabel || r.section}
                        </span>
                        {isPrinted ? (
                          <span style={{ padding: "1px 6px", borderRadius: 4, background: C.successLight, color: C.success, fontSize: 10, fontWeight: 700 }}>
                            PRINTED
                          </span>
                        ) : (
                          <span style={{ padding: "1px 6px", borderRadius: 4, background: C.warningLight, color: C.warning, fontSize: 10, fontWeight: 700 }}>
                            PENDING
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {totalPages > 1 && (
            <div style={{ padding: "8px 12px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: C.surface }}>
              <button disabled={resultPage <= 1} onClick={() => setResultPage((p) => p - 1)} style={Btn("ghost", { height: 26, fontSize: 11 })}>
                ‹ Prev
              </button>
              <span style={{ fontSize: 11, color: C.muted }}>{resultPage} / {totalPages}</span>
              <button disabled={resultPage >= totalPages} onClick={() => setResultPage((p) => p + 1)} style={Btn("ghost", { height: 26, fontSize: 11 })}>
                Next ›
              </button>
            </div>
          )}
        </Card>

        {/* Result Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {!sel ? (
            <Card style={{ padding: 48, textAlign: "center", color: C.faint, fontSize: 13 }}>
              Select a lab record from the list on the left to view, edit, or print.
            </Card>
          ) : (
            <>
              <Card>
                <CardHead
                  title={sel.resultNo || "Result Detail"}
                  sub={`${sel.sectionLabel || sel.section} • ${fmtDate(sel.date)} ${sel.time ? `(${sel.time})` : ""}`}
                  icon={<Icon name="reports" size={18} color={C.accent} />}
                  right={
                    <div style={{ display: "flex", gap: 6 }}>
                      {!editMode ? (
                        <>
                          <button onClick={startEdit} style={Btn("ghost", { height: 30, fontSize: 11.5 })}>✏ Edit</button>
                          <button onClick={() => onPrint(sel)} style={Btn("accent", { height: 30, fontSize: 11.5 })}>🖨 Print PDF</button>
                          <button onClick={() => { if (confirm("Delete this result record?")) { onDelete(sel.id); setSel(null); } }} style={Btn("danger", { height: 30, fontSize: 11.5 })}>🗑 Delete</button>
                        </>
                      ) : (
                        <>
                          <button onClick={saveEdit} style={Btn("accent", { height: 30, fontSize: 11.5 })}>💾 Save Changes</button>
                          <button onClick={cancelEdit} style={Btn("ghost", { height: 30, fontSize: 11.5 })}>Cancel</button>
                        </>
                      )}
                    </div>
                  }
                />

                <div style={{ padding: 16, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, background: C.surface, borderBottom: `1px solid ${C.border}` }}>
                  <div>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: C.muted }}>PATIENT</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{getP(sel.patientId)?.name || "Unknown"}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: C.muted }}>WARD / ROOM</div>
                    {editMode ? (
                      <input value={editWard} onChange={(e) => setEditWard(e.target.value)} style={inp({ width: "100%", height: 28 })} />
                    ) : (
                      <div style={{ fontSize: 13, color: C.text }}>{sel.ward || "OP"}</div>
                    )}
                  </div>

                  <div>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: C.muted }}>PHYSICIAN</div>
                    {editMode ? (
                      <input value={editPhysician} onChange={(e) => setEditPhysician(e.target.value)} style={inp({ width: "100%", height: 28 })} />
                    ) : (
                      <div style={{ fontSize: 13, color: C.text }}>{sel.physician || "—"}</div>
                    )}
                  </div>
                </div>

                <div style={{ padding: 16 }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, textAlign: "left" }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${C.border}`, color: C.muted, fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
                        <th style={{ padding: "8px 10px" }}>Parameter</th>
                        <th style={{ padding: "8px 10px" }}>Result Value</th>
                        <th style={{ padding: "8px 10px" }}>Unit</th>
                        <th style={{ padding: "8px 10px" }}>Normal Range</th>
                        <th style={{ padding: "8px 10px" }}>Flag</th>
                        {editMode && <th style={{ padding: "8px 10px", textAlign: "right" }}>Action</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {(editMode ? editLines : sel.lines || []).map((line, idx) => (
                        <tr key={idx} style={{ borderBottom: `1px solid ${C.border}` }}>
                          <td style={{ padding: "8px 10px", fontWeight: 600 }}>
                            {editMode ? (
                              <input value={line.testName || ""} onChange={(e) => { const updated = [...editLines]; updated[idx].testName = e.target.value; setEditLines(updated); }} style={inp({ width: "100%", height: 28 })} />
                            ) : (
                              line.testName
                            )}
                          </td>
                          <td style={{ padding: "8px 10px" }}>
                            {editMode ? (
                              <input value={line.value || ""} onChange={(e) => { const updated = [...editLines]; updated[idx].value = e.target.value; setEditLines(updated); }} style={inp({ width: "100%", height: 28, fontWeight: 600 })} />
                            ) : (
                              <span style={{ fontWeight: 700 }}>{line.value || "—"}</span>
                            )}
                          </td>
                          <td style={{ padding: "8px 10px", color: C.muted }}>{line.unit || "—"}</td>
                          <td style={{ padding: "8px 10px", color: C.muted }}>{line.normalRange || "—"}</td>
                          <td style={{ padding: "8px 10px" }}>
                            {line.flag && (
                              <span style={{ padding: "2px 6px", borderRadius: 4, fontSize: 10, fontWeight: 700, background: C.dangerLight, color: C.danger }}>
                                {line.flag}
                              </span>
                            )}
                          </td>
                          {editMode && (
                            <td style={{ padding: "8px 10px", textAlign: "right" }}>
                              <button onClick={() => removeEditLine(idx)} style={Btn("danger", { height: 26, padding: "0 8px", fontSize: 10 })}>✕</button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {editMode && (
                    <button onClick={addEditLine} style={Btn("ghost", { height: 28, fontSize: 11, marginTop: 10 })}>
                      + Add Parameter Line
                    </button>
                  )}
                </div>

                <div style={{ padding: 16, borderTop: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: C.muted }}>REMARKS / CLINICAL IMPRESSION</div>
                    {editMode ? (
                      <textarea value={editRemark} onChange={(e) => setEditRemark(e.target.value)} style={{ width: "100%", padding: 8, borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 12 }} rows={2} />
                    ) : (
                      <div style={{ fontSize: 12, color: C.text, marginTop: 2 }}>{sel.remarks || sel.remark || "—"}</div>
                    )}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 4 }}>
                    <div>
                      <div style={{ fontSize: 10.5, fontWeight: 700, color: C.muted }}>PERFORMED BY</div>
                      {editMode ? (
                        <input value={editMedtech} onChange={(e) => setEditMedtech(e.target.value)} style={inp({ width: "100%", height: 28 })} />
                      ) : (
                        <div style={{ fontSize: 12, color: C.text }}>{sel.medtech || "—"}</div>
                      )}
                    </div>

                    <div>
                      <div style={{ fontSize: 10.5, fontWeight: 700, color: C.muted }}>VALIDATED BY</div>
                      {editMode ? (
                        <input value={editValidatedBy} onChange={(e) => setEditValidatedBy(e.target.value)} style={inp({ width: "100%", height: 28 })} />
                      ) : (
                        <div style={{ fontSize: 12, color: C.text }}>{sel.validatedBy || "—"}</div>
                      )}
                    </div>

                    <div>
                      <div style={{ fontSize: 10.5, fontWeight: 700, color: C.muted }}>PATHOLOGIST</div>
                      {editMode ? (
                        <input value={editPathologist} onChange={(e) => setEditPathologist(e.target.value)} style={inp({ width: "100%", height: 28 })} />
                      ) : (
                        <div style={{ fontSize: 12, color: C.text }}>{sel.pathologist || "—"}</div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
