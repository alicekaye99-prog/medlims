import React, { useState } from "react";
import { C, Btn, inp, Field, Card } from "../../utils/helpers.jsx";
import { Icon } from "../common/Icons.jsx";

export function LoginPage({ accounts = [], onLogin, hospital = {} }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [shaking, setShaking] = useState(false);

  const triggerShake = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      triggerShake();
      return;
    }

    const user = accounts.find(
      (a) => a.username.toLowerCase() === username.trim().toLowerCase() && a.password === password
    );

    if (user) {
      setError("");
      onLogin(user);
    } else {
      setError("Invalid username or password. Please try again.");
      triggerShake();
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: C.primary, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Inter', system-ui, sans-serif", position: "relative" }}>
      <Card style={{ width: "100%", maxWidth: 420, padding: 32, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.3)", transform: shaking ? "translateX(-6px)" : "none", transition: "transform 0.1s ease" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          {/* Custom B-Cross Logo Display */}
          <div style={{ width: 68, height: 68, borderRadius: 16, background: "#ffffff", border: `1px solid ${C.border}`, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: 6, marginBottom: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <img src={hospital.logoUri || "/icons/icon.png"} alt="MedLIMS Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: "0 0 4px 0" }}>{hospital.name || "MedLIMS"}</h2>
          <p style={{ fontSize: 12, color: C.muted, margin: 0, textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600 }}>
            Clinical Information System
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Field label="Username">
            <input type="text" value={username} onChange={(e) => { setUsername(e.target.value); setError(""); }} placeholder="Enter username" style={inp({ width: "100%", fontWeight: 600 })} required autoFocus />
          </Field>

          <Field label="Password">
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="Enter password"
                style={inp({ width: "100%", paddingRight: 36 })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 14, color: C.muted }}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </Field>

          {error && (
            <div style={{ padding: "8px 12px", background: C.dangerLight, color: C.danger, borderRadius: 6, fontSize: 12, fontWeight: 500 }}>
              {error}
            </div>
          )}

          <button type="submit" style={Btn("accent", { width: "100%", height: 42, justifyContent: "center", fontSize: 14, marginTop: 4 })}>
            Sign In
          </button>
        </form>

        <div style={{ marginTop: 24, paddingTop: 16, borderTop: `1px solid ${C.border}`, textAlign: "center", fontSize: 11, color: C.faint }}>
          Default Admin Credentials: <strong>admin</strong> / <strong>admin123</strong>
        </div>
      </Card>
    </div>
  );
}
