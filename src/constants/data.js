/* ─── CONSTANTS, LICENSE KEYS & DEFAULT DATA ─── */

export const SK_STORE = "medlims_license";
export const LIC_SECRET = import.meta.env.VITE_LIC_SECRET || "MedLIMS_$ecr3t_2026_xK9mP!";
export const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID || "18pzQW6JNoqXVnXXRmmFSWF3bw2RBC9LSJM2XFM4OZVo";
export const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL || "https://script.google.com/macros/s/AKfycbx9F4YkLm_NwKegCLDlvWNj8zjJpY29gfgNdsDqzqrT3h-gK03ilKFMWOAPH3Lx7ZpfVQ/exec";

// SHA-256 via Web Crypto API
export async function sha256(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

// Stable device fingerprint
export async function getDeviceId() {
  const nav = window.navigator;
  const raw = [
    nav.userAgent,
    nav.language,
    nav.hardwareConcurrency,
    nav.deviceMemory || "",
    screen.width,
    screen.height,
    screen.colorDepth,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  ].join("|");
  return sha256(raw);
}

// Master Key Map
export const KEY_MAP = {
  "ac7b116caecc665df483dea3ddacbda2cb5c5f3b86a7571d6d2d6cac66699642": { type: "demo", days: 3 },
  "07e38ce7ab8a55f95ea874d798545c5334da19f3ca5c2ff3489e02e2773775aa": { type: "lifetime", days: -1 },
  "0fb0e57a1f1b2f161eb3a473b68c1f939cb3c84de091a46a0305f5ee784e027d": { type: "monthly", days: 30 }
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

export const LOGO_URI = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%230F2D52'/><path d='M50 22v56M22 50h56' stroke='%23ffffff' stroke-width='12' stroke-linecap='round'/></svg>";

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
  hematology: [
    {
      group: "Complete Blood Count",
      tests: [
        { id: "hgb", name: "Hemoglobin", unit: "g/dL", normalMin: 12, normalMax: 17, normalText: "12 – 17" },
        { id: "hct", name: "Hematocrit", unit: "%", normalMin: 37, normalMax: 51, normalText: "37 – 51" },
        { id: "rbc", name: "RBC Count", unit: "x10⁶/µL", normalMin: 4.2, normalMax: 5.4, normalText: "4.2 – 5.4" },
        { id: "wbc", name: "WBC Count", unit: "x10³/µL", normalMin: 5, normalMax: 10, normalText: "5 – 10" },
        { id: "plt", name: "Platelet Count", unit: "x10³/µL", normalMin: 150, normalMax: 400, normalText: "150 – 400" },
        { id: "mcv", name: "MCV", unit: "fL", normalMin: 80, normalMax: 100, normalText: "80 – 100" },
        { id: "mch", name: "MCH", unit: "pg", normalMin: 27, normalMax: 33, normalText: "27 – 33" },
        { id: "mchc", name: "MCHC", unit: "g/dL", normalMin: 32, normalMax: 36, normalText: "32 – 36" }
      ]
    },
    {
      group: "Differential Count",
      tests: [
        { id: "seg", name: "Segmenters", unit: "%", normalMin: 50, normalMax: 70, normalText: "50 – 70" },
        { id: "lym", name: "Lymphocytes", unit: "%", normalMin: 20, normalMax: 40, normalText: "20 – 40" },
        { id: "mono", name: "Monocytes", unit: "%", normalMin: 2, normalMax: 8, normalText: "2 – 8" },
        { id: "eos", name: "Eosinophils", unit: "%", normalMin: 1, normalMax: 4, normalText: "1 – 4" },
        { id: "baso", name: "Basophils", unit: "%", normalMin: 0, normalMax: 1, normalText: "0 – 1" }
      ]
    },
    {
      group: "ESR / Bleeding",
      tests: [
        { id: "esr", name: "ESR", unit: "mm/hr", normalMin: 0, normalMax: 20, normalText: "0 – 20" },
        { id: "bt", name: "Bleeding Time", unit: "min", normalMin: 1, normalMax: 3, normalText: "1 – 3" },
        { id: "ct", name: "Clotting Time", unit: "min", normalMin: 5, normalMax: 11, normalText: "5 – 11" }
      ]
    }
  ],
  bloodchem: [
    {
      group: "Blood Sugar",
      tests: [
        { id: "fbs", name: "Fasting Blood Sugar", unit: "mg/dL", normalMin: 70, normalMax: 105, normalText: "70 – 105" },
        { id: "ppbs", name: "2 hrs. PPBS", unit: "mg/dL", normalMax: 200, normalText: "< 200" },
        { id: "rbs", name: "Random Blood Sugar", unit: "mg/dL", normalMax: 200, normalText: "< 200" }
      ]
    },
    {
      group: "Cardiac / Lipid Panel",
      tests: [
        { id: "tchol", name: "Total Cholesterol", unit: "mg/dL", normalMax: 200, normalText: "< 200" },
        { id: "trig", name: "Triglycerides", unit: "mg/dL", normalMax: 150, normalText: "< 150" },
        { id: "hdl", name: "HDL Cholesterol", unit: "mg/dL", normalMin: 36, normalMax: 60, normalText: "36 – 60" },
        { id: "ldl", name: "LDL Cholesterol", unit: "mg/dL", normalMax: 150, normalText: "< 150" }
      ]
    },
    {
      group: "Kidney Function",
      tests: [
        { id: "bun", name: "BUN", unit: "mg/dL", normalMin: 15, normalMax: 39, normalText: "15 – 39" },
        { id: "creat", name: "Creatinine", unit: "mg/dL", normalMin: 0.4, normalMax: 1.4, normalText: "0.4 – 1.4" },
        { id: "uric", name: "Uric Acid", unit: "mg/dL", normalMin: 2.6, normalMax: 7.2, normalText: "2.6 – 7.2" }
      ]
    },
    {
      group: "Liver Function",
      tests: [
        { id: "sgpt", name: "SGPT / ALT", unit: "IU/L", normalMin: 0, normalMax: 41, normalText: "0 – 41" },
        { id: "sgot", name: "SGOT / AST", unit: "IU/L", normalMin: 0, normalMax: 40, normalText: "0 – 40" },
        { id: "tbili", name: "Total Bilirubin", unit: "mg/dL", normalMin: 0.1, normalMax: 1.2, normalText: "0.1 – 1.2" }
      ]
    },
    {
      group: "Electrolytes",
      tests: [
        { id: "sodium", name: "Sodium", unit: "mmol/L", normalMin: 135, normalMax: 145, normalText: "135 – 145" },
        { id: "potassium", name: "Potassium", unit: "mmol/L", normalMin: 3.5, normalMax: 5.5, normalText: "3.5 – 5.5" }
      ]
    },
    {
      group: "Other Tests",
      tests: [
        { id: "hba1c", name: "Glycated Hemoglobin (HbA1c)", unit: "%", normalMin: 3.5, normalMax: 6.0, normalText: "3.5 – 6.0" }
      ]
    }
  ],
  urinalysis: [
    {
      group: "Physical Examination",
      tests: [
        { id: "ucolor", name: "Color", unit: "", normalText: "Yellow", inputType: "dropdown", options: ["STRAW", "LIGHT YELLOW", "YELLOW", "DARK YELLOW", "COLORLESS", "AMBER", "ORANGE", "RED"], showUnit: false, showNormal: false, showFlag: false },
        { id: "utransp", name: "Transparency", unit: "", normalText: "Clear", inputType: "dropdown", options: ["CLEAR", "SLIGHTLY HAZY", "HAZY", "CLOUDY", "TURBID", "MILKY"], showUnit: false, showNormal: false, showFlag: false },
        { id: "usp", name: "Specific Gravity", unit: "", normalMin: 1.005, normalMax: 1.030, normalText: "1.005 – 1.030", showUnit: false, showNormal: false, showFlag: false },
        { id: "uph", name: "pH", unit: "", normalText: "4.6 – 8.0", inputType: "dropdown", options: ["5.0", "6.0", "6.50", "7.0", "7.50", "8.0", "9.0"], showUnit: false, showNormal: false, showFlag: false }
      ]
    },
    {
      group: "Chemical Examination",
      tests: [
        { id: "uprot", name: "Protein", unit: "", normalText: "Negative", inputType: "dropdown", options: ["Negative", "+", "++", "+++", "++++", "Trace"], showUnit: false, showNormal: false, showFlag: false },
        { id: "ugluc", name: "Glucose", unit: "", normalText: "Negative", inputType: "dropdown", options: ["Negative", "+", "++", "+++", "++++", "Trace"], showUnit: false, showNormal: false, showFlag: false },
        { id: "uketo", name: "Ketone", unit: "", normalText: "Negative", inputType: "dropdown", options: ["Negative", "+", "++", "+++", "++++", "Trace"], showUnit: false, showNormal: false, showFlag: false },
        { id: "ubld", name: "Blood", unit: "", normalText: "Negative", inputType: "dropdown", options: ["Negative", "+", "++", "+++", "++++", "Trace"], showUnit: false, showNormal: false, showFlag: false },
        { id: "uleuk", name: "Leukocytes", unit: "", normalText: "Negative", inputType: "dropdown", options: ["Negative", "+", "++", "+++", "++++", "Trace"], showUnit: false, showNormal: false, showFlag: false },
        { id: "ubili", name: "Bilirubin", unit: "", normalText: "Negative", inputType: "dropdown", options: ["Negative", "+", "++", "+++", "++++", "Trace"], showUnit: false, showNormal: false, showFlag: false },
        { id: "unitrite", name: "Nitrite", unit: "", normalText: "Negative", inputType: "dropdown", options: ["Negative", "+", "++", "+++", "++++", "Trace"], showUnit: false, showNormal: false, showFlag: false },
        { id: "uurobili", name: "Urobilinogen", unit: "", normalText: "Negative", inputType: "dropdown", options: ["Negative", "+", "++", "+++", "++++", "Trace"], showUnit: false, showNormal: false, showFlag: false },
        { id: "uothers_chem", name: "Others", unit: "", normalText: "", showUnit: false, showNormal: false, showFlag: false }
      ]
    },
    {
      group: "Microscopic Examination",
      tests: [
        { id: "uwbc", name: "Pus Cells", unit: "/hpf", normalText: "0 – 5", showUnit: true, showNormal: false, showFlag: false },
        { id: "urbc", name: "Red Cells", unit: "/hpf", normalText: "0 – 3", showUnit: true, showNormal: false, showFlag: false },
        { id: "uep", name: "Epithelial Cells", unit: "/lpf", normalText: "Few", inputType: "dropdown", options: ["FEW", "RARE", "MODERATE", "OCCASSIONAL", "ABUNDANT", "NONE"], showUnit: true, showNormal: false, showFlag: false },
        { id: "ubact", name: "Bacteria", unit: "", normalText: "None", inputType: "dropdown", options: ["FEW", "RARE", "MODERATE", "OCCASSIONAL", "ABUNDANT", "NONE"], showUnit: false, showNormal: false, showFlag: false },
        { id: "umucus", name: "Mucus Thread", unit: "", normalText: "None", inputType: "dropdown", options: ["FEW", "RARE", "MODERATE", "OCCASSIONAL", "ABUNDANT", "NONE"], showUnit: false, showNormal: false, showFlag: false },
        { id: "ucryst", name: "Crystals", unit: "", normalText: "None", inputType: "dropdown", options: ["AMORPHOUS - FEW", "AMORPHOUS - RARE", "AMORPHOUS - MODERATE", "AMORPHOUS - OCCASSIONAL", "AMORPHOUS - ABUNDANT", "URIC ACID - FEW", "URIC ACID - RARE", "URIC ACID - MODERATE", "URIC ACID - OCCASSIONAL", "URIC ACID - ABUNDANT", "CALCIUM OX - FEW", "CALCIUM OX - RARE", "CALCIUM OX - MODERATE", "CALCIUM OX - OCCASSIONAL", "CALCIUM OX - ABUNDANT", "TRIPLE PHOS - FEW", "TRIPLE PHOS - RARE", "TRIPLE PHOS - MODERATE", "TRIPLE PHOS - OCCASSIONAL", "TRIPLE PHOS - ABUNDANT", "CALCIUM CARB - FEW", "CALCIUM CARB - RARE", "CALCIUM CARB - MODERATE", "CALCIUM CARB - OCCASSIONAL", "CALCIUM CARB - ABUNDANT", "NONE"], showUnit: false, showNormal: false, showFlag: false },
        { id: "ucasts", name: "Casts", unit: "/lpf", normalText: "None", inputType: "dropdown", options: ["Coarse Granular", "Fine Granular", "WBC", "RBC", "HYALINE", "WAXY", "NONE"], showUnit: true, showNormal: false, showFlag: false, showCount: true },
        { id: "uothers", name: "Others", unit: "", normalText: "None", showUnit: false, showNormal: false, showFlag: false }
      ]
    }
  ],
  serology: [
    {
      group: "Hepatitis Markers",
      tests: [
        { id: "hbsag", name: "HBsAg", unit: "", normalText: "Non-reactive", inputType: "dropdown", options: ["NON-REACTIVE", "REACTIVE"] }
      ]
    },
    {
      group: "Infectious Disease",
      tests: [
        { id: "typhigm", name: "Typhidot IgM", unit: "", normalText: "Negative", inputType: "dropdown", options: ["Positive", "Negative"], showBrand: true, brands: ["CTK", "INTEC"] },
        { id: "typhigg", name: "Typhidot IgG", unit: "", normalText: "Negative", inputType: "dropdown", options: ["Negative", "Positive"] },
        { id: "vdrl", name: "VDRL / RPR", unit: "", normalText: "Non-reactive", inputType: "dropdown", options: ["NON-REACTIVE", "REACTIVE"] },
        { id: "hiv", name: "HIV 1 & 2", unit: "", normalText: "Non-reactive", inputType: "dropdown", options: ["NON-REACTIVE", "REACTIVE"] },
        { id: "dengue", name: "Dengue NS1", unit: "", normalText: "Negative", inputType: "dropdown", options: ["Negative", "Positive"] }
      ]
    },
    {
      group: "Pregnancy / Hormones",
      tests: [
        { id: "preg", name: "Pregnancy Test (hCG)", unit: "", normalText: "Negative", inputType: "dropdown", options: ["Negative", "Positive"], showBrand: true, brands: ["CTK", "Partners", "Sure-Guard", "ADVAN"] },
        { id: "tsh", name: "TSH", unit: "mIU/L", normalMin: 0.4, normalMax: 4.0, normalText: "0.4 – 4.0" },
        { id: "ft4", name: "Free T4", unit: "ng/dL", normalMin: 0.8, normalMax: 1.8, normalText: "0.8 – 1.8" }
      ]
    }
  ],
  bloodtyping: [
    {
      group: "Blood Typing",
      tests: [
        { id: "abo", name: "ABO Blood Type", unit: "", normalText: "A / B / AB / O", inputType: "dropdown", options: ["A", "B", "O", "AB"] },
        { id: "rh", name: "Rh Factor", unit: "", normalText: "Positive / Negative", inputType: "dropdown", options: ["POSITIVE", "NEGATIVE"] },
        { id: "crossmatch", name: "Cross Match", unit: "", normalText: "Compatible", inputType: "dropdown", options: ["Compatible", "Incompatible"] }
      ]
    }
  ],
  fecalysis: [
    {
      group: "Macroscopic",
      tests: [
        { id: "fcolor", name: "Color", unit: "", normalText: "Brown", inputType: "dropdown", options: ["YELLOW", "YELLOW BROWN", "BROWN", "GREEN", "YELLOW GREEN", "BLACK"], showUnit: false, showNormal: false, showFlag: false },
        { id: "fconsist", name: "Consistency", unit: "", normalText: "Formed", inputType: "dropdown", options: ["MUSHY", "SOFT", "FORMED", "SEMI-FORMED", "WATERY", "HARD", "MUCOID"], showUnit: false, showNormal: false, showFlag: false }
      ]
    },
    {
      group: "Microscopic",
      tests: [
        { id: "fpus", name: "Pus Cells", unit: "/hpf", normalText: "None", showUnit: true, showNormal: false, showFlag: false },
        { id: "frbc", name: "Red Cells", unit: "/hpf", normalText: "None", showUnit: true, showNormal: false, showFlag: false },
        { id: "ffat", name: "Fat Globules", unit: "", normalText: "None", inputType: "dropdown", options: ["FEW", "RARE", "MODERATE", "OCCASSIONAL", "ABUNDANT", "NONE"], showUnit: false, showNormal: false, showFlag: false }
      ]
    },
    {
      group: "Parasitology",
      tests: [
        { id: "fascaris", name: "Ascaris", unit: "", normalText: "No Ova of Parasite Seen", inputType: "dropdown", options: ["NO OVA OF PARASITE SEEN", "Seen"], showUnit: false, showNormal: false, showFlag: false },
        { id: "ftrich", name: "Trichuris", unit: "", normalText: "No Ova of Parasite Seen", inputType: "dropdown", options: ["NO OVA OF PARASITE SEEN", "Seen"], showUnit: false, showNormal: false, showFlag: false },
        { id: "fhook", name: "Hookworm", unit: "", normalText: "No Ova of Parasite Seen", inputType: "dropdown", options: ["NO OVA OF PARASITE SEEN", "Seen"], showUnit: false, showNormal: false, showFlag: false },
        { id: "famoeba", name: "Amoeba", unit: "", normalText: "None Seen", inputType: "dropdown", options: ["NONE SEEN", "Cyst Seen", "Trophozoites Seen"], showUnit: false, showNormal: false, showFlag: false },
        { id: "fflagel", name: "Flagellates", unit: "", normalText: "None", inputType: "dropdown", options: ["NONE", "Giardia lamblia", "Trichomonas hominis"], showUnit: false, showNormal: false, showFlag: false },
        { id: "fothers", name: "Others", unit: "", normalText: "None", showUnit: false, showNormal: false, showFlag: false }
      ]
    }
  ],
  microbiology: [
    {
      group: "KOH: Stool",
      tests: [
        { id: "koh_stool", name: "KOH", unit: "", normalText: "", inputType: "dropdown", options: ["POSITIVE FOR BUDDING YEAST CELLS", "POSITIVE FOR NONBUDDING YEAST CELLS", "POSITIVE FOR BUDDING YEAST CELLS WITH HYPHAE", "POSITIVE FOR BUDDING AND NONBUDDING YEAST CELLS", "POSITIVE FOR BUDDING AND NONBUDDING YEAST CELLS WITH HYPHAE", "NEGATIVE FOR FUNGAL ELEMENTS"], showUnit: false, showNormal: false, showFlag: false }
      ]
    }
  ],
  coagulation: [
    {
      group: "Coagulation Studies",
      tests: [
        { id: "pt", name: "Prothrombin Time (PT)", unit: "sec", normalMin: 11, normalMax: 14, normalText: "11 – 14" },
        { id: "aptt", name: "Activated Partial Thromboplastin Time (APTT)", unit: "sec", normalMin: 25, normalMax: 35, normalText: "25 – 35" }
      ]
    }
  ],
  othertests: [
    {
      group: "Other Tests",
      tests: [
        { id: "esr", name: "ESR", unit: "mm/hr", normalMin: 0, normalMax: 20, normalText: "0 – 20" }
      ]
    }
  ]
};

export const SECTION_COLORS = {
  hematology: [37, 99, 235],
  bloodchem: [37, 99, 235],
  urinalysis: [37, 99, 235],
  serology: [37, 99, 235],
  bloodtyping: [37, 99, 235],
  fecalysis: [37, 99, 235],
  microbiology: [37, 99, 235],
  coagulation: [37, 99, 235],
  othertests: [37, 99, 235]
};

export const PRESET_COLORS = [
  "#2563EB", "#0F2D52", "#1E40AF", "#1D4ED8", "#3B82F6", "#60A5FA",
  "#16A34A", "#059669", "#0D9488", "#0284C7", "#7C3AED", "#C0392B"
];

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
