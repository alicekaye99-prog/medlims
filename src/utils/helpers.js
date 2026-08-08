import React from "react";

export const uid = () => Math.random().toString(36).slice(2, 9);

export const toInputDate = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const calcAge = (dob) => {
  if (!dob) return "—";
  const now = new Date();
  const b = new Date(dob);
  if (isNaN(b.getTime())) return dob || "—";

  let y = now.getFullYear() - b.getFullYear();
  let m = now.getMonth() - b.getMonth();
  if (now.getDate() < b.getDate()) m--;
  if (m < 0) { y--; m += 12; }

  if (y >= 1) return y + "y";
  if (m >= 1) return m + "mo";

  const diffDays = Math.floor((now - b) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "0d";
  return diffDays + "d";
};

export const fmtDate = (d) => {
  try {
    if (!d) return "—";
    const parts = String(d).split("-");
    if (parts.length === 3) {
      const dt = new Date(parts[0], parts[1] - 1, parts[2]);
      return dt.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    }
    return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return d || "—";
  }
};

export const getFlag = (t, val) => {
  if (val === null || val === undefined || val === "") return "";
  const valStr = String(val).trim();
  const cleanStr = valStr.replace(/^[<>=~\s]+/, "");
  const n = parseFloat(cleanStr);
  if (isNaN(n)) return "";

  const mn = parseFloat(t.normalMin);
  const mx = parseFloat(t.normalMax);
  const hasMin = t.normalMin !== undefined && t.normalMin !== "" && !isNaN(mn);
  const hasMax = t.normalMax !== undefined && t.normalMax !== "" && !isNaN(mx);

  if (valStr.startsWith(">")) {
    if (hasMax && n >= mx) return "HI";
  }
  if (valStr.startsWith("<")) {
    if (hasMin && n <= mn) return "LO";
  }

  if (hasMin && n < mn) return "LO";
  if (hasMax && n > mx) return "HI";
  return "";
};

const CHUNK_SIZE = 500;

export function dbLoad(key, fb) {
  try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : fb; } catch { return fb; }
}

export function dbSave(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

export function dbLoadChunked(baseKey, fb) {
  try {
    const meta = localStorage.getItem(baseKey + "__meta");
    if (!meta) return dbLoad(baseKey, fb);
    const { chunks } = JSON.parse(meta);
    let all = [];
    for (let i = 0; i < chunks; i++) {
      const part = localStorage.getItem(baseKey + "__c" + i);
      if (part) all = all.concat(JSON.parse(part));
    }
    return all.length ? all : fb;
  } catch { return dbLoad(baseKey, fb); }
}

let saveTimeouts = {};
export function dbSaveChunked(baseKey, arr) {
  if (saveTimeouts[baseKey]) clearTimeout(saveTimeouts[baseKey]);
  saveTimeouts[baseKey] = setTimeout(() => {
    try {
      const oldMeta = localStorage.getItem(baseKey + "__meta");
      if (oldMeta) {
        const { chunks } = JSON.parse(oldMeta);
        for (let i = 0; i < chunks; i++) localStorage.removeItem(baseKey + "__c" + i);
      }
      const chunks = Math.ceil(arr.length / CHUNK_SIZE) || 1;
      for (let i = 0; i < chunks; i++) {
        localStorage.setItem(baseKey + "__c" + i, JSON.stringify(arr.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE)));
      }
      localStorage.setItem(baseKey + "__meta", JSON.stringify({ chunks, total: arr.length, savedAt: Date.now() }));
      if (arr.length <= 200) localStorage.setItem(baseKey, JSON.stringify(arr));
      else localStorage.removeItem(baseKey);
    } catch (e) { console.error("dbSaveChunked error", e); }
  }, 150);
}

/* ─── ENTERPRISE 2026 HEALTHCARE COLOR SYSTEM ─── */
export const C = {
  bg: "#F5F7FA",
  card: "#FFFFFF",
  border: "#E6ECF3",
  primary: "#0F2D52",       // Enterprise Deep Navy
  accent: "#2563EB",        // Medical Blue Accent
  accentLight: "#EFF6FF",
  accentMid: "#BFDBFE",
  success: "#16A34A",
  successLight: "#F0FDF4",
  warning: "#F59E0B",
  warningLight: "#FEF3C7",
  danger: "#DC2626",
  dangerLight: "#FEF2F2",
  text: "#0F1E2D",
  muted: "#475569",
  faint: "#94A3B8",
  sidebarBg: "#0F2D52",
  sidebarText: "#94A3B8",
  sidebarActive: "#1E3A8A",
  surface: "#F8FAFC",
};

export const inp = (extra = {}) => ({
  height: 36, padding: "0 12px", border: `1px solid ${C.border}`, borderRadius: 8,
  fontSize: 13, color: C.text, background: "#fff", outline: "none", fontFamily: "'Inter', system-ui, sans-serif",
  boxSizing: "border-box", transition: "all .15s ease-in-out", ...extra
});

export const Btn = (variant = "primary", extra = {}) => {
  const base = {
    height: 36, padding: "0 16px", borderRadius: 8, border: "none", cursor: "pointer",
    fontSize: 13, fontWeight: 600, fontFamily: "'Inter', system-ui, sans-serif", display: "inline-flex", alignItems: "center",
    gap: 6, transition: "all .15s ease-in-out", letterSpacing: ".01em", boxSizing: "border-box", ...extra
  };
  if (variant === "primary") return { ...base, background: C.primary, color: "#fff", boxShadow: "0 1px 2px rgba(15,45,82,0.12)" };
  if (variant === "accent")  return { ...base, background: C.accent, color: "#fff", boxShadow: "0 1px 3px rgba(37,99,235,0.25)" };
  if (variant === "ghost")   return { ...base, background: "#fff", color: C.muted, border: `1px solid ${C.border}` };
  if (variant === "danger")  return { ...base, background: C.dangerLight, color: C.danger, border: `1px solid #FECACA` };
  if (variant === "success") return { ...base, background: C.success, color: "#fff" };
  return base;
};

export const Card = ({ children, style = {} }) => (
  <div style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.border}`,
    boxShadow: "0 1px 3px rgba(15,45,82,0.04)", boxSizing: "border-box", ...style }}>
    {children}
  </div>
);

export const CardHead = ({ title, sub, right, icon }) => (
  <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex",
    justifyContent: "space-between", alignItems: "center", background: C.card, borderRadius: "14px 14px 0 0" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {icon && <span style={{ display: "flex", alignItems: "center", color: C.accent }}>{icon}</span>}
      <div>
        <div style={{ fontWeight: 700, fontSize: 14, color: C.text, letterSpacing: "-.01em" }}>{title}</div>
        {sub && <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
    {right && <div>{right}</div>}
  </div>
);

export const Label = ({ children }) => (
  <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 6, letterSpacing: ".04em", textTransform: "uppercase" }}>{children}</div>
);

export const Field = ({ label, children, style = {} }) => (
  <div style={{ display: "flex", flexDirection: "column", minWidth: 0, ...style }}>
    <Label>{label}</Label>
    {children}
  </div>
);
