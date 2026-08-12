import React, { useState, useEffect, useRef, useCallback } from "react";
import { C, Btn, inp, Field, Card, CardHead, calcAge } from "../../utils/helpers.jsx";
import { Icon } from "../common/Icons.jsx";
import { db } from "../../utils/db.js";

function genSerial() {
  const n = Math.floor(10000 + Math.random() * 90000);
  return "BC-" + n;
}

// Async Dexie Barcode Load & Save
async function bcLoadAll() {
  try {
    const list = await db.barcodes.toArray();
    const map = {};
    list.forEach(item => { map[item.serial] = item; });
    return map;
  } catch (e) {
    return {};
  }
}

async function bcSaveSingle(serial, orderData) {
  try {
    await db.barcodes.put({ serial, ...orderData });
  } catch (e) {
    console.error("Dexie barcode save error:", e);
  }
}

function encodeCode128B(data) {
  const CODE128_B = {
    " ": 0, "!": 1, '"': 2, "#": 3, "$": 4, "%": 5, "&": 6, "'": 7, "(": 8, ")": 9,
    "*": 10, "+": 11, ",": 12, "-": 13, ".": 14, "/": 15, "0": 16, "1": 17, "2": 18, "3": 19,
    "4": 20, "5": 21, "6": 22, "7": 23, "8": 24, "9": 25, ":": 26, ";": 27, "<": 28, "=": 29,
    ">": 30, "?": 31, "@": 32, "A": 33, "B": 34, "C": 35, "D": 36, "E": 37, "F": 38, "G": 39,
    "H": 40, "I": 41, "J": 42, "K": 43, "L": 44, "M": 45, "N": 46, "O": 47, "P": 48, "Q": 49,
    "R": 50, "S": 51, "T": 52, "U": 53, "V": 54, "W": 55, "X": 56, "Y": 57, "Z": 58, "[": 59,
    "\\": 60, "]": 61, "^": 62, "_": 63, "`": 64, "a": 65, "b": 66, "c": 67, "d": 68, "e": 69,
    "f": 70, "g": 71, "h": 72, "i": 73, "j": 74, "k": 75, "l": 76, "m": 77, "n": 78, "o": 79,
    "p": 80, "q": 81, "r": 82, "s": 83, "t": 84, "u": 85, "v": 86, "w": 87, "x": 88, "y": 89,
    "z": 90, "{": 91, "|": 92, "}": 93, "~": 94
  };

  const PATTERNS = [
    "11011001100","11001101100","11001100110","10010011000","10010001100",
    "10001001100","10011001000","10011000100","10001100100","11001001000",
    "11001000100","11000100100","10110011100","10011011100","10011001110",
    "10111001100","10011101100","10011100110","11001110010","11001011100",
    "11001001110","11011100100","11001110100","11101101110","11101001100",
    "11100101100","11100100110","11101100100","11100110100","11100110010",
    "11011011000","11011000110","11000110110","10100011000","10001011000",
    "10001000110","10110001000","10001101000","10001100010","11010001000",
    "11000101000","11000100010","10110111000","10110001110","10001101110",
    "10111011000","10111000110","10001110110","11101110110","11010001110",
    "11000101110","11011101000","11011100010","11011101110","11101011000",
    "11101000110","11100010110","11101101000","11101100010","11100011010",
    "11101111010","11001000010","11110001010","10100110000","10100001100",
    "10010110000","10010000110","10000101100","10000100110","10110100000",
    "10110000100","10011010000","10011000010","10000110100","10000110010",
    "11000010010","11001010000","11110111010","11000010100","10001111010",
    "10100111100","10010111100","10010011110","10111100100","10011110100",
    "10011110010","11110100100","11110010100","11110010010","11011011110",
    "11011110110","11110110110","10101111000","10100011110","10001011110",
    "10111101000","10111100010","11110101000","11110100010","10111011110",
    "10111101110","11101011110","11110101110","11010000100","11010010000",
    "11010011100","1100011101011"
  ];

  const START_B = 104, STOP = 106;
  const vals = [START_B];
  let checksum = START_B;

  for (let i = 0; i < data.length; i++) {
    const v = CODE128_B[data[i]];
    if (v === undefined) continue;
    vals.push(v);
    checksum += (v * (i + 1));
  }

  vals.push(checksum % 103);
  vals.push(STOP);

  let bars = "";
  vals.forEach(v => { bars += PATTERNS[v] || ""; });
  return "0000000000" + bars + "0000000000";
}

function drawBarcode(canvas, text) {
  if (!canvas) return;
  const bars = encodeCode128B(text);
  const barW = 2.2;
  const bH = 64;
  const padX = 12;
  const totalW = Math.ceil(bars.length * barW) + padX * 2;
  const totalH = bH + 8;

  canvas.width = totalW;
  canvas.height = totalH;

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, totalW, totalH);
  ctx.fillStyle = "#000000";

  for (let i = 0; i < bars.length; i++) {
    if (bars[i] === "1") ctx.fillRect(padX + Math.floor(i * barW), 4, Math.ceil(barW), bH);
  }
}

async function printBarcodeLabel({ serial, patientName, sections, sectionDefs, testMap, canvasDataUrl }) {
  const secLines = Object.entries(sections).map(([secId, tids]) => {
    const sd = sectionDefs.find(s => s.id === secId);
    const names = tids.map(id => {
      const allT = (testMap[secId] || []).flatMap(g => g.tests);
      return allT.find(t => t.id === id)?.name || id;
    });
    return `<div class="sec"><strong>${sd?.label || secId}:</strong> ${names.join(", ")}</div>`;
  }).join("");

  const html = `<!DOCTYPE html><html><head>
<title>Lab Order ${serial}</title>
<style>
  *{box-sizing:border-box;}
  body{font-family:'Inter','Segoe UI',sans-serif;margin:0;padding:0;background:#fff;}
  .label{display:inline-block;border:1.5px solid #ccc;border-radius:8px;padding:12px 16px;text-align:center;min-width:260px;max-width:340px;}
  .serial{font-size:22px;font-weight:800;color:#0f2d4a;letter-spacing:2px;margin-bottom:2px;}
  .patient{font-size:13px;font-weight:700;color:#333;margin-bottom:2px;}
  .date{font-size:10px;color:#888;margin-bottom:6px;}
  img.bc{display:block;margin:6px auto;max-width:100%;}
  .serial-text{font-size:11px;font-family:monospace;color:#555;letter-spacing:3px;margin:2px 0 8px;}
  .sec{font-size:10px;color:#444;text-align:left;margin-bottom:3px;}
  .sec strong{color:#0f2d4a;}
  @media print{
    body{padding:4mm;}
    button{display:none!important;}
    .label{border:1px solid #aaa;}
  }
</style>
</head><body>
<div class="label">
  <div class="serial">${serial}</div>
  <div class="patient">${patientName}</div>
  <div class="date">${new Date().toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"})}</div>
  <img class="bc" src="${canvasDataUrl}" alt="barcode"/>
  <div class="serial-text">${serial}</div>
  ${secLines}
</div>
<br/>
<button onclick="window.print()" style="margin:12px;padding:8px 24px;background:#0f2d4a;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:13px;">🖨 Print Label</button>
<script>setTimeout(()=>window.print(),400);<\/script>
</body></html>`;

  if (window.electronAPI && window.electronAPI.printLabel) {
    const prefs = window.electronAPI.getPrinterPrefs ? await window.electronAPI.getPrinterPrefs() : {};
    const labelPrinter = prefs?.labelPrinter || "";
    window.electronAPI.printLabel(html, labelPrinter);
    return;
  }

  try {
    let iframe = document.getElementById("__bc_print_frame__");
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.id = "__bc_print_frame__";
      iframe.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:400px;height:600px;border:none;";
      document.body.appendChild(iframe);
    }
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open(); doc.write(html); doc.close();
    setTimeout(() => {
      try { iframe.contentWindow.print(); } catch {
        const w = window.open("", "_blank", "width=420,height=500");
        if (w) { w.document.write(html); w.document.close(); }
      }
    }, 500);
  } catch {
    const w = window.open("", "_blank", "width=420,height=500");
    if (w) { w.document.write(html); w.document.close(); }
  }
}

