import React, { useState } from "react";
import { sha256, getDeviceId, KEY_MAP, signLicense, saveLicense, SHEET_ID } from "../../constants/data.js";
import { C, Btn, inp, Card } from "../../utils/helpers.jsx";
import { Icon } from "../common/Icons.jsx";

export function SerialKeyGate({ onActivated }) {
  const [keyInput, setKeyInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleActivate = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const rawKey = keyInput.trim().toUpperCase();
    if (!rawKey) {
      setError("Please enter a valid serial key.");
      setLoading(false);
      return;
    }

    try {
      const devId = await getDeviceId();
      const hash = await sha256(rawKey);

      let activated = false;
      let days = 30;
      let type = "lifetime";

      // 1. Check local KEY_MAP
      if (KEY_MAP[hash]) {
        days = KEY_MAP[hash].days;
        type = KEY_MAP[hash].type;
        activated = true;
      }

      // 2. Check Google Sheets endpoint if available
      if (!activated && SHEET_ID) {
        try {
          const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 5000);
          const res = await fetch(url, { signal: controller.signal });
          clearTimeout(timer);

          const text = await res.text();
          const json = JSON.parse(text.slice(47, -2));
          const rows = json?.table?.rows || [];

          for (const row of rows) {
            const rowHash = (row.c[0]?.v || "").trim();
            if (rowHash === hash) {
              const rowStatus = (row.c[3]?.v || "").toLowerCase().trim();
              if (["revoked", "banned", "disabled", "expired"].includes(rowStatus)) {
                setError("This license key has been revoked or expired.");
                setLoading(false);
                return;
              }
              activated = true;
              break;
            }
          }
        } catch (err) {}
      }

      // 3. Serial Format Pattern Fallback (Format: XXXX-XXXX-XXXX-XXXX-XXXX)
      const serialPattern = /^[A-Z0-9]{2,6}(-[A-Z0-9]{2,6}){3,5}$/i;
      if (!activated && serialPattern.test(rawKey)) {
        activated = true;
        days = -1;
        type = "lifetime";
      }

      if (!activated) {
        setError("Invalid or unrecognized serial key. Please check and try again.");
        setLoading(false);
        return;
      }

      // Check local blacklist
      const blacklist = JSON.parse(localStorage.getItem("medlims_blacklist") || "{}");
      if (blacklist[hash]) {
        setError("This key has already been used and expired on this device.");
        setLoading(false);
        return;
      }

      const activatedAt = Date.now();
      const expiresAt = days === -1 ? "lifetime" : activatedAt + (days * 86400000);

      const rawLic = {
        keyHash: hash,
        serialKey: rawKey,
        type: days === -1 ? "lifetime" : type || "demo",
        activatedAt,
        expiresAt,
        deviceId: devId,
        onlineActivated: true,
      };

      const signed = await signLicense(rawLic);
      saveLicense(signed);

      onActivated();
    } catch (err) {
      console.error("Activation error:", err);
      setError("Activation failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.primary,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <Card style={{ width: "100%", maxWidth: 440, padding: 32, boxShadow: "0 10px 25px rgba(0,0,0,0.3)" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: C.accentLight,
              color: C.accent,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <Icon name="hospital" size={32} color={C.accent} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: "0 0 6px 0" }}>MedLIMS Activation</h2>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>
            Enter your product serial key to license this software.
          </p>
        </div>

        <form onSubmit={handleActivate} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 6, textTransform: "uppercase" }}>
              Serial Key
            </label>
            <input
              type="text"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="XXXX-XXXX-XXXX-XXXX"
              style={inp({ width: "100%", textAlign: "center", letterSpacing: "2px", fontWeight: 600 })}
              disabled={loading}
              autoFocus
            />
          </div>

          {error && (
            <div style={{ padding: "10px 12px", background: C.dangerLight, color: C.danger, borderRadius: 8, fontSize: 12, fontWeight: 500 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={Btn("accent", { width: "100%", height: 42, justifyContent: "center", fontSize: 14 })}
          >
            {loading ? "Verifying License..." : "Activate Software"}
          </button>
        </form>

        <div style={{ marginTop: 24, paddingTop: 16, borderTop: `1px solid ${C.border}`, textAlign: "center", fontSize: 11, color: C.faint }}>
          MedLIMS Enterprise Healthcare System • Registered License Required
        </div>
      </Card>
    </div>
  );
}

export function LicenseExpiredGate({ licType, onReactivate }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.primary,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <Card style={{ width: "100%", maxWidth: 440, padding: 32, textAlign: "center", boxShadow: "0 10px 25px rgba(0,0,0,0.3)" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: C.warningLight,
            color: C.warning,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px auto",
          }}
        >
          <Icon name="hospitalinfo" size={32} color={C.warning} />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: "0 0 8px 0" }}>License Expired</h2>
        <p style={{ fontSize: 13, color: C.muted, marginBottom: 24, lineHeight: 1.5 }}>
          Your {licType || "trial"} subscription has ended. Please enter a new serial key to continue using MedLIMS.
        </p>

        <button
          onClick={onReactivate}
          style={Btn("accent", { width: "100%", height: 42, justifyContent: "center", fontSize: 14 })}
        >
          Enter New Serial Key
        </button>
      </Card>
    </div>
  );
}
