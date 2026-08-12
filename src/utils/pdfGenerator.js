import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { fmtDate, calcAge } from "./helpers.jsx";
import { getTemplate, SECTION_COLORS } from "../constants/data.js";

export async function generateResultPDFDataUri(result, patient, hospitalInfo, staff = []) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "legal" });
  const W = 215.9;
  const H = 355.6;

  const HALF = 177.8;
  const PX2MM_Y = HALF / 412;
  const PX2MM_X = W / 500;

  const secId = (result?.section || "").toLowerCase();
  const tpl = getTemplate(secId) || {};
  const B = tpl.blocks || {};

  const bGet = (key, field, fallback) => B[key]?.[field] ?? fallback;
  const yMM = (key, fallback) => bGet(key, "y", fallback) * PX2MM_Y;
  const fsMM = (key, fallback) => bGet(key, "fontSize", fallback);

  const hexToRgb = (hex) => {
    if (!hex || hex[0] !== "#") return [15, 45, 82];
    return [
      parseInt(hex.slice(1, 3), 16),
      parseInt(hex.slice(3, 5), 16),
      parseInt(hex.slice(5, 7), 16),
    ];
  };

  const headerColor = tpl.sectionColor ? hexToRgb(tpl.sectionColor) : (SECTION_COLORS[secId] || [15, 45, 82]);
  const grey = [71, 85, 105];
  const black = [15, 30, 45];

  const clinicName = tpl.clinicName || hospitalInfo?.name || "CLINICAL LABORATORY";
  const deptName = tpl.deptName || "Laboratory Department";
  const address = tpl.address || hospitalInfo?.address || "";
  const phone = tpl.phone || hospitalInfo?.phone || "";
  const reportTitle = tpl.reportTitle || ((result?.sectionLabel || result?.section || "").toUpperCase() + " REPORT");

  const dateTime = result?.date && result?.time
    ? `${fmtDate(result.date)}, ${result.time}`
    : result?.date
    ? fmtDate(result.date)
    : "—";

  // FAIL-SAFE: Use embedded patient name directly from result record if patient object is absent
  const displayName = result?.patientName || patient?.name || "—";
  const displayMrn = result?.patientMrn || patient?.mrn || patient?.pid || "—";

  // 1. Floating Images (Behind Text)
  const floatImgs = tpl.floatImages || [];
  floatImgs.filter(fi => fi.behindText).forEach(fi => {
    try {
      doc.addImage(fi.src, "AUTO", fi.x * PX2MM_X, fi.y * PX2MM_Y, fi.width * PX2MM_X, fi.height * PX2MM_Y);
    } catch (e) {}
  });

  // 2. Facility Header
  const yHeader = yMM("clinicHeader", 10);
  doc.setFont("times", bGet("clinicHeader", "bold", true) ? "bold" : "normal");
  doc.setFontSize(fsMM("clinicHeader", 14));
  doc.setTextColor(...headerColor);
  doc.text(clinicName, W / 2, yHeader, { align: "center" });

  // 3. Subtitle
  const yDept = yMM("deptLabel", 50);
  doc.setFont("times", "normal");
  doc.setFontSize(fsMM("deptLabel", 10));
  doc.setTextColor(...grey);
  doc.text(deptName, W / 2, yDept, { align: "center" });

  // 4. Address & Phone
  if (tpl.showAddress !== false && address) {
    doc.setFontSize(fsMM("addressLine", 9));
    doc.text(address, W / 2, yMM("addressLine", 64), { align: "center" });
  }

  if (tpl.showPhone !== false && phone) {
    doc.setFontSize(fsMM("phoneLine", 9));
    doc.text("Tel: " + phone, W / 2, yMM("phoneLine", 76), { align: "center" });
  }

  // 5. Report Title
  const yTitle = yMM("reportTitle", 100);
  doc.setFont("times", "bold");
  doc.setFontSize(fsMM("reportTitle", 13));
  doc.setTextColor(...headerColor);
  doc.text(reportTitle, W / 2, yTitle, { align: "center" });

  doc.setDrawColor(...headerColor);
  doc.setLineWidth(0.6);
  doc.line(8, yTitle + 3, W - 8, yTitle + 3);

  // 6. Patient Demographics Block
  const yMeta = yMM("patientInfo", 130);
  const piFS = fsMM("patientInfo", 10);
  doc.setFont("times", "normal");
  doc.setFontSize(piFS);

  const dobStr = patient?.dob ? fmtDate(patient.dob) : "—";
  const ageStr = patient?.age ? patient.age : (calcAge(patient?.dob) || "—");
  const ageSexStr = `${ageStr} / ${patient?.gender || "—"}`;

  const metaLeft = [
    ["Patient Name:", displayName],
    ["Age / Sex:", ageSexStr],
    ["Date of Birth:", dobStr],
  ];

  const metaRight = [
    ["Date & Time:", dateTime],
    ["Ward / Room:", result?.ward || "OP"],
    ["Physician:", result?.physician || "—"],
  ];

  let my = yMeta;
  metaLeft.forEach((row, idx) => {
    doc.setFont("times", "normal"); doc.setTextColor(...grey); doc.text(row[0], 10, my);
    doc.setFont("times", "bold"); doc.setTextColor(...black); doc.text(row[1], 44, my);
    if (metaRight[idx]) {
      doc.setFont("times", "normal"); doc.setTextColor(...grey); doc.text(metaRight[idx][0], W / 2 + 4, my);
      doc.setFont("times", "bold"); doc.setTextColor(...black); doc.text(metaRight[idx][1], W / 2 + 40, my);
    }
    my += piFS * 0.42;
  });

  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.3);
  doc.line(8, my, W - 8, my);

  // 7. Watermark Logo
  const SIG_Y = yMM("signatures", 520);
  if (hospitalInfo?.showLogoInPDF && hospitalInfo?.logoUri) {
    try {
      const ls = 75;
      const centerY = my + ((SIG_Y - my) / 2);
      doc.saveGraphicsState();
      doc.setGState(new doc.GState({ opacity: 0.08 }));
      doc.addImage(hospitalInfo.logoUri, "", (W - ls) / 2, centerY - (ls / 2), ls, ls, "", "FAST");
      doc.restoreGraphicsState();
    } catch (e) {}
  }

  // 8. Results Rendering Engine
  const yTable = yMM("resultsTable", 220);
  const tblFS = fsMM("resultsTable", 9);
  const tblRowSpacing = bGet("resultsTable", "rowSpacing", 1.6);
  const isUrinalysis = secId === "urinalysis";
  const isFecalysis = secId === "fecalysis";
  const isBloodTyping = secId === "bloodtyping";

  let lastTableFinalY = yTable;

  if (isFecalysis) {
    const macroKeys = ["color", "consistency"];
    const microKeys = ["pus cells", "red cells", "fat globules", "flagellates", "others"];
    const lines = result?.lines || [];
    const macroRows = lines.filter(l => macroKeys.some(k => l.testName.toLowerCase().includes(k)));
    const microRows = lines.filter(l => microKeys.some(k => l.testName.toLowerCase().includes(k)));
    const caught = new Set([...macroRows, ...microRows].map(l => l.testName));
    const paraRows = lines.filter(l => !caught.has(l.testName));
    
    const colW = (W - 22) / 2;
    const leftX = 8, rightX = W / 2 + 3;
    let lY = yTable, rY = yTable;
    const fStyle = { font: "times", fontSize: tblFS, cellPadding: 1.2, textColor: black, fillColor: false };
    const dpc = (d) => { if (d.section === "head") d.cell.styles.halign = d.column.index === 0 ? "left" : "center"; };

    if (macroRows.length > 0) {
      doc.setFont("times", "bold"); doc.setFontSize(tblFS - 1); doc.setTextColor(...black); doc.text("MACROSCOPIC", leftX, lY); lY += 2.5;
      autoTable(doc, {
        startY: lY, head: [["Test Parameter", "Result"]], body: macroRows.map(l => [l.testName, l.value || ""]),
        margin: { left: leftX, right: W - leftX - colW }, tableWidth: colW, pageBreak: "avoid",
        styles: fStyle, headStyles: { fillColor: headerColor, textColor: [255, 255, 255], fontStyle: "bold", fontSize: tblFS - 1 },
        columnStyles: { 0: { cellWidth: colW * 0.55, halign: "left" }, 1: { cellWidth: colW * 0.45, halign: "center", fontStyle: "bold" } },
        didParseCell: dpc, alternateRowStyles: { fillColor: false }
      });
      lY = doc.lastAutoTable.finalY + 2.5;
    }
    if (microRows.length > 0) {
      doc.setFont("times", "bold"); doc.setFontSize(tblFS - 1); doc.setTextColor(...black); doc.text("MICROSCOPIC", leftX, lY); lY += 2.5;
      autoTable(doc, {
        startY: lY, head: [["Test Parameter", "Result", "Unit"]], body: microRows.map(l => [l.testName, l.value || "", l.unit || ""]),
        margin: { left: leftX, right: W - leftX - colW }, tableWidth: colW, pageBreak: "avoid",
        styles: fStyle, headStyles: { fillColor: headerColor, textColor: [255, 255, 255], fontStyle: "bold", fontSize: tblFS - 1 },
        columnStyles: { 0: { cellWidth: colW * 0.54, halign: "left" }, 1: { cellWidth: colW * 0.28, halign: "center", fontStyle: "bold" }, 2: { cellWidth: colW * 0.18, halign: "center", textColor: grey } },
        didParseCell: dpc, alternateRowStyles: { fillColor: false }
      });
      lY = doc.lastAutoTable.finalY + 2.5;
    }
    if (paraRows.length > 0) {
      doc.setFont("times", "bold"); doc.setFontSize(tblFS - 1); doc.setTextColor(...black); doc.text("PARASITOLOGY", rightX, rY); rY += 2.5;
      autoTable(doc, {
        startY: rY, head: [["Test Parameter", "Result"]], body: paraRows.map(l => [l.testName, l.value || ""]),
        margin: { left: rightX, right: 10 }, tableWidth: colW, pageBreak: "avoid",
        styles: { ...fStyle, fontSize: tblFS }, headStyles: { fillColor: headerColor, textColor: [255, 255, 255], fontStyle: "bold", fontSize: tblFS - 1 },
        columnStyles: { 0: { cellWidth: colW * 0.38, halign: "left" }, 1: { cellWidth: colW * 0.62, fontStyle: "bold" } },
        didParseCell: dpc, alternateRowStyles: { fillColor: false }
      });
      rY = doc.lastAutoTable.finalY + 2.5;
    }
    lastTableFinalY = Math.max(lY, rY);
  } else if (isUrinalysis) {
    const physicalKeys = ["color", "transparency", "specific gravity", "ph"];
    const chemKeys = ["protein", "glucose", "ketone", "blood", "leukocyte", "bilirubin", "nitrite", "urobilinogen"];
    const lines = result?.lines || [];
    const physRows = lines.filter(l => physicalKeys.some(k => l.testName.toLowerCase().includes(k)));
    const chemRows = lines.filter(l => chemKeys.some(k => l.testName.toLowerCase().includes(k)));
    const caught = new Set([...physRows, ...chemRows].map(l => l.testName));
    const microRows = lines.filter(l => !caught.has(l.testName));

    const colW = (W - 22) / 2;
    const leftX = 8, rightX = W / 2 + 3;
    let lY = yTable, rY = yTable;
    const baseS = { font: "times", fontSize: tblFS, cellPadding: 1.1, textColor: black, fillColor: false };
    const hs = () => ({ fillColor: headerColor, textColor: [255, 255, 255], fontStyle: "bold", fontSize: tblFS - 0.5 });
    const dpc = (d) => { if (d.section === "head") d.cell.styles.halign = d.column.index === 0 ? "left" : "center"; };

    if (physRows.length > 0) {
      doc.setFont("times", "bold"); doc.setFontSize(tblFS); doc.setTextColor(...black); doc.text("I. PHYSICAL EXAMINATION", leftX, lY); lY += 2;
      autoTable(doc, {
        startY: lY, head: [["Test Parameter", "Result"]], body: physRows.map(l => [l.testName, l.value || ""]),
        margin: { left: leftX, right: W - leftX - colW }, tableWidth: colW, pageBreak: "avoid",
        styles: baseS, headStyles: hs(),
        columnStyles: { 0: { cellWidth: colW * 0.62, halign: "left" }, 1: { cellWidth: colW * 0.38, halign: "center", fontStyle: "bold" } },
        didParseCell: dpc, alternateRowStyles: { fillColor: false }
      });
      lY = doc.lastAutoTable.finalY + 2;
    }
    if (chemRows.length > 0) {
      doc.setFont("times", "bold"); doc.setFontSize(tblFS); doc.setTextColor(...black); doc.text("II. CHEMICAL EXAMINATION", leftX, lY); lY += 2;
      autoTable(doc, {
        startY: lY, head: [["Test Parameter", "Result"]], body: chemRows.map(l => [l.testName, l.value || ""]),
        margin: { left: leftX, right: W - leftX - colW }, tableWidth: colW, pageBreak: "avoid",
        styles: baseS, headStyles: hs(),
        columnStyles: { 0: { cellWidth: colW * 0.62, halign: "left" }, 1: { cellWidth: colW * 0.38, halign: "center", fontStyle: "bold" } },
        didParseCell: dpc, alternateRowStyles: { fillColor: false }
      });
      lY = doc.lastAutoTable.finalY + 2;
    }
    if (microRows.length > 0) {
      doc.setFont("times", "bold"); doc.setFontSize(tblFS); doc.setTextColor(...black); doc.text("III. MICROSCOPIC EXAMINATION", rightX, rY); rY += 2;
      autoTable(doc, {
        startY: rY, head: [["Test Parameter", "Result", "Unit"]],
        body: microRows.map(l => [l.testName, l.value || "", l.testName.toLowerCase().includes("epithelial") ? "" : l.unit || ""]),
        margin: { left: rightX, right: 8 }, tableWidth: colW, pageBreak: "avoid",
        styles: { ...baseS, overflow: "linebreak" }, headStyles: hs(),
        columnStyles: { 0: { cellWidth: colW * 0.40, halign: "left" }, 1: { cellWidth: colW * 0.44, halign: "center", fontStyle: "bold" }, 2: { cellWidth: colW * 0.16, halign: "center", textColor: grey } },
        didParseCell(data) {
          if (data.section === "head") data.cell.styles.halign = data.column.index === 0 ? "left" : "center";
        },
        alternateRowStyles: { fillColor: false }
      });
      rY = doc.lastAutoTable.finalY + 2;
    }
    lastTableFinalY = Math.max(lY, rY);
  } else if (isBloodTyping) {
    const lines = result?.lines || [];
    const aboLine = lines.find(l => (l.testId || "").toLowerCase() === "abo" || (l.testName || "").toLowerCase().includes("abo"));
    const rhLine = lines.find(l => (l.testId || "").toLowerCase() === "rh" || (l.testName || "").toLowerCase().includes("rh"));
    const crossLine = lines.find(l => (l.testId || "").toLowerCase() === "crossmatch" || (l.testName || "").toLowerCase().includes("cross"));
    
    const aboVal = aboLine?.value || "";
    const rhVal = rhLine?.value || "";
    const rhSymbol = rhVal.toUpperCase() === "POSITIVE" ? "+" : rhVal.toUpperCase() === "NEGATIVE" ? "−" : rhVal;
    const combined = aboVal + (rhSymbol ? " " + rhSymbol : "");

    const btY = yTable + 8;
    doc.setFont("times", "bold"); doc.setFontSize(26); doc.setTextColor(...headerColor);
    doc.text("Blood Type: " + combined, W / 2, btY, { align: "center" });
    
    let btYY = btY + 10;
    doc.setFont("times", "normal"); doc.setFontSize(tblFS + 1); doc.setTextColor(...grey);
    doc.text(`ABO Group: ${aboVal}         Rh Factor: ${rhVal}`, W / 2, btYY, { align: "center" });
    
    btYY += 6;
    if (crossLine) {
      doc.setFont("times", "normal"); doc.setFontSize(tblFS + 1); doc.setTextColor(...black);
      doc.text("Cross Match: " + (crossLine.value || ""), W / 2, btYY, { align: "center" });
      btYY += 6;
    }
    lastTableFinalY = btYY;
  } else {
    const lines = result?.lines || [];
    const hasGroups = lines.some(l => l.groupName);
    const headCols = ["TEST PARAMETER", "RESULT VALUE", "UNIT", "REFERENCE RANGE", "FLAG"];

    const bodyRows = [];
    const groupRowIndices = new Set();
    let lastGroup = "";

    lines.forEach((l) => {
      if (hasGroups && l.groupName && l.groupName !== lastGroup) {
        groupRowIndices.add(bodyRows.length);
        bodyRows.push([l.groupName, "", "", "", ""]);
        lastGroup = l.groupName;
      }
      bodyRows.push([
        l.testName + (l.showBrand && l.brand ? ` (${l.brand})` : ""),
        l.value || "",
        l.unit || "",
        l.normalRange || "",
        l.flag || "",
      ]);
    });

    autoTable(doc, {
      startY: yTable,
      head: [headCols],
      body: bodyRows,
      margin: { left: 8, right: 8 },
      pageBreak: "avoid",
      styles: { font: "times", fontSize: tblFS + 0.5, cellPadding: tblRowSpacing, textColor: black, fillColor: false },
      headStyles: { fillColor: headerColor, textColor: [255, 255, 255], fontStyle: "bold", fontSize: tblFS },
      columnStyles: {
        0: { cellWidth: 65, halign: "left" },
        1: { cellWidth: 45, halign: "center", fontStyle: "bold" },
        2: { cellWidth: 25, halign: "center", textColor: grey },
        3: { cellWidth: 45, halign: "center" },
        4: { cellWidth: 15, halign: "center", fontStyle: "bold" },
      },
      didParseCell(data) {
        if (data.section === "head" && data.column.index === 0) data.cell.styles.halign = "left";
        if (data.section === "body" && groupRowIndices.has(data.row.index)) {
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.fontSize = tblFS;
          data.cell.styles.textColor = headerColor;
          data.cell.styles.fillColor = false;
          if (data.column.index === 0) data.cell.colSpan = headCols.length;
        }
        if (data.section === "body" && (data.column.index === 1 || data.column.index === 4) && !groupRowIndices.has(data.row.index)) {
          const val = bodyRows[data.row.index]?.[4];
          if (val === "HI") data.cell.styles.textColor = [192, 57, 43];
          else if (val === "LO") data.cell.styles.textColor = [26, 111, 181];
        }
      },
      alternateRowStyles: { fillColor: false },
    });
    lastTableFinalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : yTable + 30;
  }

  // Remarks
  if (result?.remarks || result?.remark) {
    const remarkText = result.remarks || result.remark;
    const remarkY = Math.min(lastTableFinalY + 4, SIG_Y - 14);
    doc.setFont("times", "bold"); doc.setFontSize(8); doc.setTextColor(...black);
    doc.text("REMARKS / CLINICAL IMPRESSION:", 10, remarkY);
    doc.setFont("times", "italic"); doc.setFontSize(8); doc.setTextColor(...grey);
    const remarkLines = doc.splitTextToSize(remarkText, W - 40);
    doc.text(remarkLines, 60, remarkY);
  }

  // 9. Signatures Block
  const sigFS = fsMM("signatures", 8);
  const staffArr = Array.isArray(staff) ? staff : [];
  const getEsig = (name) => staffArr.find((s) => s && s.name === name)?.eSignature || null;
  const ESIG_W = 40, ESIG_H = 14;

  const tplSigs = tpl.signatures;
  if (tplSigs && tplSigs.length > 0) {
    tplSigs.forEach((sig, i) => {
      const x = tplSigs.length === 1 ? W * 0.5 : tplSigs.length === 2 ? (i === 0 ? W * 0.28 : W * 0.72) : (i === 0 ? W * 0.22 : i === 1 ? W * 0.5 : W * 0.78);
      const name = result[sig.field] || "";
      const lic = result[sig.field + "Lic"] || "";
      
      const esigSrc = getEsig(name);
      if (esigSrc && name) {
        try { doc.addImage(esigSrc, "AUTO", x - ESIG_W / 2, SIG_Y - ESIG_H * 0.6, ESIG_W, ESIG_H); } catch (e) {}
      }

      doc.setDrawColor(...black); doc.setLineWidth(0.4); doc.line(x - 28, SIG_Y, x + 28, SIG_Y);
      doc.setFont("times", "bold"); doc.setFontSize(sigFS); doc.setTextColor(...headerColor);
      doc.text(name || "________________________", x, SIG_Y + 3, { align: "center" });
      if (sig.showLic && lic) {
        doc.setFont("times", "normal"); doc.setFontSize(sigFS - 1); doc.setTextColor(...grey);
        doc.text("Lic. No. " + lic, x, SIG_Y + 6, { align: "center" });
      }
      doc.setFont("times", "normal"); doc.setFontSize(sigFS - 1); doc.setTextColor(...grey);
      doc.text(sig.role.toUpperCase(), x, (sig.showLic && lic) ? SIG_Y + 9 : SIG_Y + 6.5, { align: "center" });
    });
  } else {
    const positions = [W * 0.22, W * 0.5, W * 0.78];
    const names = [result.medtech || "", result.validatedBy || "", result.pathologist || ""];
    const roles = ["MEDICAL TECHNOLOGIST", "QUALITY CONTROL / VALIDATOR", "PATHOLOGIST"];

    positions.forEach((x, i) => {
      const name = names[i];
      const esigSrc = getEsig(name);
      if (esigSrc && name) {
        try { doc.addImage(esigSrc, "AUTO", x - ESIG_W / 2, SIG_Y - ESIG_H * 0.6, ESIG_W, ESIG_H); } catch (e) {}
      }

      doc.setDrawColor(...black); doc.setLineWidth(0.4); doc.line(x - 24, SIG_Y, x + 24, SIG_Y);
      doc.setFont("times", "bold"); doc.setFontSize(sigFS); doc.setTextColor(...headerColor);
      doc.text(name || "________________________", x, SIG_Y + 3, { align: "center" });
      doc.setFont("times", "normal"); doc.setFontSize(sigFS - 1); doc.setTextColor(...grey);
      doc.text(roles[i], x, SIG_Y + 6.5, { align: "center" });
    });
  }

  // 10. Floating Images (In Front) & Texts
  floatImgs.filter(fi => !fi.behindText).forEach(fi => {
    try {
      doc.addImage(fi.src, "AUTO", fi.x * PX2MM_X, fi.y * PX2MM_Y, fi.width * PX2MM_X, fi.height * PX2MM_Y);
    } catch (e) {}
  });

  (tpl.floatTexts || []).forEach(ft => {
    doc.setFont("times", ft.bold ? "bold" : "normal");
    doc.setFontSize(ft.fontSize || 10);
    const ftc = ft.color ? hexToRgb(ft.color) : black;
    doc.setTextColor(...ftc);
    doc.text(ft.text || "", ft.x * PX2MM_X, ft.y * PX2MM_Y);
  });

  const safeName = (displayName || "Patient").replace(/[^a-zA-Z0-9]/g, "_");
  const filename = `${safeName}_${secId || "report"}_${result?.date || "result"}.pdf`;

  const pdfArrayBuffer = doc.output("arraybuffer");
  const pdfBlob = new Blob([pdfArrayBuffer], { type: "application/pdf" });
  const pdfBlobUrl = URL.createObjectURL(pdfBlob);

  return {
    dataUri: doc.output("datauristring"),
    pdfBlobUrl,
    filename,
    doc,
  };
}

export async function downloadResultAsPDF(result, patient, hospitalInfo, silent = false, staff = []) {
  try {
    const { dataUri, filename, doc } = await generateResultPDFDataUri(result, patient, hospitalInfo, staff);

    if (window.electronAPI && window.electronAPI.savePDF) {
      const base64 = dataUri.split(",")[1];
      const res = await window.electronAPI.savePDF(filename, base64);

      if (res && res.success && res.filePath) {
        if (silent) {
          await window.electronAPI.silentPrintPDF(res.filePath);
        } else {
          await window.electronAPI.printPDF(res.filePath, filename);
        }
      }
    } else {
      doc.save(filename);
    }

    return true;
  } catch (err) {
    console.error("Error generating PDF report:", err);
    throw err;
  }
}