export function BarcodeView({ patients = [], tests = {}, sections = [], onNav }) {
  const [activeTab, setActiveTab] = useState("generate");

  const [patientId, setPatientId] = useState("");
  const [selSections, setSelSections] = useState({});
  const [activeSec, setActiveSec] = useState("");
  const [generated, setGenerated] = useState(null);
  const canvasRef = useRef(null);

  const [scanInput, setScanInput] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState("");
  const [scanActiveTab, setScanActiveTab] = useState("");
  const scanRef = useRef(null);

  const pat = patients.find(p => p.id === patientId);

  const addedSectionIds = Object.keys(selSections);
  const totalSelectedTests = addedSectionIds.reduce((sum, sid) =>
    sum + Object.values(selSections[sid] || {}).filter(Boolean).length, 0
  );

  const toggleSection = (sid) => {
    setSelSections(prev => {
      if (prev[sid] !== undefined) {
        const next = { ...prev };
        delete next[sid];
        const remaining = Object.keys(next);
        setActiveSec(remaining[0] || "");
        return next;
      } else {
        const autoAll = sid === "urinalysis" || sid === "fecalysis";
        let testSel = {};
        if (autoAll) {
          const allT = (tests[sid] || []).flatMap(g => g.tests);
          allT.forEach(t => { testSel[t.id] = true; });
        }
        setActiveSec(sid);
        return { ...prev, [sid]: testSel };
      }
    });
    setGenerated(null);
  };

  const toggleTest = (sid, tid) => {
    setSelSections(prev => ({
      ...prev,
      [sid]: { ...prev[sid], [tid]: !prev[sid]?.[tid] }
    }));
    setGenerated(null);
  };

  const selectAllTests = (sid) => {
    const allT = (tests[sid] || []).flatMap(g => g.tests);
    const t = {}; allT.forEach(x => { t[x.id] = true; });
    setSelSections(prev => ({ ...prev, [sid]: t }));
    setGenerated(null);
  };

  const clearAllTests = (sid) => {
    setSelSections(prev => ({ ...prev, [sid]: {} }));
    setGenerated(null);
  };

  const handleGenerate = useCallback(async () => {
    if (!patientId) return alert("Please select a patient.");
    if (!addedSectionIds.length) return alert("Please add at least one lab section.");
    if (!totalSelectedTests) return alert("Please select at least one test.");

    const serial = genSerial();
    const secData = {};

    addedSectionIds.forEach(sid => {
      const tids = Object.keys(selSections[sid] || {}).filter(k => selSections[sid][k]);
      if (tids.length > 0) secData[sid] = tids;
    });

    const orderData = { patientId, sections: secData, createdAt: new Date().toISOString() };
    await bcSaveSingle(serial, orderData);

    setTimeout(() => {
      if (canvasRef.current) {
        drawBarcode(canvasRef.current, serial);
        const dataUrl = canvasRef.current.toDataURL("image/png");
        setGenerated({ serial, canvasDataUrl: dataUrl, sections: secData });
      }
    }, 40);
  }, [patientId, selSections, addedSectionIds, totalSelectedTests]);

  const handlePrint = () => {
    if (!generated || !pat) return;
    printBarcodeLabel({
      serial: generated.serial,
      patientName: pat.name,
      sections: generated.sections,
      sectionDefs: sections,
      testMap: tests,
      canvasDataUrl: generated.canvasDataUrl
    });
  };

  const handleScan = async () => {
    const raw = (scanInput || "").trim().toUpperCase();
    if (!raw) { setScanError("Please enter or scan a barcode serial."); return; }

    const store = await bcLoadAll();
    const order = store[raw];
    if (!order) { setScanError(`Serial "${raw}" not found in barcode register.`); return; }

    const p = patients.find(x => x.id === order.patientId);
    if (!p) { setScanError("Patient record not found."); return; }

    const secs = Object.keys(order.sections || {}).map(sid => ({
      section: sections.find(s => s.id === sid) || { id: sid, label: sid, icon: "parameters" },
      testIds: order.sections[sid] || []
    })).filter(x => x.section);

    if (!secs.length) { setScanError("No valid sections found in order."); return; }

    setScanError("");
    setScanResult({ serial: raw, patient: p, secs });
    setScanActiveTab(secs[0]?.section.id || "");
  };

  const handleNavigateSection = (sid, tids) => {
    if (!scanResult) return;
    onNav(`lab:${sid}`, { patientId: scanResult.patient.id, section: sid, testIds: tids });
  };

  useEffect(() => {
    if (activeTab === "scan" && scanRef.current) scanRef.current.focus();
  }, [activeTab]);

  const activeSecGroups = activeSec ? (tests[activeSec] || []) : [];
  const activeSecSelections = selSections[activeSec] || {};
  const activeSecCount = Object.values(activeSecSelections).filter(Boolean).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card style={{ padding: "16px 20px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="barcode" size={22} color={C.accent} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: C.text }}>Specimen Barcode & USB Scanner Center</div>
            <div style={{ fontSize: 11.5, color: C.muted }}>Generate short order barcodes (e.g. BC-48291) and scan to route test entries</div>
          </div>
        </div>
      </Card>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => setActiveTab("generate")}
          style={Btn(activeTab === "generate" ? "accent" : "ghost", { height: 36 })}
        >
          🖨 Generate Specimen Barcode
        </button>
        <button
          onClick={() => setActiveTab("scan")}
          style={Btn(activeTab === "scan" ? "accent" : "ghost", { height: 36 })}
        >
          📷 USB Scanner Mode
        </button>
      </div>

      {activeTab === "generate" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card>
              <CardHead title="1. Select Patient" icon={<Icon name="patients" size={18} color={C.accent} />} />
              <div style={{ padding: 16 }}>
                <Field label="Target Patient">
                  <select
                    value={patientId}
                    onChange={(e) => { setPatientId(e.target.value); setGenerated(null); }}
                    style={inp({ width: "100%", fontWeight: 600 })}
                  >
                    <option value="">-- Choose Patient --</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.mrn || p.pid || p.id.slice(0, 8)})
                      </option>
                    ))}
                  </select>
                </Field>

                {pat && (
                  <div style={{ marginTop: 10, padding: "8px 12px", background: C.surface, borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 12, color: C.muted }}>
                    Age / Sex: <strong>{calcAge(pat.dob)}</strong> / <strong>{pat.gender || "M/F"}</strong>
                  </div>
                )}
              </div>
            </Card>

            <Card>
              <CardHead title="2. Add Laboratory Sections" icon={<Icon name="parameters" size={18} color={C.accent} />} />
              <div style={{ padding: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
                {sections.map((s) => {
                  const isAdded = selSections[s.id] !== undefined;
                  const count = isAdded ? Object.values(selSections[s.id] || {}).filter(Boolean).length : 0;

                  return (
                    <button
                      key={s.id}
                      onClick={() => toggleSection(s.id)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 20,
                        border: `1.5px solid ${isAdded ? C.accent : C.border}`,
                        background: isAdded ? C.accentLight : "#fff",
                        color: isAdded ? C.accent : C.text,
                        fontWeight: isAdded ? 700 : 500,
                        fontSize: 12,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      {s.label}
                      {isAdded && (
                        <span style={{ padding: "1px 6px", borderRadius: 10, background: C.accent, color: "#fff", fontSize: 10 }}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </Card>

            {addedSectionIds.length > 0 && (
              <Card>
                <CardHead title="3. Select Test Parameters" icon={<Icon name="check" size={18} color={C.accent} />} />
                <div style={{ padding: 16 }}>
                  <div style={{ display: "flex", gap: 6, overflowX: "auto", borderBottom: `1px solid ${C.border}`, paddingBottom: 8, marginBottom: 12 }}>
                    {addedSectionIds.map((sid) => {
                      const sd = sections.find((s) => s.id === sid);
                      const isActive = activeSec === sid;
                      const count = Object.values(selSections[sid] || {}).filter(Boolean).length;

                      return (
                        <button
                          key={sid}
                          onClick={() => setActiveSec(sid)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: 6,
                            border: "none",
                            background: isActive ? C.accent : C.surface,
                            color: isActive ? "#fff" : C.text,
                            fontWeight: isActive ? 700 : 500,
                            fontSize: 12,
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {sd?.label || sid} ({count})
                        </button>
                      );
                    })}
                  </div>

                  {activeSec && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: C.muted }}>
                          {activeSecCount} parameters selected
                        </span>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button onClick={() => selectAllTests(activeSec)} style={Btn("ghost", { height: 26, fontSize: 11 })}>
                            Select All
                          </button>
                          <button onClick={() => clearAllTests(activeSec)} style={Btn("ghost", { height: 26, fontSize: 11 })}>
                            Clear
                          </button>
                        </div>
                      </div>

                      <div style={{ maxHeight: 220, overflowY: "auto", border: `1px solid ${C.border}`, borderRadius: 8, padding: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                        {activeSecGroups.map((grp, gi) => (
                          <div key={gi} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: C.accent, textTransform: "uppercase", padding: "4px 0" }}>
                              {grp.group}
                            </div>
                            {grp.tests.map((t) => (
                              <label key={t.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, cursor: "pointer", padding: "2px 4px" }}>
                                <input
                                  type="checkbox"
                                  checked={!!activeSecSelections[t.id]}
                                  onChange={() => toggleTest(activeSec, t.id)}
                                  style={{ accentColor: C.accent }}
                                />
                                <span>{t.name}</span>
                              </label>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}

            <button onClick={handleGenerate} style={Btn("accent", { height: 40, justifyContent: "center", fontSize: 13.5 })}>
              Generate Specimen Barcode Order ({totalSelectedTests} tests)
            </button>
          </div>

          <Card style={{ padding: 20, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>Specimen Label Preview</div>

            {!generated ? (
              <div style={{ padding: 40, color: C.faint, fontSize: 12 }}>
                Configure patient and tests on left, then click <strong>Generate</strong>.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%" }}>
                <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "3px", color: C.primary, fontFamily: "monospace" }}>
                  {generated.serial}
                </div>

                <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, background: "#fff", width: "100%" }}>
                  <canvas ref={canvasRef} style={{ maxWidth: "100%" }} />
                </div>

                <button onClick={handlePrint} style={Btn("primary", { width: "100%", height: 38, justifyContent: "center" })}>
                  🖨 Print Thermal Tube Label
                </button>
              </div>
            )}
          </Card>
        </div>
      )}

      {activeTab === "scan" && (
        <Card style={{ padding: 24, maxWidth: 600, margin: "0 auto", width: "100%" }}>
          <CardHead title="USB Barcode Scanner Listening Mode" sub="Scan specimen tube label with barcode scanner" icon={<Icon name="barcode" size={20} color={C.accent} />} />
          <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
            <Field label="Scan Serial Number">
              <div style={{ display: "flex", gap: 10 }}>
                <input
                  ref={scanRef}
                  type="text"
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && handleScan()}
                  placeholder="e.g. BC-48291"
                  style={inp({ flex: 1, height: 40, fontSize: 16, letterSpacing: "2px", fontWeight: 700, textAlign: "center" })}
                  autoFocus
                />
                <button onClick={handleScan} style={Btn("accent", { height: 40 })}>
                  Lookup
                </button>
              </div>
            </Field>

            {scanError && (
              <div style={{ padding: "10px 12px", background: C.dangerLight, color: C.danger, borderRadius: 6, fontSize: 12 }}>
                {scanError}
              </div>
            )}

            {scanResult && (
              <div style={{ padding: 16, background: C.surface, borderRadius: 8, border: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: C.text }}>{scanResult.patient.name}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>Order Serial: {scanResult.serial}</div>
                </div>

                <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>
                  {scanResult.secs.map(({ section, testIds }) => (
                    <button
                      key={section.id}
                      onClick={() => setScanActiveTab(section.id)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 6,
                        border: "none",
                        background: scanActiveTab === section.id ? C.accent : "#fff",
                        color: scanActiveTab === section.id ? "#fff" : C.text,
                        fontWeight: 600,
                        fontSize: 12,
                        cursor: "pointer",
                      }}
                    >
                      {section.label} ({testIds.length})
                    </button>
                  ))}
                </div>

                {scanResult.secs.map(({ section, testIds }) => {
                  if (scanActiveTab !== section.id) return null;
                  return (
                    <div key={section.id} style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
                      <div style={{ fontSize: 12, color: C.muted }}>{testIds.length} ordered parameters in this section</div>
                      <button
                        onClick={() => handleNavigateSection(section.id, testIds)}
                        style={Btn("accent", { height: 36, justifyContent: "center" })}
                      >
                        Proceed to {section.label} Entry →
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
