import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { fmtDate, calcAge } from "./helpers.jsx";
import { SECTION_COLORS, getTemplate } from "../constants/data.js";

export async function downloadResultAsPDF(result, patient, hospitalInfo, silent=false, staff=[]) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "legal" });
  const W = 215.9;
  const navy = [0,0,0], grey = [60,60,60], black = [0,0,0];
  const dateTime = result.date && result.time ? `${fmtDate(result.date)}, ${result.time}` : result.date ? fmtDate(result.date) : "—";

  const secId = (result.section || "").toLowerCase();
  const tpl = getTemplate(secId) || {};
  const hexToRgb = (hex) => { if(!hex || hex[0] !== "#") return null; return [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)]; };
  const clinicName = tpl.clinicName || hospitalInfo?.name || "CLINICAL LABORATORY";
  const deptName = tpl.deptName || "Laboratory Department";
  const address = tpl.address || hospitalInfo?.address || "";
  const phone = tpl.phone || hospitalInfo?.phone || "";
  const showAddress = tpl.showAddress !== false;
  const showPhone = tpl.showPhone !== false;
  const tplColor = tpl.sectionColor ? hexToRgb(tpl.sectionColor) : null;
  const reportTitle = tpl.reportTitle || ((result.sectionLabel || "").toUpperCase() + " REPORT");

  const HALF = 177.8;
  const PX2MM_Y = HALF / 412;
  const PX2MM_X = W / 500;
  const B = tpl.blocks || {};
  const bGet = (key, field, fallback) => B[key]?.[field] ?? fallback;
  const yMM = (key, fallback) => bGet(key, "y", fallback) * PX2MM_Y;
  const fsMM = (key, fallback) => bGet(key, "fontSize", fallback);
  const bAlign = (key, fallback) => bGet(key, "align", fallback);
  const bBold = (key, fallback) => bGet(key, "bold", fallback);
  const bColor = (key, fallback) => { const c = bGet(key, "color", null); return c ? hexToRgb(c) : fallback; };

  const floatImgs = tpl.floatImages || [];
  floatImgs.filter(fi => fi.behindText).forEach(fi => {
    try { doc.addImage(fi.src, "AUTO", fi.x * PX2MM_X, fi.y * PX2MM_Y, fi.width * PX2MM_X, fi.height * PX2MM_Y); } catch(e) {}
  });

  const alignMap = (a) => a === "left" ? "left" : a === "right" ? "right" : "center";
  const alignX = (a) => a === "left" ? 10 : a === "right" ? W - 10 : W / 2;

  // Header
  {
    const fs = fsMM("clinicHeader", 14), al = bAlign("clinicHeader", "center"), bd = bBold("clinicHeader", true), col = bColor("clinicHeader", navy);
    doc.setFont("times", bd ? "bold" : "normal"); doc.setFontSize(fs); doc.setTextColor(...col);
    doc.text(clinicName, alignX(al), yMM("clinicHeader", 10), { align: alignMap(al) });
  }

  {
    const fs = fsMM("deptLabel", 10), al = bAlign("deptLabel", "center"), bd = bBold("deptLabel", false), col = bColor("deptLabel", grey);
    doc.setFont("times", bd ? "bold" : "normal"); doc.setFontSize(fs); doc.setTextColor(...col);
    doc.text(deptName, alignX(al), yMM("deptLabel", 50), { align: alignMap(al) });
  }

  if (showAddress && address) {
    const fs = fsMM("addressLine", 9), al = bAlign("addressLine", "center"), col = bColor("addressLine", grey);
    doc.setFont("times", "normal"); doc.setFontSize(fs); doc.setTextColor(...col);
    doc.text(address, alignX(al), yMM("addressLine", 64), { align: alignMap(al) });
  }

  if (showPhone && phone) {
    const fs = fsMM("phoneLine", 9), al = bAlign("phoneLine", "center"), col = bColor("phoneLine", grey);
    doc.setFont("times", "normal"); doc.setFontSize(fs); doc.setTextColor(...col);
    doc.text("Tel: " + phone, alignX(al), yMM("phoneLine", 76), { align: alignMap(al) });
  }

  // Title
  {
    const fs = fsMM("reportTitle", 13), al = bAlign("reportTitle", "center"), bd = bBold("reportTitle", true);
    const col = bColor("reportTitle", null) || tplColor || SECTION_COLORS[result.section || ""] || navy;
    doc.setFont("times", bd ? "bold" : "normal"); doc.setFontSize(fs); doc.setTextColor(...col);
    doc.text(reportTitle, alignX(al), yMM("reportTitle", 100), { align: alignMap(al) });
  }

  const divY = yMM("reportTitle", 100) + 3;
  doc.setDrawColor(0,0,0); doc.setLineWidth(0.6); doc.line(8, divY, W - 8, divY);

  // Patient Info
  const piY = yMM("patientInfo", 130);
  const piFS = fsMM("patientInfo", 10);
  doc.setFont("times", "normal"); doc.setFontSize(piFS);
  const dob = patient?.dob ? new Date(patient.dob).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—";
  const meta = [
    ["Patient Name:", patient?.name || "—", "Date & Time:", dateTime],
    ["Age / Sex:", (calcAge(patient?.dob) || "—") + " / " + (patient?.gender || "—"), "Ward:", result.ward || "—"],
    ["Date of Birth:", dob, "Physician:", result.physician || "—"],
  ];
  let my = piY;
  meta.forEach(row => {
    doc.setFont("times", "normal"); doc.setTextColor(...grey); doc.text(row[0], 10, my);
    doc.setFont("times", "bold"); doc.setTextColor(...black); doc.text(row[1], 44, my);
    if (row[2]) { doc.setFont("times", "normal"); doc.setTextColor(...grey); doc.text(row[2], W / 2 + 4, my); }
    if (row[3]) { doc.setFont("times", "bold"); doc.setTextColor(...black); doc.text(row[3], W / 2 + 40, my); }
    my += piFS * 0.42;
  });
  doc.setDrawColor(180,180,180); doc.setLineWidth(0.3); doc.line(8, my, W - 8, my);

  const SIG_Y = yMM("signatures", 520);
  if (hospitalInfo?.showLogoInPDF && hospitalInfo?.logoUri) {
    try {
      const ls = 75;
      const centerY = my + ((SIG_Y - my) / 2);
      doc.saveGraphicsState();
      doc.setGState(new doc.GState({ opacity: 0.08 }));
      doc.addImage(hospitalInfo.logoUri, "", (W - ls) / 2, centerY - (ls / 2), ls, ls, "", "FAST");
      doc.restoreGraphicsState();
    } catch(e) {}
  }

  // Results Tables
  let y = yMM("resultsTable", 220);
  const tblFS = fsMM("resultsTable", 9);
  const sc = tplColor || SECTION_COLORS[result.section || ""] || [0,0,0];
  const isUrinalysis = (result.section || "").toLowerCase() === "urinalysis";
  const isFecalysis = (result.section || "").toLowerCase() === "fecalysis";

  if (isFecalysis) {
    const macroKeys = ["color", "consistency"];
    const microKeys = ["pus cells", "red cells", "fat globules", "flagellates", "others"];
    const macroRows = result.lines.filter(l => macroKeys.some(k => l.testName.toLowerCase().includes(k)));
    const microRows = result.lines.filter(l => microKeys.some(k => l.testName.toLowerCase().includes(k)));
    const caught = new Set([...macroRows, ...microRows].map(l => l.testName));
    const paraRows = result.lines.filter(l => !caught.has(l.testName));
    const colW = (W - 22) / 2;
    const leftX = 8, rightX = W / 2 + 3;
    let lY = y, rY = y;
    const fStyle = { font: "times", fontSize: tblFS, cellPadding: 1.2, textColor: black, fillColor: false };
    const dpc = (d) => { if (d.section === "head") d.cell.styles.halign = d.column.index === 0 ? "left" : "center"; };

    if (macroRows.length > 0) {
      doc.setFont("times", "bold"); doc.setFontSize(tblFS - 2); doc.setTextColor(...black); doc.text("MACROSCOPIC", leftX, lY); lY += 2.5;
      doc.autoTable({ startY: lY, head: [["Test", "Result"]], body: macroRows.map(l => [l.testName, l.value || ""]),
        margin: { left:
