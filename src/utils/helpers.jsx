import React from "react";

export const uid = () => Math.random().toString(36).slice(2, 9);

export const toInputDate = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const calcAge = (dob) => {
  if (!dob) return "—";
  let b = new Date(dob);
  if (isNaN(b.getTime())) {
    const parts = String(dob).split("/");
    if (parts.length === 3) {
      b = new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
    }
  }
  if (isNaN(b.getTime())) return String(dob) || "—";

  const now = new Date();
  let y = now.getFullYear() - b.getFullYear();
  let m = now.getMonth() - b.getMonth();
  let d = now.getDate() - b.getDate();

  if (d < 0) {
    m--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    d += prevMonth.getDate();
  }
  if (m < 0) {
    y--;
    m += 12;
  }

  if (y >= 1) return `${y}y`;
  if (m >= 1) return `${m}mo`;
  return `${Math.max(0, d)}d`;
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
    return String(d) || "—";
  }
};

export const getFlag = (t, val) => {
  if (val === null || val === undefined || val === "") return "";
  const valStr = String(val).trim();
  if (!t) return "";

  const match = valStr.match(/^([><]=?|~)?\s*(-?\d+(?:\.\d+)?)/);
  if (!match) return "";

  const op = match[1] || "";
  const n = parseFloat(match[2]);
  if (isNaN(n)) return "";

  const mn = parseFloat(t.normalMin);
  const mx = parseFloat(t.normalMax);
  const hasMin = t.normalMin !== undefined && t.normalMin !== "" && !isNaN(mn);
  const hasMax = t.normalMax !== undefined && t.normalMax !== "" && !isNaN(mx);

  if (op === ">" || op === ">=") {
    if (hasMax && n >= mx) return "HI";
    if (hasMin && n <= mn) return "HI";
  } else if (op === "<" || op === "<=") {
    if (hasMin && n <= mn) return "LO";
    if (hasMax && n <= mx) return "LO";
  }

  if (hasMin && n < mn) return "LO";
  if (hasMax && n > mx) return "HI";
  return "";
};

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

export function dbSaveChunked(baseKey, arr) {
  try {
    localStorage.setItem(baseKey, JSON.stringify(arr.slice(0, 100)));
  } catch (e) {}
}

export const C = {
  bg: "#f1f5f9",
  card: "#ffffff",
  border: "#e2e8f0",
  primary: "#0d213a",
  accent: "#2563eb",
  accentLight: "#eff6ff",
  accentMid: "#bfdbfe",
  success: "#16a34a",
  successLight: "#f0fdf4",
  warning: "#f59e0b",
  warningLight: "#fef3c7",
  danger: "#dc2626",
  dangerLight: "#fef2f2",
  text: "#0f172a",
  muted: "#64748b",
  faint: "#94a3b8",
  sidebarBg: "#0b1d33",
  sidebarText: "#94a3b8",
  sidebarActive: "#2563eb",
  surface: "#f8fafc",
};

export const inp = (extra = {}) => ({
  height: 34, padding: "0 10px", border: `1px solid ${C.border}`, borderRadius: 6,
  fontSize: 12.5, color: C.text, background: "#fff", outline: "none", fontFamily: "'Inter', system-ui, sans-serif",
  boxSizing: "border-box", transition: "border-color .15s, box-shadow .15s", ...extra
});

export const Btn = (variant = "primary", extra = {}) => {
  const base = {
    height: 34, padding: "0 16px", borderRadius: 6, border: "none", cursor: "pointer",
    fontSize: 12.5, fontWeight: 600, fontFamily: "'Inter', system-ui, sans-serif", display: "inline-flex", alignItems: "center",
    gap: 6, transition: "all .15s ease-in-out", letterSpacing: ".01em", boxSizing: "border-box", ...extra
  };
  if (variant === "primary") return { ...base, background: C.primary, color: "#fff", boxShadow: "0 1px 2px rgba(13,33,58,0.12)" };
  if (variant === "accent")  return { ...base, background: C.accent, color: "#fff", boxShadow: "0 1px 3px rgba(37,99,235,0.25)" };
  if (variant === "ghost")   return { ...base, background: "#fff", color: C.muted, border: `1px solid ${C.border}` };
  if (variant === "danger")  return { ...base, background: C.dangerLight, color: C.danger, border: `1px solid #fecaca` };
  if (variant === "success") return { ...base, background: C.success, color: "#fff" };
  return base;
};

export const Card = ({ children, style = {} }) => (
  <div style={{ background: C.card, borderRadius: 10, border: `1px solid ${C.border}`,
    boxShadow: "0 1px 3px rgba(15,23,42,0.05)", boxSizing: "border-box", ...style }}>
    {children}
  </div>
);

export const CardHead = ({ title, sub, right, icon }) => (
  <div style={{ padding: "12px 18px", borderBottom: `1px solid ${C.border}`, display: "flex",
    justifyContent: "space-between", alignItems: "center", background: "#fff", borderRadius: "10px 10px 0 0" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {icon && <span style={{ display: "flex", alignItems: "center", color: C.accent }}>{icon}</span>}
      <div>
        <div style={{ fontWeight: 700, fontSize: 13.5, color: C.text, letterSpacing: "-.01em" }}>{title}</div>
        {sub && <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
    {right && <div>{right}</div>}
  </div>
);

export const Label = ({ children }) => (
  <div style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, marginBottom: 4, letterSpacing: ".04em", textTransform: "uppercase" }}>{children}</div>
);

export const Field = ({ label, children, style = {} }) => (
  <div style={{ display: "flex", flexDirection: "column", minWidth: 0, ...style }}>
    <Label>{label}</Label>
    {children}
  </div>
);
