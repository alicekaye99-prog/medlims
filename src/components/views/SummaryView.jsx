import React, { useState, useMemo } from "react";
import { C, Btn, inp, Card, CardHead, fmtDate, calcAge, toInputDate } from "../../utils/helpers.jsx";
import { SECTIONS, SECTION_COLORS } from "../../constants/data.js";
import { Icon } from "../common/Icons.jsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function SummaryView({ results = [], patients = [], hospital }) {
  const [date, setDate] = useState(toInputDate());
  const [activeSec, setActiveSec] = useState(null);
  const [matrixPage, setMatrixPage] = useState(1);
  const MATRIX_ROWS_PER_PAGE = 50;

  // Fast O(1) patient map
  const patientMap = useMemo(() => {
    const map = new Map();
    patients.forEach((p) => map.set(p.id, p));
    return map;
  }, [patients]);

  const getP = (id) => patientMap.get(id);

  const dayResults = useMemo(() => {
    return results.filter((r) => r.date === date);
  }, [results, date]);

  const sectionsWithData = useMemo(() => {
    return SECTIONS.filter((s) => dayResults.some((r) => r.section === s.id));
  }, [SECTIONS, dayResults]);

  const totalToday = dayResults.length;

  const secR = useMemo(() => {
    if (!activeSec) return [];
    return dayResults.filter((r) => r.section === activeSec);
  }, [dayResults, activeSec]);

  const totalMatrixPages = Math.max(1, Math.ceil(secR.length / MATRIX_ROWS_PER_PAGE));
  const paginatedSecR = useMemo(() => {
    return secR.slice((matrixPage - 1) * MATRIX_ROWS_PER_PAGE, matrixPage * MATRIX_ROWS_PER_PAGE);
  }, [secR, matrixPage]);

  // Generate Landscape A4 Summary PDF Matrix
  const generateSummaryPDF = async (sectionsToPrint) => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const W = 297;
    const grey = [80, 80, 80];
    const black = [15, 30, 45];
    const navy = [15, 45, 82];

    const fmtPrintDate = fmtDate(date);
    let isFirstPage = true;

    for (const sec of sectionsToPrint) {
      const sectionResults = dayResults.filter((r) => r.section === sec.id);
      if (sectionResults.length === 0) continue;

      const sectColor = SECTION_COLORS[sec.id] || [15, 45, 82];
      const testNames = [...new Set(sectionResults.flatMap((r) => (r.lines || []).map((l) => l.testName)))];

      if (!isFirstPage) doc.addPage("a4", "landscape");
      isFirstPage = false;

      let y = 12;

      doc.setFont("times", "bold");
      doc.setFontSize(13);
      doc.setTextColor(...navy);
      doc.text(hospital?.name || "CLINICAL LABORATORY", W / 2, y, { align: "center" });
      y += 5;

      doc.setFontSize(8.5);
      doc.setFont("times", "normal");
      doc.setTextColor(...grey);
      if (hospital?.address) { doc.text(hospital.address, W / 2, y, { align: "center" }); y += 4; }
      if (hospital?.phone) { doc.text("Tel: " + hospital.phone, W / 2, y, { align: "center" }); y += 4; }

      doc.setFont("times", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(...navy);
      doc.text("DAILY LABORATORY SUMMARY — " + fmtPrintDate.toUpperCase(), W / 2, y, { align: "center" });
      y += 3;

      doc.setDrawColor(15, 45, 82);
      doc.setLineWidth(0.5);
      doc.line(10, y, W - 10, y);
      y += 5;

      doc.setFillColor(...sectColor);
      doc.roundedRect(10, y, W - 20, 6, 1, 1, "F");
      doc.setFont("times", "bold");
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text(sec.label.toUpperCase() + "   ·   " + sectionResults.length + " Patient Record(s)", W / 2, y + 4, { align: "center" });
      y += 9;

      const fixedCols = ["No.", "Name", "DOB", "Age", "Sex", "Ward", "Address"];
      const head = [...fixedCols, ...testNames];

      const body = sectionResults.map((r, i) => {
        const p = getP(r.patientId);
        const dob = p?.dob ? fmtDate(p.dob) : "—";
        const fixed = [
          String(i + 1),
          p?.name || "—",
          dob,
          p?.age || calcAge(p?.dob) || "—",
          p?.gender ? p.gender[0] : "—",
          r.ward || "OP",
          p?.address || "—",
        ];
        const testCells = testNames.map((tn) => {
          const line = (r.lines || []).find((l) => l.testName === tn);
          return line?.value || "";
        });
        return [...fixed, ...testCells];
      });

      const usable = W - 20;
      const fixedWidths = [8, 36, 18, 12, 10, 12, 28];
      const fixedTotal = fixedWidths.reduce((a, b) => a + b, 0);
      const testW = testNames.length > 0
        ? Math.max(12, Math.floor((usable - fixedTotal) / testNames.length))
        : 12;

      const colStyles = {};
      fixedWidths.forEach((w, idx) => {
        colStyles[idx] = { cellWidth: w, halign: idx === 1 || idx === 6 ? "left" : "center" };
      });
      testNames.forEach((_, idx) => {
        colStyles[fixedCols.length + idx] = { cellWidth: testW, halign: "center", fontStyle: "bold" };
      });

      autoTable(doc, {
        startY: y,
        head: [head],
        body,
        margin: { left: 10, right: 10 },
        styles: { font: "times", fontSize: 7, cellPadding: 1.5, textColor: black, overflow: "ellipsize" },
        headStyles: { fillColor: sectColor, textColor: [255, 255, 255], fontStyle: "bold", fontSize: 7, halign: "center", valign: "middle" },
        columnStyles: colStyles,
        didParseCell(data) {
          if (data.section === "body" && data.column.index >= fixedCols.length) {
            const ri = data.row.index;
            const ti = data.column.index - fixedCols.length;
            const tn = testNames[ti];
            const r2 = sectionResults[ri];
            const line = r2 ? (r2.lines || []).find((l) => l.testName === tn) : null;
            if (line?.flag === "HI") data.cell.styles.textColor = [192, 57, 43];
            else if (line?.flag === "LO") data.cell.styles.textColor = [26, 111, 181];
          }
        },
      });
    }

    const filename = `Daily_Summary_${date.replace(/-/g, "")}.pdf`;
    if (window.electronAPI && window.electronAPI.savePDF) {
      const dataUri = doc.output("datauristring");
      const base64 = dataUri.split(",")[1];
      const res = await window.electronAPI.savePDF(filename, base64);
      if (res && res.success && res.filePath) {
        await window.electronAPI.printPDF(res.filePath, filename);
      }
    } else {
      doc.save(filename);
    }
  };

  const handlePrint = (secToPrint) => {
    const list = secToPrint ? [secToPrint] : sectionsWithData;
    if (list.length === 0) return alert("No results recorded for this date.");
    generateSummaryPDF(list);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Top Banner */}
      <Card style={{ padding: "14px 20px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="summary" size={22} color={C.accent} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: C.text }}>Daily Census Summary Matrix</div>
            <div style={{ fontSize: 11.5, color: C.muted }}>Daily counters reset automatically at 00:00 midnight</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase" }}>Lookup Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setActiveSec(null);
              setMatrixPage(1);
            }}
            style={inp({ height: 34, fontWeight: 600 })}
          />
          <button onClick={() => handlePrint(null)} style={Btn("accent", { height: 34 })}>
            Print Daily Summary PDF
          </button>
        </div>
      </Card>

      {/* Today's Counter Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
        <Card style={{ padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: C.accentLight, color: C.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="reports" size={22} color={C.accent} />
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.text }}>{totalToday}</div>
            <div style={{ fontSize: 11.5, color: C.muted, fontWeight: 600 }}>Total Exams ({fmtDate(date)})</div>
          </div>
        </Card>

        <Card style={{ padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "#F0FDF4", color: C.success, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="patients" size={22} color={C.success} />
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.text }}>{new Set(dayResults.map((r) => r.patientId)).size}</div>
            <div style={{ fontSize: 11.5, color: C.muted, fontWeight: 600 }}>Unique Patients ({fmtDate(date)})</div>
          </div>
        </Card>
      </div>

      {/* Section Selector Grid or Active Section Matrix Table */}
      {!activeSec ? (
        <Card>
          <CardHead title="Select Section to View Daily Matrix Summary" sub={`Active sections with data on ${fmtDate(date)}`} icon={<Icon name="dashboard" size={18} color={C.accent} />} />
          <div style={{ padding: 20 }}>
            {sectionsWithData.length === 0 ? (
              <div style={{ padding: 32, textAlign: "center", color: C.muted }}>
                No laboratory exam records found for date: <strong>{fmtDate(date)}</strong>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
                {sectionsWithData.map((sec) => {
                  const secCount = dayResults.filter((r) => r.section === sec.id).length;
                  return (
                    <div
                      key={sec.id}
                      onClick={() => { setActiveSec(sec.id); setMatrixPage(1); }}
                      style={{
                        padding: "16px 18px",
                        borderRadius: 10,
                        border: `1px solid ${C.border}`,
                        background: "#fff",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                        transition: "all .15s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = C.accent;
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(37,99,235,0.12)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = C.border;
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: 14, color: C.primary }}>{sec.label}</div>
                      <div style={{ fontSize: 11.5, color: C.muted }}>{secCount} exam(s) recorded</div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: C.accent, marginTop: 4 }}>View Matrix Table →</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Card>
      ) : (
        /* Section Matrix Table */
        <Card style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "12px 18px", background: C.primary, color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: "10px 10px 0 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button onClick={() => setActiveSec(null)} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer" }}>
                ← Back
              </button>
              <span style={{ fontWeight: 700, fontSize: 14 }}>
                {SECTIONS.find((s) => s.id === activeSec)?.label} — Matrix Summary ({secR.length} exams)
              </span>
            </div>

            <button onClick={() => handlePrint(SECTIONS.find((s) => s.id === activeSec))} style={Btn("accent", { height: 30, fontSize: 11.5 })}>
              Print Section PDF
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            {(() => {
              const testNames = [...new Set(secR.flatMap((r) => (r.lines || []).map((l) => l.testName)))];

              return (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, textAlign: "left" }}>
                  <thead>
                    <tr style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, color: C.muted, fontSize: 10.5, fontWeight: 700, textTransform: "uppercase" }}>
                      <th style={{ padding: "10px 12px", width: 30 }}>No.</th>
                      <th style={{ padding: "10px 12px" }}>Patient Name</th>
                      <th style={{ padding: "10px 12px" }}>DOB</th>
                      <th style={{ padding: "10px 12px" }}>Age/Sex</th>
                      <th style={{ padding: "10px 12px" }}>Ward</th>
                      <th style={{ padding: "10px 12px" }}>Address</th>
                      {testNames.map((tn) => (
                        <th key={tn} style={{ padding: "10px 12px", textAlign: "center" }}>
                          {tn}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedSecR.map((r, i) => {
                      const pt = getP(r.patientId);
                      const rowNum = (matrixPage - 1) * MATRIX_ROWS_PER_PAGE + i + 1;
                      return (
                        <tr key={r.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                          <td style={{ padding: "10px 12px", color: C.muted }}>{rowNum}</td>
                          <td style={{ padding: "10px 12px", fontWeight: 600, color: C.text }}>{pt ? pt.name : "Unknown"}</td>
                          <td style={{ padding: "10px 12px", color: C.muted }}>{pt ? fmtDate(pt.dob) : "—"}</td>
                          <td style={{ padding: "10px 12px", color: C.muted }}>{pt ? `${pt.age || calcAge(pt.dob)} / ${pt.gender || "—"}` : "—"}</td>
                          <td style={{ padding: "10px 12px", color: C.muted }}>{r.ward || "OP"}</td>
                          <td style={{ padding: "10px 12px", color: C.muted }}>{pt ? pt.address : "—"}</td>
                          {testNames.map((tn) => {
                            const line = (r.lines || []).find((l) => l.testName === tn);
                            const val = line?.value || "—";
                            const flag = line?.flag;
                            return (
                              <td
                                key={tn}
                                style={{
                                  padding: "10px 12px",
                                  textAlign: "center",
                                  fontWeight: 700,
                                  color: flag === "HI" ? C.danger : flag === "LO" ? C.accent : C.text,
                                }}
                              >
                                {val} {flag && <span style={{ fontSize: 9.5, padding: "1px 4px", borderRadius: 4, background: flag === "HI" ? C.dangerLight : C.accentLight, color: flag === "HI" ? C.danger : C.accent, marginLeft: 2 }}>{flag}</span>}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              );
            })()}
          </div>

          {totalMatrixPages > 1 && (
            <div style={{ padding: "10px 16px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: C.surface }}>
              <button disabled={matrixPage <= 1} onClick={() => setMatrixPage((p) => p - 1)} style={Btn("ghost", { height: 28, fontSize: 11.5 })}>
                ‹ Prev Page
              </button>
              <span style={{ fontSize: 11.5, color: C.muted }}>Page {matrixPage} of {totalMatrixPages}</span>
              <button disabled={matrixPage >= totalMatrixPages} onClick={() => setMatrixPage((p) => p + 1)} style={Btn("ghost", { height: 28, fontSize: 11.5 })}>
                Next Page ›
              </button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
