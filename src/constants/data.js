/* ─── CONSTANTS, LICENSE KEYS & DEFAULT DATA ─── */

export const SK_STORE = "medlims_license";
export const LIC_SECRET = import.meta.env.VITE_LIC_SECRET || "MedLIMS_$ecr3t_2026_xK9mP!";
export const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID || "18pzQW6JNoqXVnXXRmmFSWF3bw2RBC9LSJM2XFM4OZVo";
export const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL || "https://script.google.com/macros/s/AKfycbx9F4YkLm_NwKegCLDlvWNj8zjJpY29gfgNdsDqzqrT3h-gK03ilKFMWOAPH3Lx7ZpfVQ/exec";

export async function sha256(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function getDeviceId() {
  const nav = window.navigator;
  const raw = [nav.userAgent, nav.language, nav.hardwareConcurrency, nav.deviceMemory || "", screen.width, screen.height, screen.colorDepth, Intl.DateTimeFormat().resolvedOptions().timeZone].join("|");
  return sha256(raw);
}

export const KEY_MAP = {
  "ac7b116caecc665df483dea3ddacbda2cb5c5f3b86a7571d6d2d6cac66699642": { type: "demo", days: 3 },
  "07e38ce7ab8a55f95ea874d798545c5334da19f3ca5c2ff3489e02e2773775aa": { type: "lifetime", days: -1 }
};

export async function signLicense(lic) {
  const payload = String(lic.keyHash || "") + String(lic.deviceId || "") + String(lic.activatedAt || "") + String(lic.expiresAt || "lifetime");
  const sig = await sha256(payload + LIC_SECRET);
  return { ...lic, sig };
}

export async function verifyLicenseSig(lic) {
  if (!lic || !lic.sig) return false;
  const payload = String(lic.keyHash || "") + String(lic.deviceId || "") + String(lic.activatedAt || "") + String(lic.expiresAt || "lifetime");
  const expected = await sha256(payload + LIC_SECRET);
  return lic.sig === expected;
}

export function loadLicense() {
  try { return JSON.parse(localStorage.getItem(SK_STORE) || "null"); } catch { return null; }
}

export function saveLicense(obj) {
  localStorage.setItem(SK_STORE, JSON.stringify(obj));
}

export function licenseStatus(lic) {
  if (!lic || !lic.sig) return "none";
  if (lic.type === "lifetime") return "valid";
  const now = Date.now();
  if (now > lic.expiresAt) return "expired";
  return "valid";
}

export const LOGO_URI = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%23C0392B'/><path d='M50 22v56M22 50h56' stroke='%23ffffff' stroke-width='12' stroke-linecap='round'/></svg>";

export const SECTIONS = [
  { id: "hematology", label: "Hematology", icon: "hematology", color: "#2563EB" },
  { id: "bloodchem", label: "Blood Chemistry", icon: "bloodchem", color: "#2563EB" },
  { id: "urinalysis", label: "Urinalysis", icon: "urinalysis", color: "#2563EB" },
  { id: "serology", label: "Immuno-Serology", icon: "serology", color: "#2563EB" },
  { id: "bloodtyping", label: "Blood Typing", icon: "bloodtyping", color: "#2563EB" },
  { id: "fecalysis", label: "Fecalysis", icon: "fecalysis", color: "#2563EB" },
  { id: "microbiology", label: "Microbiology", icon: "microbiology", color: "#2563EB" },
  { id: "coagulation", label: "Coagulation Studies", icon: "coagulation", color: "#2563EB" },
  { id: "othertests", label: "Other Tests", icon: "othertests", color: "#2563EB" }
];

export const DEFAULT_TESTS = {
  hematology: [{ group: "Complete Blood Count", tests: [{ id: "hgb", name: "Hemoglobin", unit: "g/dL", normalMin: 12, normalMax: 17, normalText: "12 – 17" }, { id: "hct", name: "Hematocrit", unit: "%", normalMin: 37, normalMax: 51, normalText: "37 – 51" }, { id: "rbc", name: "RBC Count", unit: "x10⁶/µL", normalMin: 4.2, normalMax: 5.4, normalText: "4.2 – 5.4" }, { id: "wbc", name: "WBC Count", unit: "x10³/µL", normalMin: 5, normalMax: 10, normalText: "5 – 10" }, { id: "plt", name: "Platelet Count", unit: "x10³/µL", normalMin: 150, normalMax: 400, normalText: "150 – 400" }] }],
  bloodchem: [{ group: "Blood Sugar", tests: [{ id: "fbs", name: "Fasting Blood Sugar", unit: "mg/dL", normalMin: 70, normalMax: 105, normalText: "70 – 105" }, { id: "rbs", name: "Random Blood Sugar", unit: "mg/dL", normalMax: 200, normalText: "< 200" }] }],
  urinalysis: [{ group: "Physical Examination", tests: [{ id: "ucolor", name: "Color", unit: "", normalText: "Yellow", inputType: "dropdown", options: ["STRAW","LIGHT YELLOW","YELLOW","DARK YELLOW","COLORLESS"] }, { id: "utransp", name: "Transparency", unit: "", normalText: "Clear", inputType: "dropdown", options: ["CLEAR","SLIGHTLY HAZY","HAZY","CLOUDY"] }] }, { group: "Chemical Examination", tests: [{ id: "uprot", name: "Protein", unit: "", normalText: "Negative", inputType: "dropdown", options: ["Negative","+","++","+++","++++"] }, { id: "ugluc", name: "Glucose", unit: "", normalText: "Negative", inputType: "dropdown", options: ["Negative","+","++","+++","++++"] }] }, { group: "Microscopic Examination", tests: [{ id: "uwbc", name: "Pus Cells", unit: "/hpf", normalText: "0 – 5" }, { id: "urbc", name: "Red Cells", unit: "/hpf", normalText: "0 – 3" }] }],
  serology: [{ group: "Infectious Disease", tests: [{ id: "hbsag", name: "HBsAg", unit: "", normalText: "Non-reactive", inputType: "dropdown", options: ["NON-REACTIVE","REACTIVE"] }] }],
  bloodtyping: [{ group: "Blood Typing", tests: [{ id: "abo", name: "ABO Blood Type", unit: "", normalText: "A / B / AB / O", inputType: "dropdown", options: ["A","B","O","AB"] }, { id: "rh", name: "Rh Factor", unit: "", normalText: "Positive / Negative", inputType: "dropdown", options: ["POSITIVE","NEGATIVE"] }] }],
  fecalysis: [{ group: "Microscopic", tests: [{ id: "fpus", name: "Pus Cells", unit: "/hpf", normalText: "None" }] }],
  microbiology: [{ group: "KOH", tests: [{ id: "koh_stool", name: "KOH", unit: "", normalText: "" }] }],
  coagulation: [{ group: "Coagulation Studies", tests: [{ id: "pt", name: "Prothrombin Time (PT)", unit: "sec", normalMin: 11, normalMax: 14, normalText: "11 – 14" }] }],
  othertests: [{ group: "Other Tests", tests: [{ id: "esr", name: "ESR", unit: "mm/hr", normalMin: 0, normalMax: 20, normalText: "0 – 20" }] }]
};

export const SECTION_COLORS = {
  hematology: [37, 99, 235], bloodchem: [37, 99, 235], urinalysis: [37, 99, 235], serology: [37, 99, 235], bloodtyping: [37, 99, 235], fecalysis: [37, 99, 235], microbiology: [37, 99, 235], coagulation: [37, 99, 235], othertests: [37, 99, 235]
};

export const PRESET_COLORS = ["#2563EB","#0F2D52","#1E40AF","#1D4ED8","#3B82F6","#60A5FA","#16A34A","#059669","#0D9488","#0284C7"];

export const DEFAULT_SIGS = {
  lab: [
    { role: "Performed By", field: "medtech", showLic: true },
    { role: "Validated By", field: "validatedBy", showLic: true },
    { role: "Pathologist", field: "pathologist", showLic: true }
  ]
};

export const defaultBlocks = (sLabel) => ({
  clinicHeader: { y: 10, fontSize: 14, color: "#000000", bold: true, align: "center" },
  deptLabel: { y: 50, fontSize: 10, color: "#555555", bold: false, align: "center" },
  addressLine: { y: 64, fontSize: 9, color: "#888888", bold: false, align: "center" },
  phoneLine: { y: 76, fontSize: 9, color: "#888888", bold: false, align: "center" },
  reportTitle: { y: 100, fontSize: 13, color: null, bold: true, align: "center", text: (sLabel || "").toUpperCase() + " REPORT" },
  patientInfo: { y: 130, fontSize: 10 },
  resultsTable: { y: 220, fontSize: 9, rowSpacing: 1.6 },
  signatures: { y: 520 }
});

export function dbLoad(key, fb) {
  try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : fb; } catch { return fb; }
}

export function dbSave(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

export let _templates = dbLoad("lims_templates", { lab: {} });

export const saveTemplates = (tpl) => {
  _templates = tpl;
  dbSave("lims_templates", tpl);
};

export const getTemplate = (sectionId) => {
  const deptTpl = _templates.lab || {};
  if (sectionId && deptTpl[sectionId]) return deptTpl[sectionId];
  if (deptTpl._master) return deptTpl._master;
  return null;
};
