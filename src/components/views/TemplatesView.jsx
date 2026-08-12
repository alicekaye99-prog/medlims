import React, { useState, useRef, useEffect } from "react";
import { C, Btn, inp, Field, Card, uid } from "../../utils/helpers.jsx";
import { SECTIONS, PRESET_COLORS, getTemplate, saveTemplates, _templates, DEFAULT_SIGS, defaultBlocks } from "../../constants/data.js";

export function TemplatesView({ sections = [], hospital = {} }) {
  const [editSec, setEditSec] = useState(null); // null = picker, string = editing
  const [editLabel, setEditLabel] = useState("");

  if (editSec !== null) {
    return (
      <TemplateEditorModule
        sectionId={editSec || null}
        sectionLabel={editLabel}
        hospital={hospital}
        onBack={() => setEditSec(null)}
      />
    );
  }

  return (
    <TemplatePicker
      sections={sections}
      onSelect={(id, label) => {
        setEditSec(id === null ? "_master" : id);
        setEditLabel(label);
      }}
    />
  );
}

function TemplatePicker({ sections, onSelect }) {
  const [tpls, setTpls] = useState(() => ({ ..._templates }));

  useEffect(() => {
    const id = setInterval(() => setTpls({ ..._templates }), 500);
    return () => clearInterval(id);
  }, []);

  const deptTpl = tpls.lab || {};

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <div style={{ fontWeight: 800, fontSize: 16, color: C.text }}>Result Templates</div>
        <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>
          Customize colors, fonts, positions, signatories, and watermark images per section
        </div>
      </div>

      <div
        style={{
          background: C.accent + "0a",
          border: `1.5px solid ${C.accent}30`,
          borderRadius: 12,
          padding: "16px 18px",
          cursor: "pointer",
          transition: "all .15s",
        }}
        onClick={() => onSelect(null, "Master Template")}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.accent + "70"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.accent + "30"; }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: C.accent + "20", display: "flex", alignItems: "center", justifyContent: "center", color: C.accent, fontWeight: 900, fontSize: 14 }}>
            M
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: C.accent }}>Master Template</div>
            <div style={{ fontSize: 11, color: C.muted }}>Default for all laboratory sections</div>
          </div>
          {deptTpl._master && (
            <span style={{ background: C.accent + "15", color: C.accent, padding: "2px 8px", borderRadius: 99, fontSize: 9, fontWeight: 700 }}>
              Customized
            </span>
          )}
        </div>
      </div>

      <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".07em" }}>
        Section Specific Templates
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {sections.map((s) => {
          const t = deptTpl[s.id];
          const col = t?.sectionColor || s.color;
          return (
            <div
              key={s.id}
              onClick={() => onSelect(s.id, s.label)}
              style={{
                background: "#fff",
                border: `1.5px solid ${t ? col + "50" : C.border}`,
                borderRadius: 9,
                padding: "12px 14px",
                cursor: "pointer",
                transition: "all .15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = col;
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = t ? col + "50" : C.border;
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: col }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{s.label}</span>
              </div>
              {t ? (
                <div style={{ fontSize: 10, color: col, marginTop: 3, fontWeight: 600 }}>Customized</div>
              ) : (
                <div style={{ fontSize: 10, color: C.faint, marginTop: 3 }}>Uses master</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TemplateEditorModule({ sectionId, sectionLabel, hospital, onBack }) {
  const [flash, setFlash] = useState(false);
  const tplKey = sectionId || "_master";
  const sLabel = sectionLabel || (tplKey === "_master" ? "Master Template" : tplKey);
  const sec = SECTIONS.find((s) => s.id === sectionId);
  const saved = (_templates.lab || {})[tplKey] || {};

  // Section Color
  const usedColors = [];
  const deptTpls = _templates.lab || {};
  Object.entries(deptTpls).forEach(([k, v]) => {
    if (k !== tplKey && v.sectionColor) usedColors.push(v.sectionColor);
  });
  const defaultColor = sec?.color || C.accent;
  const [sectionColor, setSectionColor] = useState(saved.sectionColor || defaultColor);

  // Content Blocks
  const defs = defaultBlocks(sLabel);
  const initBlock = (key) => ({ ...defs[key], ...(saved.blocks?.[key] || {}) });
  const [blocks, setBlocks] = useState({
    clinicHeader: initBlock("clinicHeader"),
    deptLabel: initBlock("deptLabel"),
    addressLine: initBlock("addressLine"),
    phoneLine: initBlock("phoneLine"),
    reportTitle: initBlock("reportTitle"),
    patientInfo: initBlock("patientInfo"),
    resultsTable: initBlock("resultsTable"),
    signatures: initBlock("signatures"),
  });
  const updateBlock = (key, u) => setBlocks((prev) => ({ ...prev, [key]: { ...prev[key], ...u } }));

  // Header Text Overrides
  const [clinicName, setClinicName] = useState(saved.clinicName || "");
  const [deptNameOvr, setDeptNameOvr] = useState(saved.deptName || "Laboratory Department");
  const [addressOvr, setAddressOvr] = useState(saved.address || "");
  const [phoneOvr, setPhoneOvr] = useState(saved.phone || "");
  const [showAddress, setShowAddress] = useState(saved.showAddress !== false);
  const [showPhone, setShowPhone] = useState(saved.showPhone !== false);
  const [reportTitleVal, setReportTitleVal] = useState(saved.reportTitle || blocks.reportTitle.text || (sLabel.toUpperCase() + " REPORT"));

  // Patient Info Fields
  const allPF = [
    { id: "name", label: "Patient Name" },
    { id: "age_sex", label: "Age / Sex" },
    { id: "dob", label: "Date of Birth" },
    { id: "date_time", label: "Date & Time" },
    { id: "ward", label: "Ward" },
    { id: "physician", label: "Physician" },
    { id: "patient_id", label: "Patient ID" },
  ];
  const [patientFields, setPatientFields] = useState(saved.patientFields || ["name", "age_sex", "dob", "date_time", "ward", "physician"]);

  // Signatories
  const [sigs, setSigs] = useState(saved.signatures || JSON.parse(JSON.stringify(DEFAULT_SIGS.lab)));

  // Floating Images & Text
  const [floatImages, setFloatImages] = useState((saved.floatImages || []).map((i) => ({ behindText: false, ...i })));
  const [floatTexts, setFloatTexts] = useState(saved.floatTexts || []);
  const [selImg, setSelImg] = useState(null);
  const [selTxt, setSelTxt] = useState(null);
  const floatFileRef = useRef(null);

  // Drag State
  const [drag, setDrag] = useState(null);
  const [selBlock, setSelBlock] = useState(null);

  useEffect(() => {
    if (!drag) return;
    const onMove = (e) => {
      const dy = e.clientY - drag.startY;
      if (drag.type === "block") updateBlock(drag.id, { y: Math.max(0, Math.min(400, drag.origY + dy)) });
      else if (drag.type === "img") setFloatImages((p) => p.map((i) => (i.id === drag.id ? { ...i, x: Math.max(0, drag.origX + (e.clientX - drag.startX)), y: Math.max(0, drag.origY + dy) } : i)));
      else if (drag.type === "txt") setFloatTexts((p) => p.map((t) => (t.id === drag.id ? { ...t, x: Math.max(0, drag.origX + (e.clientX - drag.startX)), y: Math.max(0, drag.origY + dy) } : t)));
      else if (drag.type === "resize") setFloatImages((p) => p.map((i) => (i.id === drag.id ? { ...i, width: Math.max(20, drag.origW + (e.clientX - drag.startX)), height: Math.max(15, drag.origH + dy) } : i)));
    };
    const onUp = () => setDrag(null);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [drag]);

  const handleFloatImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { alert("Max 3MB"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const id = "fi_" + uid();
      setFloatImages((p) => [...p, { id, src: ev.target.result, x: 30, y: 30 + Math.random() * 50, width: 120, height: 60, opacity: 1, behindText: false, label: file.name.replace(/\.[^.]+$/, "") }]);
      setSelImg(id);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const deleteFloatImg = (id) => {
    setFloatImages((p) => p.filter((i) => i.id !== id));
    if (selImg === id) setSelImg(null);
  };

  const updateFloatImg = (id, u) => setFloatImages((p) => p.map((i) => (i.id === id ? { ...i, ...u } : i)));

  const save = () => {
    const updated = JSON.parse(JSON.stringify(_templates));
    if (!updated.lab) updated.lab = {};
    const tplData = {
      clinicName,
      deptName: deptNameOvr,
      address: addressOvr,
      phone: phoneOvr,
      showAddress,
      showPhone,
      reportTitle: reportTitleVal,
      sectionColor,
      blocks,
      signatures: sigs,
      patientFields,
      floatImages,
      floatTexts,
      updatedAt: new Date().toISOString(),
    };
    updated.lab[tplKey] = tplData;

    if (tplKey === "_master") {
      SECTIONS.forEach((secItem) => {
        const existing = updated.lab[secItem.id];
        if (!existing || !existing._userCustomized) {
          const preservedColor = existing?.sectionColor || secItem.color;
          updated.lab[secItem.id] = {
            ...tplData,
            sectionColor: preservedColor,
            reportTitle: (secItem.label.toUpperCase() + " REPORT"),
            _inheritedFromMaster: true,
            updatedAt: new Date().toISOString(),
          };
        } else {
          updated.lab[secItem.id] = {
            ...existing,
            clinicName: tplData.clinicName,
            deptName: tplData.deptName,
            address: tplData.address,
            phone: tplData.phone,
            showAddress: tplData.showAddress,
            showPhone: tplData.showPhone,
            floatImages: tplData.floatImages,
            floatTexts: tplData.floatTexts,
            signatures: tplData.signatures,
            patientFields: tplData.patientFields,
          };
        }
      });
    } else {
      updated.lab[tplKey]._userCustomized = true;
    }

    saveTemplates(updated);
    setFlash(true);
    setTimeout(() => setFlash(false), 2000);
  };

  const reset = () => {
    if (!confirm("Reset this template to defaults?")) return;
    const d = defaultBlocks(sLabel);
    setBlocks({ clinicHeader: d.clinicHeader, deptLabel: d.deptLabel, addressLine: d.addressLine, phoneLine: d.phoneLine, reportTitle: d.reportTitle, patientInfo: d.patientInfo, resultsTable: d.resultsTable, signatures: d.signatures });
    setClinicName(""); setDeptNameOvr("Laboratory Department"); setAddressOvr(""); setPhoneOvr("");
    setShowAddress(true); setShowPhone(true); setReportTitleVal(sLabel.toUpperCase() + " REPORT");
    setSectionColor(defaultColor); setSigs(JSON.parse(JSON.stringify(DEFAULT_SIGS.lab)));
    setPatientFields(["name", "age_sex", "dob", "date_time", "ward", "physician"]);
    setFloatImages([]); setFloatTexts([]); setSelBlock(null); setSelImg(null); setSelTxt(null);
  };

  const hexToRgb = (hex) => {
    if (!hex || hex[0] !== "#") return [0, 0, 0];
    return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
  };
  const sc = hexToRgb(sectionColor);

  const BlockSettings = ({ bKey, label, block }) => {
    const hasAlignColor = ["clinicHeader", "deptLabel", "addressLine", "phoneLine", "reportTitle"].includes(bKey);
    return (
      <div style={{ padding: 10, background: C.surface, borderRadius: 6, border: `1px solid ${C.border}`, marginBottom: 6 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontWeight: 700, fontSize: 11, color: C.text }}>{label}</span>
          <span style={{ fontSize: 9, color: C.faint }}>Y: {Math.round(block.y)}px</span>
        </div>
        <div style={{ display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
            <button onClick={() => updateBlock(bKey, { fontSize: Math.max(5, (block.fontSize || 12) - 1) })} style={{ width: 18, height: 22, border: `1px solid ${C.border}`, borderRadius: "3px 0 0 3px", fontSize: 11, background: "#fff", cursor: "pointer", color: C.text, fontWeight: 700, lineHeight: 1 }}>−</button>
            <input type="number" min={5} max={48} value={block.fontSize || 12} onChange={(e) => updateBlock(bKey, { fontSize: Math.max(5, Math.min(48, parseInt(e.target.value) || 12)) })} style={{ width: 30, height: 22, border: `1px solid ${C.border}`, borderLeft: "none", borderRight: "none", fontSize: 10, textAlign: "center", fontWeight: 600, outline: "none", fontFamily: "inherit" }} />
            <button onClick={() => updateBlock(bKey, { fontSize: Math.min(48, (block.fontSize || 12) + 1) })} style={{ width: 18, height: 22, border: `1px solid ${C.border}`, borderRadius: "0 3px 3px 0", fontSize: 11, background: "#fff", cursor: "pointer", color: C.text, fontWeight: 700, lineHeight: 1 }}>+</button>
          </div>
          {hasAlignColor && (
            <>
              <button onClick={() => updateBlock(bKey, { bold: !block.bold })} style={{ width: 22, height: 22, border: `1px solid ${C.border}`, borderRadius: 3, fontWeight: 900, fontSize: 11, background: block.bold ? C.accentLight : "#fff", cursor: "pointer", color: C.text }}>B</button>
              <label style={{ position: "relative", width: 22, height: 22, border: `1px solid ${C.border}`, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "#fff" }}>
                <span style={{ fontSize: 12, fontWeight: 900, color: block.color || "#000" }}>A</span>
                <input type="color" value={block.color || "#000000"} onChange={(e) => updateBlock(bKey, { color: e.target.value })} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
              </label>
              {["left", "center", "right"].map((a) => (
                <button key={a} onClick={() => updateBlock(bKey, { align: a })} style={{ width: 22, height: 22, border: "1px solid " + (block.align === a ? C.accent : C.border), borderRadius: 3, fontSize: 9, background: block.align === a ? C.accentLight : "#fff", cursor: "pointer", color: C.text }}>{a[0].toUpperCase()}</button>
              ))}
            </>
          )}
        </div>
        <input type="range" min={0} max={400} value={Math.min(block.y, 400)} onChange={(e) => updateBlock(bKey, { y: parseInt(e.target.value) })} style={{ width: "100%", marginTop: 4, accentColor: sectionColor }} title="Vertical position" />
        {bKey === "resultsTable" && (
          <div style={{ marginTop: 6 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: C.muted }}>Row Spacing</span>
              <span style={{ fontSize: 9, color: C.faint }}>{(block.rowSpacing || 1.6).toFixed(1)}mm</span>
            </div>
            <input type="range" min={0.5} max={5} step={0.1} value={block.rowSpacing || 1.6} onChange={(e) => updateBlock(bKey, { rowSpacing: parseFloat(e.target.value) })} style={{ width: "100%", accentColor: sectionColor }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8, color: C.faint }}><span>Tight</span><span>Spacious</span></div>
          </div>
        )}
      </div>
    );
  };

  const sampleLines = [
    { testName: "Sample Test 1", value: "5.2", unit: "mg/dL", normalRange: "3.5-7.0", flag: "", group: "Lipid Profile" },
    { testName: "Sample Test 2", value: "142", unit: "mmol/L", normalRange: "136-145", flag: "", group: "Lipid Profile" },
    { testName: "Sample Test 3", value: "3.1", unit: "g/dL", normalRange: "3.5-5.5", flag: "LO", group: "Electrolytes" },
  ];

  const PBlock = ({ bKey, children }) => {
    const b = blocks[bKey];
    const isSel = selBlock === bKey;
    return (
      <div
        onMouseDown={(e) => {
          if (e.target.dataset?.noDrag) return;
          e.preventDefault();
          setSelBlock(bKey);
          setSelImg(null);
          setSelTxt(null);
          setDrag({ type: "block", id: bKey, startY: e.clientY, origY: b.y });
        }}
        onClick={(e) => {
          e.stopPropagation();
          setSelBlock(bKey);
          setSelImg(null);
          setSelTxt(null);
        }}
        style={{
          position: "absolute",
          left: 30,
          right: 30,
          top: b.y,
          cursor: drag?.id === bKey ? "grabbing" : "grab",
          border: isSel ? "1.5px dashed " + sectionColor : "1.5px dashed transparent",
          borderRadius: 3,
          padding: "2px 4px",
          background: isSel ? "rgba(37,99,235,.03)" : "transparent",
          zIndex: isSel ? 5 : 2,
          userSelect: "none",
        }}
      >
        {children}
        {isSel && (
          <div style={{ position: "absolute", left: -18, top: "50%", transform: "translateY(-50%)", fontSize: 10, color: sectionColor, cursor: "ns-resize", userSelect: "none" }}>
            ⠿
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <button onClick={onBack} style={{ ...Btn("ghost"), fontSize: 12 }}>← Back</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: C.text }}>{sLabel} — Template</div>
        </div>
        <button onClick={reset} style={{ padding: "5px 12px", border: `1px solid ${C.border}`, background: "#fff", borderRadius: 6, color: C.muted, fontWeight: 600, fontSize: 11, cursor: "pointer" }}>
          Reset
        </button>
        <button onClick={save} style={{ padding: "5px 16px", background: sectionColor, border: "none", borderRadius: 6, color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
          {flash ? (tplKey === "_master" ? "✓ Applied to All" : "✓ Saved") : (tplKey === "_master" ? "Save & Apply to All" : "Save Template")}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 12, alignItems: "start" }}>
        {/* LEFT CONTROLS */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: "calc(100vh - 140px)", overflowY: "auto", overflowX: "hidden", paddingRight: 4 }}>
          {/* Section Color */}
          <div style={{ background: C.card, borderRadius: 10, border: `1px solid ${C.border}`, boxShadow: "0 1px 4px rgba(15,45,74,.06)" }}>
            <div style={{ padding: "10px 12px" }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: C.text, marginBottom: 6 }}>Section Color</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(9,1fr)", gap: 3 }}>
                {PRESET_COLORS.map((c) => {
                  const taken = usedColors.includes(c);
                  return (
                    <div
                      key={c}
                      onClick={() => !taken && setSectionColor(c)}
                      style={{
                        width: "100%",
                        paddingBottom: "100%",
                        borderRadius: 4,
                        background: c,
                        cursor: taken ? "not-allowed" : "pointer",
                        border: sectionColor === c ? "2.5px solid #111" : "2px solid transparent",
                        opacity: taken ? 0.2 : 1,
                        boxSizing: "border-box",
                      }}
                      title={taken ? "Used" : c}
                    />
                  );
                })}
              </div>
              <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
                <input type="color" value={sectionColor} onChange={(e) => setSectionColor(e.target.value)} style={{ width: 28, height: 20, border: `1px solid ${C.border}`, borderRadius: 3, cursor: "pointer" }} />
                <span style={{ fontSize: 10, fontFamily: "monospace", color: C.faint }}>{sectionColor}</span>
              </div>
            </div>
          </div>

          {/* Block Sliders & Font Controls */}
          <div style={{ background: C.card, borderRadius: 10, border: `1px solid ${C.border}`, boxShadow: "0 1px 4px rgba(15,45,74,.06)" }}>
            <div style={{ padding: "10px 12px" }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: C.text, marginBottom: 6 }}>
                Content Blocks <span style={{ fontSize: 9, color: C.faint, fontWeight: 400 }}>— drag on preview or use sliders</span>
              </div>
              <BlockSettings bKey="clinicHeader" label="Clinic Name" block={blocks.clinicHeader} />
              <BlockSettings bKey="deptLabel" label="Department Label" block={blocks.deptLabel} />
              {showAddress && <BlockSettings bKey="addressLine" label="Address" block={blocks.addressLine} />}
              {showPhone && <BlockSettings bKey="phoneLine" label="Phone" block={blocks.phoneLine} />}
              <BlockSettings bKey="reportTitle" label="Report Title" block={blocks.reportTitle} />
              <BlockSettings bKey="patientInfo" label="Patient Info" block={blocks.patientInfo} />
              <BlockSettings bKey="resultsTable" label="Results Table" block={blocks.resultsTable} />
              <BlockSettings bKey="signatures" label="Signatures" block={blocks.signatures} />
            </div>
          </div>

          {/* Header Text Overrides */}
          <div style={{ background: C.card, borderRadius: 10, border: `1px solid ${C.border}`, boxShadow: "0 1px 4px rgba(15,45,74,.06)" }}>
            <div style={{ padding: "10px 12px" }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: C.text, marginBottom: 6 }}>Header Text</div>
              {[
                ["Clinic Name", "cn", clinicName, setClinicName],
                ["Dept Label", "dn", deptNameOvr, setDeptNameOvr],
                ["Address", "ad", addressOvr, setAddressOvr],
                ["Phone", "ph", phoneOvr, setPhoneOvr],
                ["Report Title", "rt", reportTitleVal, setReportTitleVal],
              ].map(([l, k, v, s]) => (
                <div key={k} style={{ marginBottom: 4 }}>
                  <div style={{ fontSize: 9, fontWeight: 600, color: C.faint }}>{l}</div>
                  <input value={v} onChange={(e) => s(e.target.value)} placeholder="Default" style={{ width: "100%", padding: "4px 6px", border: `1px solid ${C.border}`, borderRadius: 4, fontSize: 10, fontFamily: "inherit" }} />
                </div>
              ))}
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                {[
                  ["Address", showAddress, setShowAddress],
                  ["Phone", showPhone, setShowPhone],
                ].map(([l, v, s]) => (
                  <label key={l} style={{ fontSize: 10, display: "flex", alignItems: "center", gap: 3, cursor: "pointer" }}>
                    <input type="checkbox" checked={v} onChange={(e) => s(e.target.checked)} style={{ accentColor: sectionColor }} />
                    {l}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Patient Info Fields */}
          <div style={{ background: C.card, borderRadius: 10, border: `1px solid ${C.border}`, boxShadow: "0 1px 4px rgba(15,45,74,.06)" }}>
            <div style={{ padding: "10px 12px" }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: C.text, marginBottom: 4 }}>Patient Info Fields</div>
              {allPF.map((f) => (
                <label key={f.id} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, cursor: "pointer", padding: "1px 0" }}>
                  <input type="checkbox" checked={patientFields.includes(f.id)} onChange={(e) => setPatientFields((p) => (e.target.checked ? [...p, f.id] : p.filter((x) => x !== f.id)))} style={{ accentColor: sectionColor }} />
                  {f.label}
                </label>
              ))}
            </div>
          </div>

          {/* Signatories */}
          <div style={{ background: C.card, borderRadius: 10, border: `1px solid ${C.border}`, boxShadow: "0 1px 4px rgba(15,45,74,.06)" }}>
            <div style={{ padding: "10px 12px" }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: C.text, marginBottom: 6 }}>Signatories</div>
              {sigs.map((sig, i) => (
                <div key={i} style={{ display: "flex", gap: 4, alignItems: "center", marginBottom: 4 }}>
                  <input value={sig.role} onChange={(e) => { const n = [...sigs]; n[i] = { ...n[i], role: e.target.value }; setSigs(n); }} style={{ flex: 1, padding: "3px 6px", border: `1px solid ${C.border}`, borderRadius: 3, fontSize: 10 }} />
                  <input value={sig.field} onChange={(e) => { const n = [...sigs]; n[i] = { ...n[i], field: e.target.value }; setSigs(n); }} placeholder="field" style={{ width: 60, padding: "3px 6px", border: `1px solid ${C.border}`, borderRadius: 3, fontSize: 9, fontFamily: "monospace" }} />
                  <label style={{ fontSize: 8, display: "flex", alignItems: "center", gap: 2, cursor: "pointer" }}>
                    <input type="checkbox" checked={sig.showLic} onChange={(e) => { const n = [...sigs]; n[i] = { ...n[i], showLic: e.target.checked }; setSigs(n); }} style={{ width: 10, height: 10 }} />
                    Lic
                  </label>
                  <button onClick={() => setSigs(sigs.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: C.danger, cursor: "pointer", fontSize: 12, fontWeight: 700 }}>×</button>
                </div>
              ))}
              <button onClick={() => setSigs([...sigs, { role: "New Role", field: "sig", showLic: true }])} style={{ fontSize: 10, color: sectionColor, background: "none", border: `1px dashed ${sectionColor}40`, borderRadius: 4, padding: "3px 8px", cursor: "pointer", fontWeight: 600, width: "100%" }}>
                + Add Signatory
              </button>
            </div>
          </div>

          {/* Floating Images & Text */}
          <div style={{ background: C.card, borderRadius: 10, border: `1px solid ${C.border}`, boxShadow: "0 1px 4px rgba(15,45,74,.06)" }}>
            <div style={{ padding: "10px 12px" }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: C.text, marginBottom: 6 }}>Floating Images & Text</div>
              <input ref={floatFileRef} type="file" accept="image/*" onChange={handleFloatImageUpload} style={{ display: "none" }} />
              <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
                <button onClick={() => floatFileRef.current?.click()} style={{ flex: 1, fontSize: 10, color: "#7c3aed", background: "#f5f3ff", border: "1px solid #c4b5fd", borderRadius: 4, padding: "4px 0", cursor: "pointer", fontWeight: 600 }}>+ Image</button>
                <button onClick={() => setFloatTexts((p) => [...p, { id: "ft_" + uid(), text: "Text", x: 40, y: 100, fontSize: 12, bold: false, color: "#000000" }])} style={{ flex: 1, fontSize: 10, color: "#0369a1", background: "#f0f9ff", border: "1px solid #7dd3fc", borderRadius: 4, padding: "4px 0", cursor: "pointer", fontWeight: 600 }}>+ Text</button>
              </div>
              {floatImages.map((img) => (
                <div key={img.id} onClick={() => { setSelImg(img.id); setSelTxt(null); setSelBlock(null); }} style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 4px", borderRadius: 3, cursor: "pointer", background: selImg === img.id ? "#f5f3ff" : "transparent", marginBottom: 2, fontSize: 9 }}>
                  <img src={img.src} style={{ width: 20, height: 14, objectFit: "contain", borderRadius: 2, border: `1px solid ${C.border}` }} alt="" />
                  <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: C.text }}>{img.label || "Img"}</span>
                  <label title="Behind text" style={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer", color: img.behindText ? "#7c3aed" : C.faint }}>
                    <input type="checkbox" checked={!!img.behindText} onChange={(e) => { e.stopPropagation(); updateFloatImg(img.id, { behindText: e.target.checked }); }} style={{ width: 9, height: 9 }} />
                    Bh
                  </label>
                  <button onClick={(e) => { e.stopPropagation(); deleteFloatImg(img.id); }} style={{ background: "none", border: "none", color: C.danger, cursor: "pointer", fontWeight: 700 }}>×</button>
                </div>
              ))}
              {floatTexts.map((ft) => (
                <div key={ft.id} onClick={() => { setSelTxt(ft.id); setSelImg(null); setSelBlock(null); }} style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 4px", borderRadius: 3, cursor: "pointer", background: selTxt === ft.id ? "#f0f9ff" : "transparent", marginBottom: 2, fontSize: 9 }}>
                  <span style={{ flex: 1, color: ft.color || C.text, fontWeight: ft.bold ? 700 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ft.text || "(empty)"}</span>
                  <button onClick={(e) => { e.stopPropagation(); setFloatTexts((p) => p.filter((t) => t.id !== ft.id)); if (selTxt === ft.id) setSelTxt(null); }} style={{ background: "none", border: "none", color: C.danger, cursor: "pointer", fontWeight: 700 }}>×</button>
                </div>
              ))}
              {selImg && floatImages.find((i) => i.id === selImg) && (
                (() => {
                  const img = floatImages.find((i) => i.id === selImg);
                  return (
                    <div style={{ padding: 6, background: "#faf5ff", borderRadius: 4, border: "1px solid #e9d5ff", marginTop: 4 }}>
                      <div style={{ display: "flex", gap: 3, marginBottom: 3 }}>
                        {[
                          ["X", img.x, "x"],
                          ["Y", img.y, "y"],
                          ["W", img.width, "width"],
                          ["H", img.height, "height"],
                        ].map(([l, v, k]) => (
                          <div key={k} style={{ flex: 1 }}>
                            <div style={{ fontSize: 7, fontWeight: 700, color: "#7c3aed" }}>{l}</div>
                            <input type="number" value={Math.round(v)} onChange={(e) => updateFloatImg(img.id, { [k]: parseFloat(e.target.value) || 0 })} style={{ width: "100%", padding: "1px 2px", border: "1px solid #e0d5f0", borderRadius: 2, fontSize: 9, fontFamily: "monospace" }} />
                          </div>
                        ))}
                      </div>
                      <div style={{ fontSize: 7, color: "#7c3aed", fontWeight: 700 }}>Opacity {Math.round((img.opacity ?? 1) * 100)}%</div>
                      <input type="range" min="0.05" max="1" step="0.05" value={img.opacity ?? 1} onChange={(e) => updateFloatImg(img.id, { opacity: parseFloat(e.target.value) })} style={{ width: "100%", accentColor: "#7c3aed" }} />
                    </div>
                  );
                })()
              )}
              {selTxt && floatTexts.find((t) => t.id === selTxt) && (
                (() => {
                  const ft = floatTexts.find((t) => t.id === selTxt);
                  const up = (u) => setFloatTexts((p) => p.map((t) => (t.id === ft.id ? { ...t, ...u } : t)));
                  return (
                    <div style={{ padding: 6, background: "#f0f9ff", borderRadius: 4, border: "1px solid #bae6fd", marginTop: 4 }}>
                      <input value={ft.text} onChange={(e) => up({ text: e.target.value })} style={{ width: "100%", padding: "3px 5px", border: "1px solid #bae6fd", borderRadius: 3, fontSize: 10, marginBottom: 3 }} />
                      <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
                        <input type="number" value={ft.fontSize || 12} min={6} max={48} onChange={(e) => up({ fontSize: parseInt(e.target.value) || 12 })} style={{ width: 36, padding: "1px 2px", border: "1px solid #bae6fd", borderRadius: 2, fontSize: 9 }} />
                        <input type="color" value={ft.color || "#000"} onChange={(e) => up({ color: e.target.value })} style={{ width: 20, height: 18, border: "1px solid #bae6fd", borderRadius: 2, cursor: "pointer" }} />
                        <button onClick={() => up({ bold: !ft.bold })} style={{ width: 20, height: 18, border: "1px solid " + (ft.bold ? C.accent : "#bae6fd"), borderRadius: 2, fontWeight: 900, fontSize: 10, background: ft.bold ? C.accentLight : "#fff", cursor: "pointer" }}>B</button>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
          </div>
        </div>

        {/* RIGHT LIVE CANVAS PREVIEW */}
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, color: C.faint, textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 4 }}>
            Live Preview — drag blocks to reposition · Legal Page 8.5″ × 14″ (content prints in top half only)
          </div>
          <div
            onClick={() => { setSelBlock(null); setSelImg(null); setSelTxt(null); }}
            style={{
              background: "#fff",
              border: `1px solid ${C.border}`,
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,.1)",
              width: 500,
              height: 824,
              margin: "0 auto",
              position: "relative",
              overflow: "hidden",
              fontFamily: "'Times New Roman',Times,serif",
              color: "#111",
            }}
          >
            {/* Bottom Half Fold Area Indicator */}
            <div style={{ position: "absolute", left: 0, right: 0, top: 412, bottom: 0, background: "repeating-linear-gradient(45deg,transparent,transparent 4px,rgba(0,0,0,.03) 4px,rgba(0,0,0,.03) 8px)", zIndex: 0, pointerEvents: "none" }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 412, borderTop: "2px dashed #ccc", zIndex: 1, pointerEvents: "none" }} />
            <div style={{ position: "absolute", right: 6, top: 416, fontSize: 8, color: "#bbb", pointerEvents: "none", zIndex: 1 }}>
              ✂ --- 1:1 HALF PAGE CUT / FOLD LINE (177.8mm) ---
            </div>

            {/* Floating Images (Behind Text) */}
            {floatImages.filter((fi) => fi.behindText).map((img) => {
              const isSel = selImg === img.id;
              return (
                <div
                  key={img.id}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelImg(img.id);
                    setSelTxt(null);
                    setSelBlock(null);
                    setDrag({ type: "img", id: img.id, startX: e.clientX, startY: e.clientY, origX: img.x, origY: img.y });
                  }}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    position: "absolute",
                    left: img.x,
                    top: img.y,
                    width: img.width,
                    height: img.height,
                    zIndex: 0,
                    cursor: "grab",
                    opacity: img.opacity ?? 1,
                    border: isSel ? "2px solid #7c3aed" : "2px solid transparent",
                    boxSizing: "border-box",
                    userSelect: "none",
                  }}
                >
                  <img src={img.src} draggable={false} style={{ width: "100%", height: "100%", objectFit: "contain", pointerEvents: "none" }} alt="" />
                  {isSel && (
                    <>
                      <div onClick={(e) => { e.stopPropagation(); deleteFloatImg(img.id); }} style={{ position: "absolute", top: -8, right: -8, width: 16, height: 16, borderRadius: "50%", background: C.danger, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 900, cursor: "pointer" }}>×</div>
                      <div onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); setDrag({ type: "resize", id: img.id, startX: e.clientX, startY: e.clientY, origW: img.width, origH: img.height }); }} style={{ position: "absolute", bottom: -4, right: -4, width: 8, height: 8, background: "#7c3aed", borderRadius: 1, cursor: "nwse-resize" }} />
                    </>
                  )}
                </div>
              );
            })}

            {/* Rendered Content Blocks */}
            <PBlock bKey="clinicHeader">
              <div style={{ textAlign: blocks.clinicHeader.align, fontSize: blocks.clinicHeader.fontSize, fontWeight: blocks.clinicHeader.bold ? 800 : 400, color: blocks.clinicHeader.color }}>
                {clinicName || hospital?.name || "BAIS DISTRICT HOSPITAL"}
              </div>
            </PBlock>

            <PBlock bKey="deptLabel">
              <div style={{ textAlign: blocks.deptLabel.align, fontSize: blocks.deptLabel.fontSize, fontWeight: blocks.deptLabel.bold ? 700 : 400, color: blocks.deptLabel.color }}>
                {deptNameOvr}
              </div>
            </PBlock>

            {showAddress && (
              <PBlock bKey="addressLine">
                <div style={{ textAlign: blocks.addressLine.align, fontSize: blocks.addressLine.fontSize, color: blocks.addressLine.color }}>
                  {addressOvr || hospital?.address || "{Address}"}
                </div>
              </PBlock>
            )}

            {showPhone && (
              <PBlock bKey="phoneLine">
                <div style={{ textAlign: blocks.phoneLine.align, fontSize: blocks.phoneLine.fontSize, color: blocks.phoneLine.color }}>
                  Tel: {phoneOvr || hospital?.phone || "{Phone}"}
                </div>
              </PBlock>
            )}

            <PBlock bKey="reportTitle">
              <div style={{ textAlign: blocks.reportTitle.align, fontSize: blocks.reportTitle.fontSize, fontWeight: blocks.reportTitle.bold ? 800 : 400, color: blocks.reportTitle.color || sectionColor }}>
                {reportTitleVal}
              </div>
            </PBlock>

            <PBlock bKey="patientInfo">
              <table style={{ width: "100%", fontSize: blocks.patientInfo.fontSize || 10, borderCollapse: "collapse" }}>
                <tbody>
                  {Array.from({ length: Math.ceil(patientFields.length / 2) }).map((_, i) => {
                    const f1 = allPF.find((f) => f.id === patientFields[i * 2]);
                    const f2 = allPF.find((f) => f.id === patientFields[i * 2 + 1]);
                    return (
                      <tr key={i}>
                        {f1 && (
                          <>
                            <td style={{ padding: "1px 0", color: "#666", width: "22%" }}>{f1.label}:</td>
                            <td style={{ padding: "1px 0", fontWeight: 700 }}>{"{"}{f1.id}{"}"}</td>
                          </>
                        )}
                        {f2 && (
                          <>
                            <td style={{ padding: "1px 0", color: "#666", width: "22%" }}>{f2.label}:</td>
                            <td style={{ padding: "1px 0", fontWeight: 700 }}>{"{"}{f2.id}{"}"}</td>
                          </>
                        )}
                        {!f2 && f1 && (
                          <>
                            <td />
                            <td />
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </PBlock>

            <PBlock bKey="resultsTable">
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: blocks.resultsTable.fontSize || 9 }}>
                <thead>
                  <tr style={{ background: `rgb(${sc.join(",")})`, color: "#fff" }}>
                    <th style={{ padding: "3px 6px", textAlign: "left", fontSize: 7 }}>TEST</th>
                    <th style={{ padding: "3px 6px", textAlign: "center", fontSize: 7 }}>RESULT</th>
                    <th style={{ padding: "3px 6px", textAlign: "center", fontSize: 7 }}>UNIT</th>
                    <th style={{ padding: "3px 6px", textAlign: "center", fontSize: 7 }}>NORMAL</th>
                    <th style={{ padding: "3px 6px", textAlign: "center", fontSize: 7 }}>FLAG</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const rsPx = (blocks.resultsTable.rowSpacing || 1.6) * 2.5;
                    let lastGrp = "";
                    return sampleLines.map((l, i) => {
                      const rows = [];
                      if (l.group && l.group !== lastGrp) {
                        rows.push(
                          <tr key={"g_" + i}>
                            <td colSpan={5} style={{ padding: `${rsPx + 2}px 6px ${rsPx * 0.3}px 2px`, fontSize: blocks.resultsTable.fontSize || 9, fontWeight: 700, color: `rgb(${sc.join(",")})` }}>
                              {l.group}
                            </td>
                          </tr>
                        );
                        lastGrp = l.group;
                      }
                      rows.push(
                        <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                          <td style={{ padding: `${rsPx}px 6px ${rsPx}px ${l.group ? "14px" : "6px"}`, fontSize: blocks.resultsTable.fontSize ? blocks.resultsTable.fontSize - 1 : 8 }}>{l.testName}</td>
                          <td style={{ padding: `${rsPx}px 6px`, fontSize: blocks.resultsTable.fontSize ? blocks.resultsTable.fontSize - 1 : 8, textAlign: "center", fontWeight: 700, color: l.flag === "LO" ? "#1a6fb5" : "#111" }}>{l.value}</td>
                          <td style={{ padding: `${rsPx}px 6px`, fontSize: (blocks.resultsTable.fontSize || 9) - 2, textAlign: "center", color: "#888" }}>{l.unit}</td>
                          <td style={{ padding: `${rsPx}px 6px`, fontSize: (blocks.resultsTable.fontSize || 9) - 2, textAlign: "center", color: "#666" }}>{l.normalRange}</td>
                          <td style={{ padding: `${rsPx}px 6px`, fontSize: (blocks.resultsTable.fontSize || 9) - 2, textAlign: "center", fontWeight: 700, color: l.flag === "LO" ? "#1a6fb5" : "#ccc" }}>{l.flag || ""}</td>
                        </tr>
                      );
                      return rows;
                    });
                  })()}
                </tbody>
              </table>
            </PBlock>

            <PBlock bKey="signatures">
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                {sigs.map((s, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <hr style={{ width: 80, margin: "0 auto 3px", border: "none", borderTop: "1px solid #333" }} />
                    <div style={{ fontWeight: 700, fontSize: 8 }}>{"{"}{s.field}{"}"}</div>
                    {s.showLic && <div style={{ fontSize: 6, color: "#999" }}>Lic. No. ___</div>}
                    <div style={{ fontSize: 6, color: "#666" }}>{s.role}</div>
                  </div>
                ))}
              </div>
            </PBlock>

            {/* Floating Images (In Front) */}
            {floatImages.filter((fi) => !fi.behindText).map((img) => {
              const isSel = selImg === img.id;
              return (
                <div
                  key={img.id}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelImg(img.id);
                    setSelTxt(null);
                    setSelBlock(null);
                    setDrag({ type: "img", id: img.id, startX: e.clientX, startY: e.clientY, origX: img.x, origY: img.y });
                  }}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    position: "absolute",
                    left: img.x,
                    top: img.y,
                    width: img.width,
                    height: img.height,
                    zIndex: 10 + (isSel ? 50 : 0),
                    cursor: "grab",
                    opacity: img.opacity ?? 1,
                    border: isSel ? "2px solid #7c3aed" : "2px solid transparent",
                    boxSizing: "border-box",
                    userSelect: "none",
                  }}
                >
                  <img src={img.src} draggable={false} style={{ width: "100%", height: "100%", objectFit: "contain", pointerEvents: "none" }} alt="" />
                  {isSel && (
                    <>
                      <div onClick={(e) => { e.stopPropagation(); deleteFloatImg(img.id); }} style={{ position: "absolute", top: -8, right: -8, width: 16, height: 16, borderRadius: "50%", background: C.danger, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 900, cursor: "pointer" }}>×</div>
                      <div onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); setDrag({ type: "resize", id: img.id, startX: e.clientX, startY: e.clientY, origW: img.width, origH: img.height }); }} style={{ position: "absolute", bottom: -4, right: -4, width: 8, height: 8, background: "#7c3aed", borderRadius: 1, cursor: "nwse-resize" }} />
                    </>
                  )}
                </div>
              );
            })}

            {/* Floating Texts */}
            {floatTexts.map((ft) => {
              const isSel = selTxt === ft.id;
              return (
                <div
                  key={ft.id}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelTxt(ft.id);
                    setSelImg(null);
                    setSelBlock(null);
                    setDrag({ type: "txt", id: ft.id, startX: e.clientX, startY: e.clientY, origX: ft.x, origY: ft.y });
                  }}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    position: "absolute",
                    left: ft.x,
                    top: ft.y,
                    zIndex: 15 + (isSel ? 50 : 0),
                    cursor: "grab",
                    userSelect: "none",
                    fontSize: ft.fontSize || 12,
                    fontWeight: ft.bold ? 700 : 400,
                    color: ft.color || "#000",
                    whiteSpace: "nowrap",
                    border: isSel ? "1.5px dashed #0369a1" : "1.5px dashed transparent",
                    padding: "1px 3px",
                    borderRadius: 2,
                  }}
                >
                  {ft.text || "Text"}
                  {isSel && (
                    <div onClick={(e) => { e.stopPropagation(); setFloatTexts((p) => p.filter((t) => t.id !== ft.id)); setSelTxt(null); }} style={{ position: "absolute", top: -8, right: -8, width: 14, height: 14, borderRadius: "50%", background: C.danger, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 900, cursor: "pointer" }}>
                      ×
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
