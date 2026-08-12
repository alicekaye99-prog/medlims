This file is a merged representation of a subset of the codebase, containing files not matching ignore patterns, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of a subset of the repository's contents that is considered the most important context.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching these patterns are excluded: node_modules/**, release/**, icons/**, package-lock.json, image.png, electron-builder-*.json
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
````
electron/
  main.js
  pdf-viewer.html
  preload.js
scripts/
  dummy-sign.js
src/
  components/
    common/
      Icons.jsx
      PDFPreviewModal.jsx
      SwitchProfileModal.jsx
    gates/
      SerialKeyGate.jsx
    views/
      AccountsView.jsx
      BarcodeView.jsx
      DashboardView.jsx
      HospitalView.jsx
      LabEntry.jsx
      LoginPage.jsx
      ParametersView.jsx
      PatientsView.jsx
      PersonnelView.jsx
      ReportsView.jsx
      SummaryView.jsx
      TemplatesView.jsx
      WelcomePage.jsx
  constants/
    data.js
  utils/
    helpers.js
    helpers.jsx
    pdfGenerator.js
  App.jsx
  main.jsx
.gitignore
HOW-TO-BUILD.md
index.html
package.json
SETUP-GUIDE.md
vite.config.js
````

# Files

## File: src/components/common/Icons.jsx
````javascript
import React from "react";

export function Icon({ name, size = 18, color = "currentColor", style = {} }) {
  const iconProps = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: { display: "inline-block", verticalAlign: "middle", ...style },
  };

  switch (name) {
    case "hospital":
      return (
        <svg {...iconProps}>
          <path d="M3 21h18" />
          <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
          <path d="M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4" />
          <path d="M10 9h4" />
          <path d="M12 7v4" />
        </svg>
      );

    case "switch":
      return (
        <svg {...iconProps}>
          <path d="m16 3 4 4-4 4" />
          <path d="M20 7H9" />
          <path d="m8 21-4-4 4-4" />
          <path d="M4 17h11" />
        </svg>
      );

    case "logout":
      return (
        <svg {...iconProps}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      );

    case "dashboard":
      return (
        <svg {...iconProps}>
          <rect x="3" y="3" width="7" height="9" rx="1" />
          <rect x="14" y="3" width="7" height="5" rx="1" />
          <rect x="14" y="12" width="7" height="9" rx="1" />
          <rect x="3" y="16" width="7" height="5" rx="1" />
        </svg>
      );

    case "patients":
      return (
        <svg {...iconProps}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );

    case "personnel":
      return (
        <svg {...iconProps}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <line x1="18" y1="8" x2="23" y2="8" />
          <line x1="18" y1="12" x2="23" y2="12" />
          <line x1="18" y1="16" x2="21" y2="16" />
        </svg>
      );

    case "parameters":
      return (
        <svg {...iconProps}>
          <line x1="4" y1="21" x2="4" y2="14" />
          <line x1="4" y1="10" x2="4" y2="3" />
          <line x1="12" y1="21" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12" y2="3" />
          <line x1="20" y1="21" x2="20" y2="16" />
          <line x1="20" y1="12" x2="20" y2="3" />
          <line x1="1" y1="14" x2="7" y2="14" />
          <line x1="9" y1="8" x2="15" y2="8" />
          <line x1="17" y1="16" x2="23" y2="16" />
        </svg>
      );

    case "templates":
      return (
        <svg {...iconProps}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
      );

    case "reports":
      return (
        <svg {...iconProps}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );

    case "summary":
      return (
        <svg {...iconProps}>
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      );

    case "barcode":
      return (
        <svg {...iconProps}>
          <path d="M3 5v14" />
          <path d="M8 5v14" />
          <path d="M12 5v14" />
          <path d="M17 5v14" />
          <path d="M21 5v14" />
        </svg>
      );

    case "hospitalinfo":
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      );

    case "accounts":
      return (
        <svg {...iconProps}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );

    case "search":
      return (
        <svg {...iconProps}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );

    case "check":
      return (
        <svg {...iconProps}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );

    case "userOutline":
      return (
        <svg {...iconProps}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );

    case "chevronUp":
      return (
        <svg {...iconProps}>
          <polyline points="18 15 12 9 6 15" />
        </svg>
      );

    case "chevronDown":
      return (
        <svg {...iconProps}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      );

    default:
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      );
  }
}
````

## File: src/components/common/PDFPreviewModal.jsx
````javascript
import React from "react";
import { C } from "../../utils/helpers.jsx";
import { Icon } from "./Icons.jsx";

export function PDFPreviewModal({ pdfDataUri, pdfBlobUrl, filename = "Report.pdf", onPrint, onClose }) {
  if (!pdfDataUri && !pdfBlobUrl) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(15, 23, 42, 0.8)",
        backdropFilter: "blur(4px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 920,
          height: "92vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: 14,
          overflow: "hidden",
          background: "#fff",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div
          style={{
            padding: "12px 20px",
            background: C.primary,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Icon name="reports" size={20} color="#fff" />
            <span style={{ fontWeight: 700, fontSize: 15 }}>MedLIMS — PDF Report Preview</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginLeft: 8 }}>{filename}</span>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {onPrint && (
              <button
                onClick={onPrint}
                style={{
                  height: 34,
                  padding: "0 18px",
                  borderRadius: 8,
                  background: C.accent,
                  color: "#fff",
                  border: "none",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Icon name="reports" size={16} color="#fff" />
                Print PDF
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "none",
                color: "#fff",
                width: 32,
                height: 32,
                borderRadius: "50%",
                cursor: "pointer",
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>
          </div>
        </div>

        <div style={{ flex: 1, position: "relative", overflow: "hidden", background: "#525659" }}>
          <iframe
            src={pdfBlobUrl || pdfDataUri}
            title="PDF Preview"
            style={{ width: "100%", height: "100%", border: "none", background: "#ffffff" }}
          />
        </div>
      </div>
    </div>
  );
}
````

## File: src/components/common/SwitchProfileModal.jsx
````javascript
import React, { useState } from "react";
import { C, Btn, inp, Card } from "../../utils/helpers.jsx";
import { Icon } from "./Icons.jsx";

export function SwitchProfileModal({ accounts = [], currentUser, onSwitch, onClose }) {
  const [selectedAcc, setSelectedAcc] = useState(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSwitch = (e) => {
    e.preventDefault();
    if (!selectedAcc) {
      setError("Please select an account to switch to.");
      return;
    }

    if (selectedAcc.id === currentUser?.id) {
      onClose();
      return;
    }

    if (selectedAcc.password && password !== selectedAcc.password) {
      setError("Incorrect password for selected account.");
      return;
    }

    onSwitch(selectedAcc);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 16,
      }}
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 460 }}>
        <Card style={{ overflow: "hidden", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)" }}>
          <div
            style={{
              padding: "18px 24px",
              background: C.primary,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Icon name="switch" size={20} color="#fff" />
              <span style={{ fontWeight: 700, fontSize: 15 }}>Switch User Account</span>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                color: "rgba(255,255,255,0.7)",
                cursor: "pointer",
                fontSize: 18,
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSwitch} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontSize: 12, color: C.muted }}>Select an active profile to switch sessions:</div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 220, overflowY: "auto", paddingRight: 4 }}>
              {accounts.map((acc) => {
                const isCurrent = acc.id === currentUser?.id;
                const isSelected = selectedAcc?.id === acc.id;

                return (
                  <div
                    key={acc.id}
                    onClick={() => {
                      setSelectedAcc(acc);
                      setPassword("");
                      setError("");
                    }}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 8,
                      border: `1.5px solid ${isSelected ? C.accent : isCurrent ? C.accentMid : C.border}`,
                      background: isSelected ? C.accentLight : isCurrent ? C.surface : "#fff",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "all .15s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: isSelected ? C.accent : C.primary,
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: 12,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {(acc.name || acc.username || "US").slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13, color: C.text }}>{acc.name || acc.username}</div>
                        <div style={{ fontSize: 11, color: C.muted }}>
                          {acc.role} • @{acc.username}
                        </div>
                      </div>
                    </div>

                    {isCurrent && (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 12,
                          background: C.accentMid,
                          color: C.primary,
                        }}
                      >
                        Active
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {selectedAcc && selectedAcc.id !== currentUser?.id && (
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 6, textTransform: "uppercase" }}>
                  Password for @{selectedAcc.username}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  style={inp({ width: "100%" })}
                  autoFocus
                />
              </div>
            )}

            {error && (
              <div style={{ padding: "8px 12px", background: C.dangerLight, color: C.danger, borderRadius: 6, fontSize: 12 }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
              <button type="button" onClick={onClose} style={Btn("ghost")}>
                Cancel
              </button>
              <button type="submit" style={Btn("accent")}>
                Switch Profile
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
````

## File: src/components/gates/SerialKeyGate.jsx
````javascript
import React, { useState } from "react";
import { sha256, getDeviceId, KEY_MAP, signLicense, saveLicense, WEBHOOK_URL } from "../../constants/data.js";
import { C, Btn, inp, Card } from "../../utils/helpers.jsx";
import { Icon } from "../common/Icons.jsx";

export function SerialKeyGate({ onActivated }) {
  const [keyInput, setKeyInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleActivate = async (e) => {
    e.preventDefault();
    const rawKey = keyInput.trim().toUpperCase();
    if (!rawKey) {
      setError("Please enter a valid serial key.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const devId = await getDeviceId();
      const hash = await sha256(rawKey);
      let activated = false;
      let days = 30;
      let type = "lifetime";

      if (KEY_MAP[hash]) {
        days = KEY_MAP[hash].days;
        type = KEY_MAP[hash].type;
        activated = true;
      }

      if (!activated && WEBHOOK_URL) {
        try {
          const getUrl = `${WEBHOOK_URL}?action=activate&serialKey=${encodeURIComponent(rawKey)}&key=${encodeURIComponent(rawKey)}&deviceId=${encodeURIComponent(devId)}`;
          const getRes = await fetch(getUrl, { method: "GET", redirect: "follow" });
          const data = await getRes.json();

          if (
            data &&
            (data.success === true ||
              data.valid === true ||
              data.status === "active" ||
              data.status === "success" ||
              data.result === "success")
          ) {
            activated = true;
            if (data.days !== undefined) days = parseInt(data.days) || 30;
            if (data.type) type = data.type;
          }
        } catch (err) {
          console.warn("Webhook GET attempt failed:", err);
        }

        if (!activated) {
          try {
            const postRes = await fetch(WEBHOOK_URL, {
              method: "POST",
              headers: { "Content-Type": "text/plain;charset=utf-8" },
              body: JSON.stringify({
                action: "activate",
                serialKey: rawKey,
                key: rawKey,
                deviceId: devId,
              }),
              redirect: "follow",
            });
            const data = await postRes.json();

            if (
              data &&
              (data.success === true ||
                data.valid === true ||
                data.status === "active" ||
                data.status === "success" ||
                data.result === "success")
            ) {
              activated = true;
              if (data.days !== undefined) days = parseInt(data.days) || 30;
              if (data.type) type = data.type;
            }
          } catch (err) {
            console.warn("Webhook POST attempt failed:", err);
          }
        }
      }

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

      const activatedAt = Date.now();
      const expiresAt = days === -1 ? "lifetime" : activatedAt + days * 86400000;

      const rawLic = {
        keyHash: hash,
        serialKey: rawKey,
        type: days === -1 ? "lifetime" : type || "demo",
        activatedAt,
        expiresAt,
        deviceId: devId,
      };

      const signed = await signLicense(rawLic);
      saveLicense(signed);

      onActivated();
    } catch (err) {
      console.error(err);
      setError("Activation error: " + err.message);
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
````

## File: src/components/views/AccountsView.jsx
````javascript
import React, { useState } from "react";
import { C, Btn, inp, Field, Card, CardHead, uid, toInputDate } from "../../utils/helpers.jsx";
import { Icon } from "../common/Icons.jsx";

export function AccountsView({ accounts = [], onSave }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAcc, setEditingAcc] = useState(null);

  const handleOpenAdd = () => {
    setEditingAcc(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (acc) => {
    setEditingAcc(acc);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (accounts.length <= 1) {
      alert("At least one admin user account must exist.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this user account?")) {
      onSave(accounts.filter((a) => a.id !== id));
    }
  };

  const handleSaveAccount = (accObj) => {
    if (editingAcc) {
      onSave(accounts.map((a) => (a.id === accObj.id ? accObj : a)));
    } else {
      onSave([...accounts, accObj]);
    }
    setModalOpen(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card style={{ padding: "16px 20px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="accounts" size={22} color={C.accent} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: C.text }}>System User Accounts</div>
            <div style={{ fontSize: 11.5, color: C.muted }}>Manage login credentials, roles, and access permissions</div>
          </div>
        </div>

        <button onClick={handleOpenAdd} style={Btn("accent", { height: 38 })}>
          ➕ Add User Account
        </button>
      </Card>

      <Card>
        <CardHead title={`User Accounts (${accounts.length})`} sub="Registered user profiles" icon={<Icon name="accounts" size={18} color={C.accent} />} />
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, textAlign: "left" }}>
            <thead>
              <tr style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, color: C.muted, fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
                <th style={{ padding: "12px 16px" }}>Full Name</th>
                <th style={{ padding: "12px 16px" }}>Username</th>
                <th style={{ padding: "12px 16px" }}>System Role</th>
                <th style={{ padding: "12px 16px" }}>Created Date</th>
                <th style={{ padding: "12px 16px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((a) => (
                <tr key={a.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "12px 16px", fontWeight: 600, color: C.text }}>{a.name || a.username}</td>
                  <td style={{ padding: "12px 16px", color: C.accent, fontWeight: 600 }}>@{a.username}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ padding: "2px 8px", borderRadius: 6, background: a.role === "Admin" ? C.accentLight : C.surface, color: a.role === "Admin" ? C.accent : C.muted, border: `1px solid ${C.border}`, fontSize: 11, fontWeight: 600 }}>
                      {a.role}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", color: C.muted }}>{a.createdAt || "—"}</td>
                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                      <button onClick={() => handleOpenEdit(a)} style={Btn("ghost", { height: 28, padding: "0 10px", fontSize: 11 })}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(a.id)} style={Btn("danger", { height: 28, padding: "0 10px", fontSize: 11 })}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {modalOpen && (
        <AccountFormModal
          account={editingAcc}
          onSave={handleSaveAccount}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}

function AccountFormModal({ account, onSave, onClose }) {
  const [name, setName] = useState(account ? account.name || "" : "");
  const [username, setUsername] = useState(account ? account.username || "" : "");
  const [password, setPassword] = useState(account ? account.password || "" : "");
  const [role, setRole] = useState(account ? account.role || "User" : "User");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      alert("Please enter username and password.");
      return;
    }

    onSave({
      id: account ? account.id : uid(),
      name: name.trim() || username.trim(),
      username: username.trim(),
      password: password.trim(),
      role,
      createdAt: account ? account.createdAt : toInputDate(),
    });
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 440 }}>
        <Card style={{ overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", background: C.primary, color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>{account ? "Edit User Account" : "Create User Account"}</span>
            <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#fff", fontSize: 18, cursor: "pointer" }}>✕</button>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
            <Field label="Full Name">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="User Full Name" style={inp({ width: "100%", fontWeight: 600 })} autoFocus />
            </Field>

            <Field label="Username *">
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" style={inp({ width: "100%" })} required />
            </Field>

            <Field label="Password *">
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" style={inp({ width: "100%" })} required />
            </Field>

            <Field label="Role Permission">
              <select value={role} onChange={(e) => setRole(e.target.value)} style={inp({ width: "100%" })}>
                <option value="User">User / Medical Technologist</option>
                <option value="Admin">Administrator</option>
              </select>
            </Field>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
              <button type="button" onClick={onClose} style={Btn("ghost")}>Cancel</button>
              <button type="submit" style={Btn("accent")}>{account ? "Update Account" : "Create User"}</button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
````

## File: src/components/views/BarcodeView.jsx
````javascript
import React, { useState, useEffect, useRef, useCallback } from "react";
import { C, Btn, inp, Field, Card, CardHead, calcAge } from "../../utils/helpers.jsx";
import { Icon } from "../common/Icons.jsx";

function genSerial() {
  const n = Math.floor(10000 + Math.random() * 90000);
  return "BC-" + n;
}

function bcLoad() {
  try { return JSON.parse(localStorage.getItem("lims_barcodes") || "{}"); } catch { return {}; }
}

function bcSave(data) {
  try { localStorage.setItem("lims_barcodes", JSON.stringify(data)); } catch {}
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

  const handleGenerate = useCallback(() => {
    if (!patientId) return alert("Please select a patient.");
    if (!addedSectionIds.length) return alert("Please add at least one lab section.");
    if (!totalSelectedTests) return alert("Please select at least one test.");

    const serial = genSerial();
    const store = bcLoad();
    const secData = {};

    addedSectionIds.forEach(sid => {
      const tids = Object.keys(selSections[sid] || {}).filter(k => selSections[sid][k]);
      if (tids.length > 0) secData[sid] = tids;
    });

    store[serial] = { patientId, sections: secData, createdAt: new Date().toISOString() };
    bcSave(store);

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

  const handleScan = () => {
    const raw = (scanInput || "").trim().toUpperCase();
    if (!raw) { setScanError("Please enter or scan a barcode serial."); return; }

    const store = bcLoad();
    const order = store[raw];
    if (!order) { setScanError(`Serial "${raw}" not found in local barcode register.`); return; }

    const p = patients.find(x => x.id === order.patientId);
    if (!p) { setScanError("Patient record not found."); return; }

    const secs = Object.keys(order.sections).map(sid => ({
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
                        {p.name} ({p.mrn || p.id.slice(0, 8)})
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
````

## File: src/components/views/DashboardView.jsx
````javascript
import React from "react";
import { C, Btn, Card, CardHead, fmtDate } from "../../utils/helpers.jsx";
import { Icon } from "../common/Icons.jsx";

export function DashboardView({ results = [], patients = [], sections = [], onNav, onPrint }) {
  const totalResults = results.length;
  const totalPatients = patients.length;
  const pendingPrint = results.filter((r) => !r.printed).length;

  const recentResults = [...results]
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, 8);

  const getPatientName = (patientId) => {
    const pt = patients.find((p) => p.id === patientId);
    return pt ? pt.name : "Unknown Patient";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <Card style={{ padding: "18px 20px", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: C.accentLight, color: C.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="reports" size={24} color={C.accent} />
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.text }}>{totalResults}</div>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>Total Test Results</div>
          </div>
        </Card>

        <Card style={{ padding: "18px 20px", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "#F0FDF4", color: C.success, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="patients" size={24} color={C.success} />
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.text }}>{totalPatients}</div>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>Registered Patients</div>
          </div>
        </Card>

        <Card style={{ padding: "18px 20px", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: C.warningLight, color: C.warning, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="summary" size={24} color={C.warning} />
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.text }}>{pendingPrint}</div>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>Unprinted Reports</div>
          </div>
        </Card>

        <Card style={{ padding: "18px 20px", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: C.surface, color: C.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="parameters" size={24} color={C.primary} />
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.text }}>{sections.length}</div>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>Active Lab Modules</div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHead title="Laboratory Entry Modules" sub="Select a section to enter new test results or manage entries" icon={<Icon name="dashboard" size={18} color={C.accent} />} />
        <div style={{ padding: 20, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
          {sections.map((sec) => (
            <div
              key={sec.id}
              onClick={() => onNav("lab:" + sec.id)}
              style={{
                padding: "16px 18px",
                borderRadius: 12,
                border: `1px solid ${C.border}`,
                background: "#fff",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                transition: "all .15s ease",
                boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = C.accent;
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(37, 99, 235, 0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.02)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={sec.icon || "reports"} size={20} color={C.accent} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: C.accent }}>Enter →</span>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: C.text }}>{sec.label}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
                  {results.filter((r) => r.section === sec.id).length} recorded
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHead
          title="Recent Laboratory Results"
          sub="Latest test records entered across all modules"
          icon={<Icon name="reports" size={18} color={C.accent} />}
          right={
            <button onClick={() => onNav("reports")} style={Btn("ghost", { fontSize: 12, height: 32 })}>
              View All Reports
            </button>
          }
        />
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, textAlign: "left" }}>
            <thead>
              <tr style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, color: C.muted, fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
                <th style={{ padding: "12px 16px" }}>Patient Name</th>
                <th style={{ padding: "12px 16px" }}>Section</th>
                <th style={{ padding: "12px 16px" }}>Date & Time</th>
                <th style={{ padding: "12px 16px" }}>Physician</th>
                <th style={{ padding: "12px 16px" }}>Status</th>
                <th style={{ padding: "12px 16px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentResults.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: 24, textAlign: "center", color: C.muted }}>
                    No lab results recorded yet. Select a module above to start entering results.
                  </td>
                </tr>
              ) : (
                recentResults.map((r) => (
                  <tr key={r.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "12px 16px", fontWeight: 600, color: C.text }}>
                      {getPatientName(r.patientId)}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ padding: "3px 8px", borderRadius: 6, background: C.accentLight, color: C.accent, fontSize: 11, fontWeight: 600 }}>
                        {r.sectionLabel || r.section}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", color: C.muted }}>
                      {fmtDate(r.date)} {r.time ? `(${r.time})` : ""}
                    </td>
                    <td style={{ padding: "12px 16px", color: C.muted }}>{r.physician || "—"}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ padding: "3px 8px", borderRadius: 12, fontSize: 10.5, fontWeight: 700, background: r.printed ? C.successLight : C.warningLight, color: r.printed ? C.success : C.warning }}>
                        {r.printed ? "PRINTED" : "PENDING"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "right" }}>
                      <button onClick={() => onPrint && onPrint(r)} style={Btn("ghost", { height: 28, padding: "0 10px", fontSize: 11 })}>
                        Print
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
````

## File: src/components/views/HospitalView.jsx
````javascript
import React, { useState, useEffect } from "react";
import { C, Btn, inp, Field, Card, CardHead } from "../../utils/helpers.jsx";
import { Icon } from "../common/Icons.jsx";

export function HospitalView({ data = {}, onSave }) {
  const [name, setName] = useState(data.name || "");
  const [address, setAddress] = useState(data.address || "");
  const [phone, setPhone] = useState(data.phone || "");
  const [email, setEmail] = useState(data.email || "");
  const [logoUri, setLogoUri] = useState(data.logoUri || "");
  const [showLogoInPDF, setShowLogoInPDF] = useState(data.showLogoInPDF ?? true);
  const [saved, setSaved] = useState(false);
  const [pdfFolder, setPdfFolder] = useState("");

  useEffect(() => {
    if (window.electronAPI && window.electronAPI.getPDFFolder) {
      window.electronAPI.getPDFFolder().then((folder) => {
        if (folder) setPdfFolder(folder);
      });
    }
  }, []);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setLogoUri(evt.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePickFolder = async () => {
    if (window.electronAPI && window.electronAPI.pickFolder) {
      const res = await window.electronAPI.pickFolder();
      if (!res.canceled && res.path) {
        await window.electronAPI.setPDFFolder(res.path);
        setPdfFolder(res.path);
      }
    }
  };

  const handleOpenFolder = () => {
    if (window.electronAPI && window.electronAPI.openFolder) {
      window.electronAPI.openFolder(pdfFolder);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...data,
      name: name.trim(),
      address: address.trim(),
      phone: phone.trim(),
      email: email.trim(),
      logoUri,
      showLogoInPDF,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 800, margin: "0 auto" }}>
      <Card style={{ padding: "16px 20px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="hospitalinfo" size={22} color={C.accent} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: C.text }}>Facility & Hospital Branding</div>
            <div style={{ fontSize: 11.5, color: C.muted }}>Configure facility details, report letterheads, logo, and PDF save folder</div>
          </div>
        </div>
      </Card>

      <Card>
        <CardHead title="Facility Demographics & Report Header" sub="This information appears at the top of generated test PDFs" icon={<Icon name="hospital" size={18} color={C.accent} />} />
        <form onSubmit={handleSubmit} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <Field label="Hospital / Facility Name *">
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. St. Jude General Hospital & Laboratory" style={inp({ width: "100%", fontWeight: 600, fontSize: 14 })} required />
          </Field>

          <Field label="Complete Facility Address">
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Building No., Street Name, City, Province" style={inp({ width: "100%" })} />
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Contact Phone / Landline">
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(02) 8123-4567 / 0917-123-4567" style={inp({ width: "100%" })} />
            </Field>

            <Field label="Official Email Address">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="lab@hospital.com" style={inp({ width: "100%" })} />
            </Field>
          </div>

          <div style={{ padding: 16, border: `1px solid ${C.border}`, borderRadius: 10, background: C.surface, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>Report Logo & Watermark</div>

            <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
              {logoUri ? (
                <img src={logoUri} alt="Facility Logo" style={{ width: 72, height: 72, objectFit: "contain", border: `1px solid ${C.border}`, borderRadius: 8, background: "#fff", padding: 4 }} />
              ) : (
                <div style={{ width: 72, height: 72, border: `2px dashed ${C.faint}`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted, fontSize: 11 }}>
                  No Logo
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <input type="file" accept="image/*" onChange={handleLogoUpload} id="logo-upload" style={{ display: "none" }} />
                <label htmlFor="logo-upload" style={Btn("ghost", { height: 32, cursor: "pointer", fontSize: 12 })}>
                  📁 Upload Logo Image
                </label>

                {logoUri && (
                  <button type="button" onClick={() => setLogoUri("")} style={Btn("danger", { height: 28, fontSize: 11 })}>
                    Remove Logo
                  </button>
                )}
              </div>
            </div>

            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: C.text, cursor: "pointer", marginTop: 4 }}>
              <input type="checkbox" checked={showLogoInPDF} onChange={(e) => setShowLogoInPDF(e.target.checked)} />
              Include logo background watermark on generated PDF reports
            </label>
          </div>

          <div style={{ padding: 16, border: `1px solid ${C.border}`, borderRadius: 10, background: C.surface, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>Saved PDF Folder Destination</div>
            <div style={{ fontSize: 11.5, color: C.muted }}>Current Folder: <strong>{pdfFolder || "Default App Data Directory"}</strong></div>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" onClick={handlePickFolder} style={Btn("ghost", { height: 32, fontSize: 12 })}>
                📂 Change Save Folder
              </button>
              <button type="button" onClick={handleOpenFolder} style={Btn("ghost", { height: 32, fontSize: 12 })}>
                ↗ Open Saved PDFs Folder
              </button>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
            {saved ? (
              <span style={{ color: C.success, fontWeight: 600, fontSize: 13 }}>✓ Facility settings saved successfully!</span>
            ) : (
              <div />
            )}

            <button type="submit" style={Btn("accent", { height: 40, padding: "0 24px" })}>
              💾 Save Branding Settings
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
````

## File: src/components/views/LabEntry.jsx
````javascript
import React, { useState, useEffect, useMemo, useRef } from "react";
import { C, Btn, inp, Field, Card, CardHead, uid, toInputDate, calcAge, fmtDate, getFlag } from "../../utils/helpers.jsx";
import { Icon } from "../common/Icons.jsx";
import { SECTIONS } from "../../constants/data.js";

export function LabEntry({
  section,
  secDef,
  tests = {},
  patients = [],
  staff = [],
  results = [],
  hospital,
  onSave,
  onPrint,
  onSwitchSection,
  preSelectedTests,
  prePatientId,
}) {
  const safeTests = tests || {};
  const secGroups = Array.isArray(safeTests[section]) ? safeTests[section] : [];
  const safePatients = Array.isArray(patients) ? patients : [];
  const safeStaff = Array.isArray(staff) ? staff : [];

  const [patientId, setPatientId] = useState(prePatientId || "");
  const [patientSearch, setPatientSearch] = useState("");
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const patientDropdownRef = useRef(null);

  const selectedPatient = safePatients.find((p) => p && p.id === patientId);

  const latest10Patients = useMemo(() => {
    return [...safePatients]
      .sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0))
      .slice(0, 10);
  }, [safePatients]);

  const filteredPatients = useMemo(() => {
    if (!patientSearch.trim()) return latest10Patients;
    const term = patientSearch.toLowerCase();
    return safePatients.filter(
      (p) =>
        p &&
        ((p.name || "").toLowerCase().includes(term) ||
          (p.mrn || "").toLowerCase().includes(term) ||
          (p.id || "").toLowerCase().includes(term))
    );
  }, [safePatients, latest10Patients, patientSearch]);

  const [physician, setPhysician] = useState("");
  const [pathologist, setPathologist] = useState("");
  const [medtech, setMedtech] = useState("");
  const [validatedBy, setValidatedBy] = useState("");
  const [remarks, setRemarks] = useState("");

  const [catalogSearch, setCatalogSearch] = useState("");
  const [expandedGroups, setExpandedGroups] = useState({ 0: true, 1: true, 2: true, 3: true, 4: true });

  const [testValues, setTestValues] = useState({});
  const [brands, setBrands] = useState({});
  const [countValues, setCountValues] = useState({});
  const [savedSuccessObj, setSavedSuccessObj] = useState(null);

  const isFormBasedSection = section === "fecalysis" || section === "urinalysis";

  // Checkbox tracking for catalog-based sections (Blood Chemistry, Hematology, etc.)
  const [ticked, setTicked] = useState(() => {
    const t = {};
    if (preSelectedTests && Array.isArray(preSelectedTests)) {
      preSelectedTests.forEach((id) => (t[id] = true));
    }
    return t;
  });

  // Auto-set parasitology defaults when entering fecalysis
  useEffect(() => {
    if (section !== "fecalysis") return;
    const parasiteIds = ["fascaris", "ftrich", "fhook"];
    setTestValues((prev) => {
      const next = { ...prev };
      parasiteIds.forEach((id) => {
        if (!next[id]) next[id] = "NO OVA OF PARASITE SEEN";
      });
      if (!next["famoeba"]) next["famoeba"] = "NONE SEEN";
      return next;
    });
  }, [section]);

  useEffect(() => {
    if (prePatientId) setPatientId(prePatientId);
  }, [prePatientId]);

  useEffect(() => {
    if (safeStaff.length > 0) {
      const mt = safeStaff.find((s) => s && (s.role === "Medical Technologist" || s.role === "MedTech"));
      if (mt) setMedtech(mt.name);
      const path = safeStaff.find((s) => s && s.role === "Pathologist");
      if (path) {
        setPathologist(path.name);
        setValidatedBy(path.name);
      }
    }
  }, [safeStaff]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (patientDropdownRef.current && !patientDropdownRef.current.contains(e.target)) {
        setShowPatientDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleGroupExpand = (idx) => {
    setExpandedGroups((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const isTicked = (id) => isFormBasedSection || !!ticked[id];

  const toggleTick = (id) => {
    setTicked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleResultChange = (id, val) => {
    setTestValues((prev) => ({ ...prev, [id]: val }));
  };

  // Quick Action Shortcuts for Urinalysis
  const handleAllNegativeUrinalysis = () => {
    const chemIds = ["uprot", "ugluc", "uketo", "ubld", "uleuk", "ubili", "unitrite", "uurobili"];
    setTestValues((prev) => {
      const next = { ...prev };
      chemIds.forEach((id) => (next[id] = "Negative"));
      return next;
    });
  };

  const handleNormalMicroUrinalysis = () => {
    setTestValues((prev) => ({
      ...prev,
      uwbc: "0 - 2",
      urbc: "0 - 1",
      uep: "Few",
      ubact: "None",
      umucus: "None",
      ucryst: "None",
      ucasts: "None",
    }));
  };

  // Compute selected test parameters
  const selectedTestObjects = useMemo(() => {
    const list = [];
    secGroups.forEach((group) => {
      if (!group) return;
      (group.tests || []).forEach((test) => {
        if (test && isTicked(test.id)) {
          list.push({ ...test, groupName: group.group || "General Tests" });
        }
      });
    });
    return list;
  }, [secGroups, ticked, isFormBasedSection]);

  const handleSave = (shouldPrint = false) => {
    if (!selectedPatient) {
      alert("Please select a patient before saving.");
      return;
    }

    if (selectedTestObjects.length === 0) {
      alert("Please select or tick at least one test parameter.");
      return;
    }

    const lines = selectedTestObjects.map((t) => {
      let val = testValues[t.id] || "";
      if (section === "fecalysis" && !val) {
        if (["fascaris", "ftrich", "fhook"].includes(t.id)) val = "NO OVA OF PARASITE SEEN";
        if (t.id === "famoeba") val = "NONE SEEN";
      }

      if ((t.showCount || t.id === "ucasts" || String(t.name || "").toLowerCase() === "casts") && countValues[t.id]) {
        const cnt = String(countValues[t.id]).trim();
        if (cnt) val = val ? `${cnt} - ${val}` : cnt;
      }

      const flag = getFlag(t, val);
      return {
        testId: t.id,
        testName: t.name,
        groupName: t.groupName,
        value: val,
        unit: t.unit || "",
        normalRange: t.normalText || (t.normalMin !== undefined ? `${t.normalMin} - ${t.normalMax}` : ""),
        flag: flag,
        brand: brands[t.id] || "",
        showBrand: t.showBrand || false,
        showUnit: t.showUnit !== false,
        showNormal: t.showNormal !== false,
        showFlag: t.showFlag !== false,
      };
    });

    const newResult = {
      id: uid(),
      patientId: selectedPatient.id,
      section,
      sectionLabel: secDef?.label || section,
      date: toInputDate(),
      time: new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }),
      ward: "OP",
      physician: physician || "Dr. Maria Santos",
      medtech: medtech || "John Mark Cruz",
      validatedBy: validatedBy || "Dr. Alex Reyes",
      pathologist: pathologist || "Dr. Alex Reyes",
      remarks: remarks.trim(),
      lines,
      printed: false,
      createdAt: new Date().toISOString(),
    };

    onSave(newResult);
    setSavedSuccessObj(newResult);

    if (shouldPrint && onPrint) {
      onPrint(newResult);
    }
  };

  const getRefText = (test) => {
    if (test.normalText) return test.normalText;
    if (test.normalMin !== undefined && test.normalMax !== undefined) return `${test.normalMin} – ${test.normalMax}`;
    if (test.normalMin !== undefined) return `≥ ${test.normalMin}`;
    if (test.normalMax !== undefined) return `≤ ${test.normalMax}`;
    return "Normal";
  };

  const renderSingleFieldRow = (test) => {
    const val = testValues[test.id] || "";
    const isDropdown = test.inputType === "dropdown" || (Array.isArray(test.options) && test.options.length > 0);
    const refStr = getRefText(test);

    return (
      <div key={test.id} style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
          <span style={{ fontWeight: 600, fontSize: 13, color: C.text }}>{test.name}</span>
          <span style={{ fontSize: 11, color: C.faint, fontStyle: "normal" }}>Ref: {refStr}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, width: 220, justifyContent: "flex-end" }}>
          {isDropdown ? (
            <select
              value={val}
              onChange={(e) => handleResultChange(test.id, e.target.value)}
              style={inp({ width: "100%", height: 32, fontWeight: 500 })}
            >
              <option value="">— Select Result —</option>
              {(test.options || []).map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={val}
              onChange={(e) => handleResultChange(test.id, e.target.value)}
              placeholder="Enter result"
              style={inp({ width: "100%", height: 32 })}
            />
          )}

          {test.unit && <span style={{ fontSize: 11, color: C.muted, minWidth: 32 }}>{test.unit}</span>}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, pb: 70, position: "relative" }}>
      
      {/* Form Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: 0 }}>
            {secDef?.label || section} <span style={{ color: C.muted, fontWeight: 500 }}>› Result Entry Form</span>
          </h1>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => handleSave(false)} style={Btn("ghost", { height: 36, padding: "0 18px" })}>
            Save Draft
          </button>
          <button onClick={() => handleSave(true)} style={Btn("accent", { height: 36, padding: "0 18px" })}>
            {section === "bloodchem" ? "Save & Print Report" : "Save Result"}
          </button>
        </div>
      </div>

      {savedSuccessObj && (
        <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="check" size={18} color="#16A34A" />
              <span style={{ fontWeight: 700, fontSize: 13.5, color: "#166534" }}>
                Result saved for {selectedPatient?.name}!
              </span>
            </div>
            <button onClick={() => setSavedSuccessObj(null)} style={{ background: "transparent", border: "none", color: C.muted, cursor: "pointer", fontSize: 14 }}>✕</button>
          </div>

          <div style={{ fontSize: 11.5, color: "#15803D", fontWeight: 600 }}>
            Add another examination for <strong>{selectedPatient?.name}</strong> in:
          </div>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {SECTIONS.filter((s) => s.id !== section).map((s) => (
              <button
                key={s.id}
                onClick={() => onSwitchSection && onSwitchSection("lab:" + s.id, selectedPatient?.id)}
                style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${C.accent}`, background: "#fff", color: C.accent, fontWeight: 700, fontSize: 11, cursor: "pointer" }}
              >
                + {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Patient & Staff Card Header */}
      <Card style={{ padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative", minWidth: 280 }} ref={patientDropdownRef}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#eff6ff", color: C.accent, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${C.accentMid}` }}>
              <Icon name="userOutline" size={22} color={C.accent} />
            </div>

            <div>
              {selectedPatient ? (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{selectedPatient.name}</span>
                    <button
                      onClick={() => { setPatientId(""); setShowPatientDropdown(true); }}
                      style={{ background: "transparent", border: "none", color: C.accent, fontSize: 11, fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}
                    >
                      Change
                    </button>
                  </div>

                  <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>
                    PID: {selectedPatient.mrn || selectedPatient.id.slice(0, 8).toUpperCase()} • {selectedPatient.gender || "Male"} • {selectedPatient.age || calcAge(selectedPatient.dob)}
                  </div>
                </div>
              ) : (
                <div style={{ position: "relative", width: 240 }}>
                  <div style={{ position: "relative" }}>
                    <input
                      type="text"
                      value={patientSearch}
                      onChange={(e) => { setPatientSearch(e.target.value); setShowPatientDropdown(true); }}
                      onFocus={() => setShowPatientDropdown(true)}
                      placeholder="Search patient or ID..."
                      style={{ width: "100%", height: 36, paddingLeft: 10, paddingRight: 10, borderRadius: 6, border: `1px solid ${showPatientDropdown ? C.accent : C.border}`, fontSize: 12, outline: "none", boxSizing: "border-box" }}
                    />
                  </div>

                  {showPatientDropdown && (
                    <div style={{ position: "absolute", top: "100%", left: 0, right: 0, maxHeight: 220, background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, boxShadow: "0 8px 20px rgba(0,0,0,0.15)", zIndex: 500, padding: 6, display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: "uppercase", padding: "4px 6px" }}>
                        {patientSearch.trim() ? "Search Results:" : "Recent Patients:"}
                      </div>

                      <div style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: 2, maxHeight: 170 }}>
                        {filteredPatients.length === 0 ? (
                          <div style={{ padding: 10, textAlign: "center", fontSize: 11.5, color: C.muted }}>No matching patients</div>
                        ) : (
                          filteredPatients.map((p) => (
                            <div
                              key={p.id}
                              onClick={() => { setPatientId(p.id); setShowPatientDropdown(false); setPatientSearch(""); }}
                              style={{ padding: "6px 8px", borderRadius: 4, background: "transparent", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = C.accentLight)}
                              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                            >
                              <div>
                                <div style={{ fontWeight: 600, fontSize: 12, color: C.text }}>{p.name}</div>
                                <div style={{ fontSize: 10.5, color: C.muted }}>ID: {p.mrn || p.id.slice(0, 8)}</div>
                              </div>
                              <span style={{ fontSize: 10.5, color: C.accent, fontWeight: 600 }}>Select →</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", flex: 1, justifyContent: "flex-end" }}>
            <Field label="PHYSICIAN">
              <input
                list="physician-list"
                value={physician}
                onChange={(e) => setPhysician(e.target.value)}
                placeholder="Physician..."
                style={inp({ width: 130, height: 32 })}
              />
              <datalist id="physician-list">
                {safeStaff.filter((s) => s && (s.role === "Physician" || String(s.role || "").includes("Doctor"))).map((s) => (
                  <option key={s.id} value={s.name} />
                ))}
              </datalist>
            </Field>

            <Field label="PATHOLOGIST *">
              <input
                list="pathologist-list"
                value={pathologist}
                onChange={(e) => setPathologist(e.target.value)}
                placeholder="Pathologist..."
                style={inp({ width: 130, height: 32 })}
              />
              <datalist id="pathologist-list">
                {safeStaff.filter((s) => s && s.role === "Pathologist").map((s) => (
                  <option key={s.id} value={s.name} />
                ))}
              </datalist>
            </Field>

            <Field label="PERFORMED BY *">
              <input
                list="medtech-list"
                value={medtech}
                onChange={(e) => setMedtech(e.target.value)}
                placeholder="MedTech..."
                style={inp({ width: 130, height: 32 })}
              />
              <datalist id="medtech-list">
                {safeStaff.filter((s) => s && (s.role === "Medical Technologist" || s.role === "MedTech")).map((s) => (
                  <option key={s.id} value={s.name} />
                ))}
              </datalist>
            </Field>

            <Field label="VALIDATED BY">
              <input
                list="validator-list"
                value={validatedBy}
                onChange={(e) => setValidatedBy(e.target.value)}
                placeholder="Validator..."
                style={inp({ width: 130, height: 32 })}
              />
              <datalist id="validator-list">
                {safeStaff.map((s) => (
                  <option key={s.id} value={s.name} />
                ))}
              </datalist>
            </Field>
          </div>
        </div>
      </Card>

      {/* ── URINALYSIS SECTION LAYOUT (TWO COLUMNS) ── */}
      {section === "urinalysis" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Left Column: Physical & Chemical Examination */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Physical Examination */}
            <Card>
              <CardHead title="Physical Examination" icon={<Icon name="parameters" size={18} color={C.accent} />} />
              <div style={{ display: "flex", flexDirection: "column" }}>
                {(secGroups.find((g) => g.group === "Physical Examination")?.tests || []).map((t) => renderSingleFieldRow(t))}
              </div>
            </Card>

            {/* Chemical Examination with "All Negative" shortcut */}
            <Card>
              <CardHead
                title="Chemical Examination"
                icon={<Icon name="parameters" size={18} color={C.accent} />}
                right={
                  <button
                    type="button"
                    onClick={handleAllNegativeUrinalysis}
                    style={{ background: "#eff6ff", border: "1px solid #bfdbfe", color: "#2563eb", padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                  >
                    ⚡ All Negative
                  </button>
                }
              />
              <div style={{ display: "flex", flexDirection: "column" }}>
                {(secGroups.find((g) => g.group === "Chemical Examination")?.tests || []).map((t) => renderSingleFieldRow(t))}
              </div>
            </Card>
          </div>

          {/* Right Column: Microscopic Examination */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card>
              <CardHead
                title="Microscopic Examination"
                icon={<Icon name="parameters" size={18} color={C.accent} />}
                right={
                  <button
                    type="button"
                    onClick={handleNormalMicroUrinalysis}
                    style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                  >
                    ⚡ Normal Micro
                  </button>
                }
              />
              <div style={{ display: "flex", flexDirection: "column" }}>
                {(secGroups.find((g) => g.group === "Microscopic Examination")?.tests || []).map((t) => renderSingleFieldRow(t))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ── FECALYSIS SECTION LAYOUT (TWO COLUMNS) ── */}
      {section === "fecalysis" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Left Column: Macroscopic & Microscopic */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card>
              <CardHead title="Macroscopic" icon={<Icon name="parameters" size={18} color={C.accent} />} />
              <div style={{ display: "flex", flexDirection: "column" }}>
                {(secGroups.find((g) => g.group === "Macroscopic")?.tests || []).map((t) => renderSingleFieldRow(t))}
              </div>
            </Card>

            <Card>
              <CardHead title="Microscopic" icon={<Icon name="parameters" size={18} color={C.accent} />} />
              <div style={{ display: "flex", flexDirection: "column" }}>
                {(secGroups.find((g) => g.group === "Microscopic")?.tests || []).map((t) => renderSingleFieldRow(t))}
              </div>
            </Card>
          </div>

          {/* Right Column: Parasitology */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card>
              <CardHead title="Parasitology" icon={<Icon name="parameters" size={18} color={C.accent} />} />
              <div style={{ display: "flex", flexDirection: "column" }}>
                {(secGroups.find((g) => g.group === "Parasitology")?.tests || []).map((t) => renderSingleFieldRow(t))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ── CATALOG-BASED SECTIONS (Blood Chemistry, Hematology, Serology, Microbiology, etc.) ── */}
      {!isFormBasedSection && (
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 16 }}>
          {/* Left Column: Test Catalog */}
          <Card style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: C.text }}>Test Catalog</span>

            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Search tests..."
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                style={inp({ width: "100%", height: 32, paddingLeft: 10 })}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
              {secGroups.map((group, gIdx) => {
                if (!group) return null;
                const isExpanded = expandedGroups[gIdx] !== false;
                const matchingTests = (group.tests || []).filter((t) =>
                  t && (t.name || "").toLowerCase().includes(catalogSearch.toLowerCase())
                );

                if (catalogSearch && matchingTests.length === 0) return null;

                return (
                  <div key={gIdx} style={{ border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
                    <div
                      onClick={() => toggleGroupExpand(gIdx)}
                      style={{ padding: "8px 12px", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
                    >
                      <div style={{ fontWeight: 700, fontSize: 12, color: C.accent, display: "flex", alignItems: "center", gap: 6 }}>
                        <Icon name="parameters" size={14} color={C.accent} />
                        {group.group} ({matchingTests.length || (group.tests || []).length})
                      </div>
                      <Icon name={isExpanded ? "chevronUp" : "chevronDown"} size={14} color={C.muted} />
                    </div>

                    {isExpanded && (
                      <div style={{ padding: "6px 12px", display: "flex", flexDirection: "column", gap: 6, background: "#fff" }}>
                        {(matchingTests.length > 0 ? matchingTests : group.tests || []).map((test) => {
                          if (!test) return null;
                          const isChecked = isTicked(test.id);

                          return (
                            <label
                              key={test.id}
                              style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: C.text, cursor: "pointer", padding: "3px 0" }}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleTick(test.id)}
                                style={{ width: 15, height: 15, accentColor: C.accent, cursor: "pointer" }}
                              />
                              <span style={{ fontWeight: isChecked ? 600 : 400 }}>{test.name}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Right Column: Selected Tests / Active Parameters Panel */}
          <Card>
            <CardHead
              title={`Selected Tests (${selectedTestObjects.length})`}
              sub="Fill in results for the active parameters below"
              icon={<Icon name="reports" size={18} color={C.accent} />}
            />

            {selectedTestObjects.length === 0 ? (
              <div style={{ padding: 48, textAlign: "center", color: C.faint, fontSize: 12.5 }}>
                No tests selected yet. Select tests from the catalog on the left.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "8px 16px", background: "#f8fafc", borderBottom: `1px solid ${C.border}`, display: "grid", gridTemplateColumns: "1fr 200px 100px", fontWeight: 700, fontSize: 11, color: C.muted, textTransform: "uppercase" }}>
                  <span>TEST</span>
                  <span style={{ textAlign: "center" }}>RESULT</span>
                  <span style={{ textAlign: "right" }}>STATUS</span>
                </div>

                {selectedTestObjects.map((test) => {
                  const val = testValues[test.id] || "";
                  const refStr = getRefText(test);

                  return (
                    <div key={test.id} style={{ padding: "10px 16px", borderBottom: `1px solid ${C.border}`, display: "grid", gridTemplateColumns: "1fr 200px 100px", alignItems: "center" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <span style={{ fontWeight: 600, fontSize: 13, color: C.text }}>{test.name}</span>
                        <span style={{ fontSize: 11, color: C.faint }}>Ref: {refStr}</span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
                        <input
                          type="text"
                          value={val}
                          onChange={(e) => handleResultChange(test.id, e.target.value)}
                          placeholder="Enter result"
                          style={inp({ width: 120, height: 32, textAlign: "center", fontWeight: 600 })}
                        />
                        {test.unit && <span style={{ fontSize: 11, color: C.muted }}>{test.unit}</span>}
                      </div>

                      <div style={{ textAlign: "right" }}>
                        {val ? (
                          <span style={{ padding: "2px 8px", borderRadius: 12, background: C.successLight, color: C.success, fontSize: 10.5, fontWeight: 700 }}>
                            ENTERED
                          </span>
                        ) : (
                          <span style={{ padding: "2px 8px", borderRadius: 12, background: "#f1f5f9", color: C.muted, fontSize: 10.5, fontWeight: 500 }}>
                            PENDING
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Remarks Section */}
      <Card style={{ marginTop: 8 }}>
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase" }}>
            REMARKS / CLINICAL IMPRESSION
          </label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Clinical impression or remarks..."
            rows={2}
            style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 12.5, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
          />
        </div>
      </Card>

      {/* ── 5. STICKY BOTTOM ACTION BAR ── */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 220,
          right: 0,
          background: "#ffffff",
          borderTop: `1px solid ${C.border}`,
          boxShadow: "0 -4px 16px rgba(0,0,0,0.06)",
          padding: "10px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 1000,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "#eff6ff", color: C.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="reports" size={20} color={C.accent} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13.5, color: C.text }}>
              {selectedTestObjects.length} Tests Selected
            </div>
            <div style={{ fontSize: 11.5, color: C.muted }}>
              Fill in results and click Save Result to proceed
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => setTestValues({})} style={Btn("ghost", { height: 36, padding: "0 20px" })}>
            Cancel
          </button>
          <button onClick={() => handleSave(false)} style={Btn("accent", { height: 36, padding: "0 24px" })}>
            Save Result
          </button>
        </div>
      </div>
    </div>
  );
}
````

## File: src/components/views/LoginPage.jsx
````javascript
import React, { useState } from "react";
import { C, Btn, inp, Field, Card } from "../../utils/helpers.jsx";
import { Icon } from "../common/Icons.jsx";

export function LoginPage({ accounts = [], onLogin, hospital = {} }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = accounts.find(
      (a) => a.username.toLowerCase() === username.trim().toLowerCase() && a.password === password
    );

    if (user) {
      onLogin(user);
    } else {
      setError("Invalid username or password. Please try again.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: C.primary, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Card style={{ width: "100%", maxWidth: 420, padding: 32, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.3)" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ width: 52, height: 52, borderRadius: 12, background: C.accentLight, color: C.accent, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
            <Icon name="hospital" size={28} color={C.accent} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: "0 0 4px 0" }}>{hospital.name || "MedLIMS"}</h2>
          <p style={{ fontSize: 12, color: C.muted, margin: 0, textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600 }}>
            Laboratory Information System
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Field label="Username">
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" style={inp({ width: "100%", fontWeight: 600 })} required autoFocus />
          </Field>

          <Field label="Password">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" style={inp({ width: "100%" })} required />
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
          Default Credentials: <strong>admin</strong> / <strong>admin123</strong>
        </div>
      </Card>
    </div>
  );
}
````

## File: src/components/views/ParametersView.jsx
````javascript
import React, { useState } from "react";
import { C, Btn, inp, Field, Card, CardHead, uid } from "../../utils/helpers.jsx";
import { SECTIONS } from "../../constants/data.js";
import { Icon } from "../common/Icons.jsx";

export function ParametersView({ tests = {}, onSave }) {
  const [activeSec, setActiveSec] = useState("hematology");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [targetGroupIdx, setTargetGroupIdx] = useState(0);

  const secGroups = tests[activeSec] || [];

  const handleSaveTest = (testObj) => {
    const updatedSec = JSON.parse(JSON.stringify(secGroups));
    if (updatedSec.length === 0) {
      updatedSec.push({ group: "General Tests", tests: [] });
    }

    const grp = updatedSec[targetGroupIdx] || updatedSec[0];
    if (editingTest) {
      grp.tests = grp.tests.map((t) => (t.id === testObj.id ? testObj : t));
    } else {
      grp.tests.push(testObj);
    }

    const newTests = { ...tests, [activeSec]: updatedSec };
    onSave(newTests);
    setModalOpen(false);
  };

  const handleDeleteTest = (groupIdx, testId) => {
    if (window.confirm("Are you sure you want to remove this test parameter?")) {
      const updatedSec = JSON.parse(JSON.stringify(secGroups));
      updatedSec[groupIdx].tests = updatedSec[groupIdx].tests.filter((t) => t.id !== testId);
      const newTests = { ...tests, [activeSec]: updatedSec };
      onSave(newTests);
    }
  };

  const handleAddGroup = () => {
    const gName = window.prompt("Enter new test group name (e.g. Lipid Profile):");
    if (gName && gName.trim()) {
      const updatedSec = [...secGroups, { group: gName.trim(), tests: [] }];
      onSave({ ...tests, [activeSec]: updatedSec });
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card style={{ padding: "16px 20px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="parameters" size={22} color={C.accent} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: C.text }}>Test Parameter Configurations</div>
            <div style={{ fontSize: 11.5, color: C.muted }}>Configure test parameters, normal reference ranges, and units per section</div>
          </div>
        </div>

        <button onClick={handleAddGroup} style={Btn("ghost", { height: 38 })}>
          📁 Add New Group
        </button>
      </Card>

      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
        {SECTIONS.map((s) => {
          const isActive = s.id === activeSec;
          return (
            <button
              key={s.id}
              onClick={() => setActiveSec(s.id)}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: `1px solid ${isActive ? C.accent : C.border}`,
                background: isActive ? C.accent : "#fff",
                color: isActive ? "#fff" : C.text,
                fontWeight: isActive ? 600 : 500,
                fontSize: 12.5,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all .15s ease",
              }}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {secGroups.length === 0 ? (
        <Card style={{ padding: 32, textAlign: "center", color: C.muted }}>
          No test parameters configured for this section yet.
          <br />
          <button onClick={handleAddGroup} style={Btn("accent", { marginTop: 12 })}>
            Create First Group
          </button>
        </Card>
      ) : (
        secGroups.map((group, gIdx) => (
          <Card key={gIdx}>
            <CardHead
              title={group.group || "Test Group"}
              sub={`${(group.tests || []).length} parameters`}
              icon={<Icon name="parameters" size={18} color={C.accent} />}
              right={
                <button
                  onClick={() => {
                    setTargetGroupIdx(gIdx);
                    setEditingTest(null);
                    setModalOpen(true);
                  }}
                  style={Btn("accent", { height: 30, fontSize: 11.5 })}
                >
                  ➕ Add Parameter
                </button>
              }
            />
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, textAlign: "left" }}>
                <thead>
                  <tr style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, color: C.muted, fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
                    <th style={{ padding: "10px 16px" }}>Parameter Name</th>
                    <th style={{ padding: "10px 16px" }}>ID</th>
                    <th style={{ padding: "10px 16px" }}>Unit</th>
                    <th style={{ padding: "10px 16px" }}>Normal Range</th>
                    <th style={{ padding: "10px 16px" }}>Input Type</th>
                    <th style={{ padding: "10px 16px", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(group.tests || []).length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: 16, textAlign: "center", color: C.muted }}>
                        No parameters in this group. Click <strong>Add Parameter</strong> above.
                      </td>
                    </tr>
                  ) : (
                    group.tests.map((t) => (
                      <tr key={t.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                        <td style={{ padding: "10px 16px", fontWeight: 600, color: C.text }}>{t.name}</td>
                        <td style={{ padding: "10px 16px", color: C.faint, fontSize: 11 }}>{t.id}</td>
                        <td style={{ padding: "10px 16px", color: C.muted }}>{t.unit || "—"}</td>
                        <td style={{ padding: "10px 16px", color: C.muted }}>
                          {t.normalText || (t.normalMin !== undefined ? `${t.normalMin} - ${t.normalMax}` : "—")}
                        </td>
                        <td style={{ padding: "10px 16px", color: C.muted }}>
                          <span style={{ padding: "2px 6px", borderRadius: 4, background: C.surface, border: `1px solid ${C.border}`, fontSize: 10.5 }}>
                            {t.inputType || "text"}
                          </span>
                        </td>
                        <td style={{ padding: "10px 16px", textAlign: "right" }}>
                          <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                            <button
                              onClick={() => {
                                setTargetGroupIdx(gIdx);
                                setEditingTest(t);
                                setModalOpen(true);
                              }}
                              style={Btn("ghost", { height: 26, padding: "0 8px", fontSize: 11 })}
                            >
                              Edit
                            </button>
                            <button onClick={() => handleDeleteTest(gIdx, t.id)} style={Btn("danger", { height: 26, padding: "0 8px", fontSize: 11 })}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        ))
      )}

      {modalOpen && (
        <ParamModal
          item={editingTest}
          onSave={handleSaveTest}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}

function ParamModal({ item, onSave, onClose }) {
  const [name, setName] = useState(item ? item.name : "");
  const [paramId, setParamId] = useState(item ? item.id : uid());
  const [unit, setUnit] = useState(item ? item.unit || "" : "");
  const [normalMin, setNormalMin] = useState(item ? item.normalMin ?? "" : "");
  const [normalMax, setNormalMax] = useState(item ? item.normalMax ?? "" : "");
  const [normalText, setNormalText] = useState(item ? item.normalText || "" : "");
  const [inputType, setInputType] = useState(item ? item.inputType || "text" : "text");
  const [optionsStr, setOptionsStr] = useState(item && item.options ? item.options.join(", ") : "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter parameter name.");
      return;
    }

    const options = inputType === "dropdown" ? optionsStr.split(",").map((s) => s.trim()).filter(Boolean) : undefined;

    onSave({
      id: paramId,
      name: name.trim(),
      unit: unit.trim(),
      normalMin: normalMin !== "" ? parseFloat(normalMin) : undefined,
      normalMax: normalMax !== "" ? parseFloat(normalMax) : undefined,
      normalText: normalText.trim(),
      inputType,
      options,
    });
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 500 }}>
        <Card style={{ overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", background: C.primary, color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>{item ? "Edit Parameter" : "Add Parameter"}</span>
            <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#fff", fontSize: 18, cursor: "pointer" }}>✕</button>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Parameter Name *">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Hemoglobin" style={inp({ width: "100%", fontWeight: 600 })} required autoFocus />
              </Field>

              <Field label="Unit">
                <input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="e.g. g/dL" style={inp({ width: "100%" })} />
              </Field>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Normal Min">
                <input type="number" step="any" value={normalMin} onChange={(e) => setNormalMin(e.target.value)} placeholder="e.g. 12" style={inp({ width: "100%" })} />
              </Field>

              <Field label="Normal Max">
                <input type="number" step="any" value={normalMax} onChange={(e) => setNormalMax(e.target.value)} placeholder="e.g. 17" style={inp({ width: "100%" })} />
              </Field>
            </div>

            <Field label="Reference Range Display Text">
              <input type="text" value={normalText} onChange={(e) => setNormalText(e.target.value)} placeholder="e.g. 12 – 17 g/dL or Non-reactive" style={inp({ width: "100%" })} />
            </Field>

            <Field label="Input Format">
              <select value={inputType} onChange={(e) => setInputType(e.target.value)} style={inp({ width: "100%" })}>
                <option value="text">Free Text / Numeric Input</option>
                <option value="dropdown">Dropdown Options</option>
              </select>
            </Field>

            {inputType === "dropdown" && (
              <Field label="Dropdown Options (comma separated)">
                <input type="text" value={optionsStr} onChange={(e) => setOptionsStr(e.target.value)} placeholder="YELLOW, STRAW, CLEAR" style={inp({ width: "100%" })} />
              </Field>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
              <button type="button" onClick={onClose} style={Btn("ghost")}>Cancel</button>
              <button type="submit" style={Btn("accent")}>{item ? "Update" : "Add Parameter"}</button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
````

## File: src/components/views/PatientsView.jsx
````javascript
import React, { useState, useMemo } from "react";
import { C, Btn, inp, Field, Card, CardHead, uid, toInputDate, calcAge, fmtDate } from "../../utils/helpers.jsx";
import { Icon } from "../common/Icons.jsx";

export function PatientsView({ data = [], onSave }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);

  const filteredPatients = useMemo(() => {
    const list = Array.isArray(data) ? data : [];
    return list.filter((p) => {
      const term = searchTerm.toLowerCase();
      return (
        (p.name || "").toLowerCase().includes(term) ||
        (p.mrn || "").toLowerCase().includes(term) ||
        (p.phone || "").toLowerCase().includes(term) ||
        (p.address || "").toLowerCase().includes(term)
      );
    });
  }, [data, searchTerm]);

  const handleOpenAdd = () => {
    setEditingPatient(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (pt) => {
    setEditingPatient(pt);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this patient record?")) {
      const updated = data.filter((p) => p.id !== id);
      onSave(updated);
    }
  };

  const handleSavePatient = (patientObj) => {
    if (editingPatient) {
      const updated = data.map((p) => (p.id === patientObj.id ? patientObj : p));
      onSave(updated);
    } else {
      onSave([patientObj, ...data]);
    }
    setModalOpen(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card style={{ padding: "16px 20px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="patients" size={22} color={C.accent} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: C.text }}>Patient Directory</div>
            <div style={{ fontSize: 11.5, color: C.muted }}>Manage master patient demographics, auto-slash MM/DD/YYYY DOB, and age values</div>
          </div>
        </div>

        <button onClick={handleOpenAdd} style={Btn("accent", { height: 38 })}>
          Register New Patient
        </button>
      </Card>

      <Card style={{ padding: 16 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <input
            type="text"
            placeholder="Search patient by name, MRN, phone, address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={inp({ width: "100%", maxWidth: 400 })}
          />
          <span style={{ fontSize: 12, color: C.muted }}>
            Showing {filteredPatients.length} of {data.length} patients
          </span>
        </div>
      </Card>

      <Card>
        <CardHead
          title={`Patient Records (${filteredPatients.length})`}
          sub="Master list of registered clinic patients"
          icon={<Icon name="patients" size={18} color={C.accent} />}
        />
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, textAlign: "left" }}>
            <thead>
              <tr style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, color: C.muted, fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
                <th style={{ padding: "12px 16px" }}>MRN / Patient ID</th>
                <th style={{ padding: "12px 16px" }}>Patient Name</th>
                <th style={{ padding: "12px 16px" }}>Age</th>
                <th style={{ padding: "12px 16px" }}>Gender</th>
                <th style={{ padding: "12px 16px" }}>Date of Birth (MM/DD/YYYY)</th>
                <th style={{ padding: "12px 16px" }}>Phone</th>
                <th style={{ padding: "12px 16px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: 24, textAlign: "center", color: C.muted }}>
                    No patient records found. Click <strong>Register New Patient</strong> to add one.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((p) => (
                  <tr key={p.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "12px 16px", fontWeight: 700, color: C.accent, fontSize: 11.5 }}>
                      {p.mrn || p.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td style={{ padding: "12px 16px", fontWeight: 600, color: C.text }}>{p.name}</td>
                    <td style={{ padding: "12px 16px", fontWeight: 700, color: C.primary }}>
                      {p.age ? p.age : (calcAge(p.dob) || "—")}
                    </td>
                    <td style={{ padding: "12px 16px", color: C.muted }}>{p.gender || "—"}</td>
                    <td style={{ padding: "12px 16px", color: C.muted }}>{fmtDate(p.dob)}</td>
                    <td style={{ padding: "12px 16px", color: C.muted }}>{p.phone || "—"}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                        <button onClick={() => handleOpenEdit(p)} style={Btn("ghost", { height: 28, padding: "0 10px", fontSize: 11 })}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(p.id)} style={Btn("danger", { height: 28, padding: "0 10px", fontSize: 11 })}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {modalOpen && (
        <PatientFormModal
          patient={editingPatient}
          totalCount={data.length}
          onSave={handleSavePatient}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}

function PatientFormModal({ patient, totalCount = 0, onSave, onClose }) {
  const [name, setName] = useState(patient ? patient.name || "" : "");

  const generateSeqMrn = () => {
    const yr = new Date().getFullYear();
    const seq = String(totalCount + 1).padStart(6, "0");
    return `${yr}-${seq}`;
  };

  const [mrn, setMrn] = useState(patient ? patient.mrn || "" : generateSeqMrn());

  const formatInitialDob = (d) => {
    if (!d) return "";
    const parts = String(d).split("-");
    if (parts.length === 3) {
      return `${parts[1]}/${parts[2]}/${parts[0]}`;
    }
    return String(d);
  };

  const [dobText, setDobText] = useState(patient ? formatInitialDob(patient.dob) : "");
  const [age, setAge] = useState(patient ? patient.age || calcAge(patient.dob) : "");
  const [gender, setGender] = useState(patient ? patient.gender || "Male" : "Male");
  const [phone, setPhone] = useState(patient ? patient.phone || "" : "");
  const [address, setAddress] = useState(patient ? patient.address || "" : "");
  const [notes, setNotes] = useState(patient ? patient.notes || "" : "");

  // Smooth, non-locking Date of Birth input handler
  const handleDobTextChange = (e) => {
    const rawVal = e.target.value;
    
    // Extract only digits up to 8 max
    const digits = rawVal.replace(/\D/g, "").slice(0, 8);
    
    let formatted = "";
    if (digits.length <= 2) {
      formatted = digits;
    } else if (digits.length <= 4) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    } else {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    }

    setDobText(formatted);

    // Compute age ONLY when 8 full digits are entered AND represent a valid date
    if (digits.length === 8) {
      const mm = parseInt(digits.slice(0, 2), 10);
      const dd = parseInt(digits.slice(2, 4), 10);
      const yyyy = parseInt(digits.slice(4, 8), 10);

      if (mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31 && yyyy >= 1900 && yyyy <= 2099) {
        const isoDob = `${yyyy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
        const calculatedAge = calcAge(isoDob);
        if (calculatedAge && calculatedAge !== "—") {
          setAge(calculatedAge);
        }
      }
    }
  };

  const handleAgeChange = (val) => {
    setAge(val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter the patient's full name.");
      return;
    }

    let dbDob = dobText;
    const parts = dobText.split("/");
    if (parts.length === 3 && parts[2].length === 4) {
      dbDob = `${parts[2]}-${String(parts[0]).padStart(2, "0")}-${String(parts[1]).padStart(2, "0")}`;
    }

    onSave({
      id: patient ? patient.id : uid(),
      name: name.trim(),
      mrn: mrn.trim(),
      dob: dbDob,
      age: age.trim() || calcAge(dbDob),
      gender,
      phone: phone.trim(),
      address: address.trim(),
      notes: notes.trim(),
      createdAt: patient ? patient.createdAt : toInputDate(),
    });
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 540 }}>
        <Card style={{ overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", background: C.primary, color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>{patient ? "Edit Patient Record" : "Register New Patient"}</span>
            <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#fff", fontSize: 18, cursor: "pointer" }}>✕</button>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Full Name *">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Last Name, First Name" style={inp({ width: "100%", fontWeight: 600 })} required autoFocus />
              </Field>

              <Field label="MRN / Patient ID">
                <input type="text" value={mrn} onChange={(e) => setMrn(e.target.value)} placeholder="2026-000001" style={inp({ width: "100%", fontWeight: 700, color: C.accent })} />
              </Field>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <Field label="Date of Birth (MM/DD/YYYY) *">
                <input
                  type="text"
                  value={dobText}
                  onChange={handleDobTextChange}
                  placeholder="MM/DD/YYYY"
                  maxLength={10}
                  style={inp({ width: "100%", fontWeight: 600 })}
                />
              </Field>

              <Field label="Age (Auto-computed)">
                <input
                  type="text"
                  value={age}
                  onChange={(e) => handleAgeChange(e.target.value)}
                  placeholder="e.g. 24y or 5mo"
                  style={inp({ width: "100%", fontWeight: 700, color: C.primary })}
                />
              </Field>

              <Field label="Gender">
                <select value={gender} onChange={(e) => setGender(e.target.value)} style={inp({ width: "100%" })}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </Field>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Contact Phone">
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="09XX-XXX-XXXX" style={inp({ width: "100%" })} />
              </Field>

              <Field label="Address">
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="City / Province" style={inp({ width: "100%" })} />
              </Field>
            </div>

            <Field label="Notes / Clinical History">
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional medical history or notes..." rows={2} style={inp({ width: "100%", height: "auto", padding: "8px 12px" })} />
            </Field>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
              <button type="button" onClick={onClose} style={Btn("ghost")}>Cancel</button>
              <button type="submit" style={Btn("accent")}>{patient ? "Update Record" : "Register Patient"}</button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
````

## File: src/components/views/PersonnelView.jsx
````javascript
import React, { useState } from "react";
import { C, Btn, inp, Field, Card, CardHead, uid } from "../../utils/helpers.jsx";
import { Icon } from "../common/Icons.jsx";

export function PersonnelView({ data = [], onSave }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this staff member?")) {
      onSave(data.filter((s) => s.id !== id));
    }
  };

  const handleSaveStaff = (staffObj) => {
    if (editingItem) {
      onSave(data.map((s) => (s.id === staffObj.id ? staffObj : s)));
    } else {
      onSave([...data, staffObj]);
    }
    setModalOpen(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card style={{ padding: "16px 20px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="personnel" size={22} color={C.accent} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: C.text }}>Laboratory Personnel & Physicians</div>
            <div style={{ fontSize: 11.5, color: C.muted }}>Manage medical technologists, pathologists, requesting physicians, PRC licenses, and digital signatures</div>
          </div>
        </div>

        <button onClick={handleOpenAdd} style={Btn("accent", { height: 38 })}>
          Add Personnel
        </button>
      </Card>

      <Card>
        <CardHead title={`Staff Registry (${data.length})`} sub="List of authorized laboratory personnel and physicians" icon={<Icon name="personnel" size={18} color={C.accent} />} />
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, textAlign: "left" }}>
            <thead>
              <tr style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, color: C.muted, fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
                <th style={{ padding: "12px 16px" }}>Full Name</th>
                <th style={{ padding: "12px 16px" }}>Role / Designation</th>
                <th style={{ padding: "12px 16px" }}>PRC License No.</th>
                <th style={{ padding: "12px 16px" }}>Digital Signature</th>
                <th style={{ padding: "12px 16px" }}>Phone</th>
                <th style={{ padding: "12px 16px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: 24, textAlign: "center", color: C.muted }}>
                    No personnel added yet. Click <strong>Add Personnel</strong> to register staff or physicians.
                  </td>
                </tr>
              ) : (
                data.map((s) => (
                  <tr key={s.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "12px 16px", fontWeight: 600, color: C.text }}>{s.name}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ padding: "2px 8px", borderRadius: 6, background: C.accentLight, color: C.accent, fontSize: 11, fontWeight: 600 }}>
                        {s.role || "Staff"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", color: C.muted }}>{s.licenseNo || "—"}</td>
                    <td style={{ padding: "12px 16px" }}>
                      {s.signatureUri || s.eSignature ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <img src={s.signatureUri || s.eSignature} alt="Signature" style={{ height: 24, maxWidth: 80, objectFit: "contain", border: `1px solid ${C.border}`, borderRadius: 4, background: "#fff", padding: 2 }} />
                          <span style={{ fontSize: 10.5, color: C.success, fontWeight: 700 }}>✓ Attached</span>
                        </div>
                      ) : (
                        <span style={{ fontSize: 11, color: C.faint }}>No Signature</span>
                      )}
                    </td>
                    <td style={{ padding: "12px 16px", color: C.muted }}>{s.phone || "—"}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                        <button onClick={() => handleOpenEdit(s)} style={Btn("ghost", { height: 28, padding: "0 10px", fontSize: 11 })}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(s.id)} style={Btn("danger", { height: 28, padding: "0 10px", fontSize: 11 })}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {modalOpen && (
        <StaffFormModal
          item={editingItem}
          onSave={handleSaveStaff}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}

function StaffFormModal({ item, onSave, onClose }) {
  const [name, setName] = useState(item ? item.name : "");
  const [role, setRole] = useState(item ? item.role || "Medical Technologist" : "Medical Technologist");
  const [licenseNo, setLicenseNo] = useState(item ? item.licenseNo || "" : "");
  const [phone, setPhone] = useState(item ? item.phone || "" : "");
  const [email, setEmail] = useState(item ? item.email || "" : "");
  const [signatureUri, setSignatureUri] = useState(item ? item.signatureUri || item.eSignature || "" : "");

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setSignatureUri(evt.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter the person's name.");
      return;
    }

    onSave({
      id: item ? item.id : uid(),
      name: name.trim(),
      role,
      licenseNo: licenseNo.trim(),
      phone: phone.trim(),
      email: email.trim(),
      signatureUri,
      eSignature: signatureUri,
    });
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 500 }}>
        <Card style={{ overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", background: C.primary, color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>{item ? "Edit Personnel / Physician" : "Add Laboratory Staff / Physician"}</span>
            <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#fff", fontSize: 18, cursor: "pointer" }}>✕</button>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
            <Field label="Full Name & Title *">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Dr. Maria Santos, MD / Juan Dela Cruz, RMT" style={inp({ width: "100%", fontWeight: 600 })} required autoFocus />
            </Field>

            <Field label="Designation / Role *">
              <select value={role} onChange={(e) => setRole(e.target.value)} style={inp({ width: "100%" })}>
                <option value="Physician">Physician / Requesting Doctor (MD)</option>
                <option value="Medical Technologist">Medical Technologist (RMT)</option>
                <option value="Pathologist">Pathologist (MD)</option>
                <option value="Laboratory Technician">Laboratory Technician</option>
                <option value="Admin">Administrator</option>
              </select>
            </Field>

            <Field label="PRC / License Number">
              <input type="text" value={licenseNo} onChange={(e) => setLicenseNo(e.target.value)} placeholder="PRC Lic. No. 0012345" style={inp({ width: "100%" })} />
            </Field>

            <div style={{ padding: 12, border: `1px solid ${C.border}`, borderRadius: 8, background: C.surface, display: "flex", flexDirection: "column", gap: 10 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase" }}>
                Digital Signature Photo (PNG/JPG)
              </label>

              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                {signatureUri ? (
                  <img src={signatureUri} alt="Signature Preview" style={{ height: 40, maxWidth: 120, objectFit: "contain", border: `1px solid ${C.border}`, borderRadius: 4, background: "#fff", padding: 4 }} />
                ) : (
                  <div style={{ height: 40, width: 120, border: `1.5px dashed ${C.faint}`, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted, fontSize: 10 }}>
                    No Photo
                  </div>
                )}

                <div style={{ display: "flex", gap: 8 }}>
                  <input type="file" accept="image/*" onChange={handleSignatureUpload} id="sig-upload" style={{ display: "none" }} />
                  <label htmlFor="sig-upload" style={Btn("ghost", { height: 32, cursor: "pointer", fontSize: 11.5 })}>
                    Upload Signature Image
                  </label>
                  {signatureUri && (
                    <button type="button" onClick={() => setSignatureUri("")} style={Btn("danger", { height: 32, fontSize: 11 })}>
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Phone Number">
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="09XX-XXX-XXXX" style={inp({ width: "100%" })} />
              </Field>

              <Field label="Email Address">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="doctor@hospital.com" style={inp({ width: "100%" })} />
              </Field>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
              <button type="button" onClick={onClose} style={Btn("ghost")}>Cancel</button>
              <button type="submit" style={Btn("accent")}>{item ? "Update Personnel" : "Save Personnel"}</button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
````

## File: src/components/views/ReportsView.jsx
````javascript
import React, { useState, useMemo } from "react";
import { C, Btn, inp, Field, Card, CardHead, fmtDate, calcAge, getFlag } from "../../utils/helpers.jsx";
import { SECTIONS } from "../../constants/data.js";
import { Icon } from "../common/Icons.jsx";

export function ReportsView({
  results = [],
  patients = [],
  staff = [],
  onPrint,
  onBatchPrint,
  onDelete,
  onEdit,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSection, setFilterSection] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);
  const [editingResult, setEditingResult] = useState(null);

  const getPatient = (patientId) => patients.find((p) => p.id === patientId);

  const filteredResults = useMemo(() => {
    return results.filter((r) => {
      const pt = getPatient(r.patientId);
      const ptName = pt ? pt.name.toLowerCase() : "";
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        ptName.includes(search) ||
        (r.sectionLabel || "").toLowerCase().includes(search) ||
        (r.physician || "").toLowerCase().includes(search) ||
        (r.date || "").includes(search);

      const matchesSection = filterSection === "all" || r.section === filterSection;

      const matchesStatus =
        filterStatus === "all"
          ? true
          : filterStatus === "printed"
          ? r.printed
          : !r.printed;

      return matchesSearch && matchesSection && matchesStatus;
    });
  }, [results, patients, searchTerm, filterSection, filterStatus]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredResults.map((r) => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBatchPrint = () => {
    const selected = results.filter((r) => selectedIds.includes(r.id));
    if (selected.length === 0) {
      alert("Please select at least one report to print.");
      return;
    }
    const q = [...selected];
    q._batch = true;
    onBatchPrint(q);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this lab report record?")) {
      onDelete(id);
      setSelectedIds((prev) => prev.filter((x) => x !== id));
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card style={{ padding: "16px 20px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="reports" size={22} color={C.accent} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: C.text }}>Laboratory Reports Archive</div>
            <div style={{ fontSize: 11.5, color: C.muted }}>Search, filter, view, edit, and print generated laboratory reports</div>
          </div>
        </div>

        {selectedIds.length > 0 && (
          <button onClick={handleBatchPrint} style={Btn("accent", { height: 36 })}>
            Batch Print Selected ({selectedIds.length})
          </button>
        )}
      </Card>

      <Card style={{ padding: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 4, textTransform: "uppercase" }}>
              Search Records
            </label>
            <input
              type="text"
              placeholder="Search by patient, physician, date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={inp({ width: "100%" })}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 4, textTransform: "uppercase" }}>
              Filter Section
            </label>
            <select value={filterSection} onChange={(e) => setFilterSection(e.target.value)} style={inp({ width: "100%" })}>
              <option value="all">All Sections</option>
              {SECTIONS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 4, textTransform: "uppercase" }}>
              Print Status
            </label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={inp({ width: "100%" })}>
              <option value="all">All Statuses</option>
              <option value="pending">Pending Print</option>
              <option value="printed">Printed</option>
            </select>
          </div>
        </div>
      </Card>

      <Card>
        <CardHead
          title={`Reports List (${filteredResults.length})`}
          sub="Click print or edit actions on individual records"
          icon={<Icon name="reports" size={18} color={C.accent} />}
        />
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, textAlign: "left" }}>
            <thead>
              <tr style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, color: C.muted, fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
                <th style={{ padding: "12px 16px", width: 40, textAlign: "center" }}>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={filteredResults.length > 0 && selectedIds.length === filteredResults.length}
                  />
                </th>
                <th style={{ padding: "12px 16px" }}>Patient Name</th>
                <th style={{ padding: "12px 16px" }}>Section</th>
                <th style={{ padding: "12px 16px" }}>Exam Date & Time</th>
                <th style={{ padding: "12px 16px" }}>Physician</th>
                <th style={{ padding: "12px 16px" }}>Status</th>
                <th style={{ padding: "12px 16px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: 24, textAlign: "center", color: C.muted }}>
                    No reports match your current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredResults.map((r) => {
                  const pt = getPatient(r.patientId);
                  const isSelected = selectedIds.includes(r.id);

                  return (
                    <tr key={r.id} style={{ borderBottom: `1px solid ${C.border}`, background: isSelected ? C.accentLight : "transparent" }}>
                      <td style={{ padding: "12px 16px", textAlign: "center" }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(r.id)}
                        />
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ fontWeight: 600, color: C.text }}>{pt ? pt.name : "Unknown Patient"}</div>
                        <div style={{ fontSize: 11, color: C.muted }}>
                          {pt ? `${calcAge(pt.dob)} / ${pt.gender || "—"}` : "—"}
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ padding: "3px 8px", borderRadius: 6, background: C.accentLight, color: C.accent, fontSize: 11, fontWeight: 600 }}>
                          {r.sectionLabel || r.section}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", color: C.muted }}>
                        {fmtDate(r.date)} {r.time ? `(${r.time})` : ""}
                      </td>
                      <td style={{ padding: "12px 16px", color: C.muted }}>{r.physician || "—"}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ padding: "3px 8px", borderRadius: 12, fontSize: 10.5, fontWeight: 700, background: r.printed ? C.successLight : C.warningLight, color: r.printed ? C.success : C.warning }}>
                          {r.printed ? "PRINTED" : "PENDING"}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>
                        <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                          <button onClick={() => onPrint(r)} style={Btn("ghost", { height: 28, padding: "0 8px", fontSize: 11 })}>
                            Print
                          </button>
                          <button onClick={() => setEditingResult(r)} style={Btn("ghost", { height: 28, padding: "0 8px", fontSize: 11 })}>
                            Edit
                          </button>
                          <button onClick={() => handleDelete(r.id)} style={Btn("danger", { height: 28, padding: "0 8px", fontSize: 11 })}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {editingResult && (
        <EditResultModal
          result={editingResult}
          patient={getPatient(editingResult.patientId)}
          staff={staff}
          onSave={(updated) => {
            onEdit(updated);
            setEditingResult(null);
          }}
          onClose={() => setEditingResult(null)}
        />
      )}
    </div>
  );
}

function EditResultModal({ result, patient, staff = [], onSave, onClose }) {
  const [physician, setPhysician] = useState(result.physician || "");
  const [ward, setWard] = useState(result.ward || "OP");
  const [medtech, setMedtech] = useState(result.medtech || "");
  const [validatedBy, setValidatedBy] = useState(result.validatedBy || "");
  const [pathologist, setPathologist] = useState(result.pathologist || "");
  const [remarks, setRemarks] = useState(result.remarks || "");
  const [lines, setLines] = useState(result.lines || []);

  const handleLineValueChange = (idx, val) => {
    const updated = [...lines];
    const testDef = { normalText: updated[idx].normalRange, normalMin: updated[idx].normalMin, normalMax: updated[idx].normalMax };
    const newFlag = getFlag(testDef, val);
    updated[idx] = { ...updated[idx], value: val, flag: newFlag };
    setLines(updated);
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSave({
      ...result,
      physician,
      ward,
      medtech,
      validatedBy,
      pathologist,
      remarks,
      lines,
    });
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 680, maxHeight: "90vh", overflowY: "auto" }}>
        <Card style={{ overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", background: C.primary, color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>Edit Result Record</span>
            <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#fff", fontSize: 18, cursor: "pointer" }}>✕</button>
          </div>

          <form onSubmit={handleSave} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ padding: "10px 14px", background: C.surface, borderRadius: 8, fontSize: 12 }}>
              <strong>Patient:</strong> {patient ? patient.name : "Unknown"} | <strong>Section:</strong> {result.sectionLabel || result.section} | <strong>Date:</strong> {fmtDate(result.date)}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Physician">
                <input
                  list="edit-phys-list"
                  value={physician}
                  onChange={(e) => setPhysician(e.target.value)}
                  style={inp({ width: "100%" })}
                />
                <datalist id="edit-phys-list">
                  {staff.filter((s) => s.role === "Physician" || s.role?.includes("Doctor")).map((s) => (
                    <option key={s.id} value={s.name} />
                  ))}
                </datalist>
              </Field>

              <Field label="Ward / Room">
                <input type="text" value={ward} onChange={(e) => setWard(e.target.value)} style={inp({ width: "100%" })} />
              </Field>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 8, textTransform: "uppercase" }}>
                Test Parameters, Values & Flags
              </label>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, color: C.muted, textAlign: "left", fontSize: 11, fontWeight: 700 }}>
                    <th style={{ padding: "6px 10px" }}>Parameter</th>
                    <th style={{ padding: "6px 10px" }}>Value</th>
                    <th style={{ padding: "6px 10px" }}>Unit</th>
                    <th style={{ padding: "6px 10px" }}>Flag</th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((line, idx) => (
                    <tr key={idx} style={{ borderBottom: `1px solid ${C.border}` }}>
                      <td style={{ padding: "6px 10px", fontWeight: 600 }}>{line.testName}</td>
                      <td style={{ padding: "6px 10px" }}>
                        <input
                          type="text"
                          value={line.value || ""}
                          onChange={(e) => handleLineValueChange(idx, e.target.value)}
                          style={inp({ width: "100%", height: 30 })}
                        />
                      </td>
                      <td style={{ padding: "6px 10px", color: C.muted }}>{line.unit || "—"}</td>
                      <td style={{ padding: "6px 10px" }}>
                        {line.flag && (
                          <span style={{ padding: "2px 6px", borderRadius: 4, fontSize: 10, fontWeight: 700, background: C.dangerLight, color: C.danger }}>
                            {line.flag}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Field label="Remarks & Clinical Impression">
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Remarks printed on PDF report..."
                rows={2}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12.5, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
              />
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <Field label="MedTech">
                <input type="text" value={medtech} onChange={(e) => setMedtech(e.target.value)} style={inp({ width: "100%" })} />
              </Field>
              <Field label="Validated By">
                <input type="text" value={validatedBy} onChange={(e) => setValidatedBy(e.target.value)} style={inp({ width: "100%" })} />
              </Field>
              <Field label="Pathologist">
                <input type="text" value={pathologist} onChange={(e) => setPathologist(e.target.value)} style={inp({ width: "100%" })} />
              </Field>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
              <button type="button" onClick={onClose} style={Btn("ghost")}>Cancel</button>
              <button type="submit" style={Btn("accent")}>Save Changes</button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
````

## File: src/components/views/SummaryView.jsx
````javascript
import React, { useState, useMemo } from "react";
import { C, Btn, inp, Card, CardHead, fmtDate, calcAge, toInputDate } from "../../utils/helpers.jsx";
import { SECTIONS, SECTION_COLORS } from "../../constants/data.js";
import { Icon } from "../common/Icons.jsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function SummaryView({ results = [], patients = [], hospital }) {
  const [date, setDate] = useState(toInputDate());
  const [activeSec, setActiveSec] = useState(null);

  const getP = (id) => patients.find((p) => p.id === id);

  const dayResults = useMemo(() => {
    return results.filter((r) => r.date === date);
  }, [results, date]);

  const sectionsWithData = useMemo(() => {
    return SECTIONS.filter((s) => dayResults.some((r) => r.section === s.id));
  }, [SECTIONS, dayResults]);

  const totalToday = dayResults.length;

  // Generate Matrix Summary PDF
  const generateSummaryPDF = async (sectionsToPrint) => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const W = 297;
    const grey = [80, 80, 80];
    const black = [15, 30, 45];
    const navy = [15, 45, 82];

    const fmtPrintDate = fmtDate(date);
    let isFirstPage = true;

    for (const sec of sectionsToPrint) {
      const secR = dayResults.filter((r) => r.section === sec.id);
      if (secR.length === 0) continue;

      const sectColor = SECTION_COLORS[sec.id] || [15, 45, 82];
      const testNames = [...new Set(secR.flatMap((r) => (r.lines || []).map((l) => l.testName)))];

      if (!isFirstPage) doc.addPage("a4", "landscape");
      isFirstPage = false;

      let y = 12;

      doc.setFont("times", "bold");
      doc.setFontSize(13);
      doc.setTextColor(...navy);
      doc.text(hospital?.name || "CLINICAL LABORATORY", W / 2, y, { align: "center" });
      y += 5;

      doc.setFontSize(8.5);
      doc.setFont("times", "normal");
      doc.setTextColor(...grey);
      if (hospital?.address) { doc.text(hospital.address, W / 2, y, { align: "center" }); y += 4; }
      if (hospital?.phone) { doc.text("Tel: " + hospital.phone, W / 2, y, { align: "center" }); y += 4; }

      doc.setFont("times", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(...navy);
      doc.text("DAILY LABORATORY SUMMARY — " + fmtPrintDate.toUpperCase(), W / 2, y, { align: "center" });
      y += 3;

      doc.setDrawColor(15, 45, 82);
      doc.setLineWidth(0.5);
      doc.line(10, y, W - 10, y);
      y += 5;

      doc.setFillColor(...sectColor);
      doc.roundedRect(10, y, W - 20, 6, 1, 1, "F");
      doc.setFont("times", "bold");
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text(sec.label.toUpperCase() + "   ·   " + secR.length + " Patient Record(s)", W / 2, y + 4, { align: "center" });
      y += 9;

      const fixedCols = ["No.", "Name", "DOB", "Age", "Sex", "Ward", "Address"];
      const head = [...fixedCols, ...testNames];

      const body = secR.map((r, i) => {
        const p = getP(r.patientId);
        const dob = p?.dob ? fmtDate(p.dob) : "—";
        const fixed = [
          String(i + 1),
          p?.name || "—",
          dob,
          p?.age || calcAge(p?.dob) || "—",
          p?.gender || "—",
          r.ward || "OP",
          p?.address || "—",
        ];
        const testCells = testNames.map((tn) => {
          const line = (r.lines || []).find((l) => l.testName === tn);
          return line?.value || "";
        });
        return [...fixed, ...testCells];
      });

      const usable = W - 20;
      const fixedWidths = [8, 36, 18, 12, 10, 12, 28];
      const fixedTotal = fixedWidths.reduce((a, b) => a + b, 0);
      const testW = testNames.length > 0
        ? Math.max(12, Math.floor((usable - fixedTotal) / testNames.length))
        : 12;

      const colStyles = {};
      fixedWidths.forEach((w, idx) => {
        colStyles[idx] = { cellWidth: w, halign: idx === 1 || idx === 6 ? "left" : "center" };
      });
      testNames.forEach((_, idx) => {
        colStyles[fixedCols.length + idx] = { cellWidth: testW, halign: "center", fontStyle: "bold" };
      });

      autoTable(doc, {
        startY: y,
        head: [head],
        body,
        margin: { left: 10, right: 10 },
        styles: { font: "times", fontSize: 7, cellPadding: 1.5, textColor: black, overflow: "ellipsize" },
        headStyles: { fillColor: sectColor, textColor: [255, 255, 255], fontStyle: "bold", fontSize: 7, halign: "center", valign: "middle" },
        columnStyles: colStyles,
        didParseCell(data) {
          if (data.section === "body" && data.column.index >= fixedCols.length) {
            const ri = data.row.index;
            const ti = data.column.index - fixedCols.length;
            const tn = testNames[ti];
            const r2 = secR[ri];
            const line = r2 ? (r2.lines || []).find((l) => l.testName === tn) : null;
            if (line?.flag === "HI") data.cell.styles.textColor = [192, 57, 43];
            else if (line?.flag === "LO") data.cell.styles.textColor = [26, 111, 181];
          }
        },
      });
    }

    const filename = `Daily_Summary_${date.replace(/-/g, "")}.pdf`;
    if (window.electronAPI && window.electronAPI.savePDF) {
      const dataUri = doc.output("datauristring");
      const base64 = dataUri.split(",")[1];
      const res = await window.electronAPI.savePDF(filename, base64);
      if (res && res.success && res.filePath) {
        await window.electronAPI.printPDF(res.filePath, filename);
      }
    } else {
      doc.save(filename);
    }
  };

  const handlePrint = (secToPrint) => {
    const list = secToPrint ? [secToPrint] : sectionsWithData;
    if (list.length === 0) return alert("No results recorded for this date.");
    generateSummaryPDF(list);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Top Banner */}
      <Card style={{ padding: "14px 20px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="summary" size={22} color={C.accent} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: C.text }}>Daily Census Summary</div>
            <div style={{ fontSize: 11.5, color: C.muted }}>Daily counters reset automatically at 00:00 midnight</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase" }}>Lookup Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setActiveSec(null);
            }}
            style={inp({ height: 34, fontWeight: 600 })}
          />
          <button onClick={() => handlePrint(null)} style={Btn("accent", { height: 34 })}>
            Print Daily Summary PDF
          </button>
        </div>
      </Card>

      {/* Today's Counter Cards (Resets at 00:00) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
        <Card style={{ padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: C.accentLight, color: C.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="reports" size={22} color={C.accent} />
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.text }}>{totalToday}</div>
            <div style={{ fontSize: 11.5, color: C.muted, fontWeight: 600 }}>Total Exams ({fmtDate(date)})</div>
          </div>
        </Card>

        <Card style={{ padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "#F0FDF4", color: C.success, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="patients" size={22} color={C.success} />
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.text }}>{new Set(dayResults.map((r) => r.patientId)).size}</div>
            <div style={{ fontSize: 11.5, color: C.muted, fontWeight: 600 }}>Unique Patients ({fmtDate(date)})</div>
          </div>
        </Card>
      </div>

      {/* Section Selector Grid or Active Section Matrix Table */}
      {!activeSec ? (
        <Card>
          <CardHead title="Select Section to View Daily Matrix Summary" sub={`Active sections with data on ${fmtDate(date)}`} icon={<Icon name="dashboard" size={18} color={C.accent} />} />
          <div style={{ padding: 20 }}>
            {sectionsWithData.length === 0 ? (
              <div style={{ padding: 32, textAlign: "center", color: C.muted }}>
                No laboratory exam records found for date: <strong>{fmtDate(date)}</strong>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
                {sectionsWithData.map((sec) => {
                  const secCount = dayResults.filter((r) => r.section === sec.id).length;
                  return (
                    <div
                      key={sec.id}
                      onClick={() => setActiveSec(sec.id)}
                      style={{
                        padding: "16px 18px",
                        borderRadius: 10,
                        border: `1px solid ${C.border}`,
                        background: "#fff",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                        transition: "all .15s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = C.accent;
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(37,99,235,0.12)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = C.border;
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: 14, color: C.primary }}>{sec.label}</div>
                      <div style={{ fontSize: 11.5, color: C.muted }}>{secCount} exam(s) recorded</div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: C.accent, marginTop: 4 }}>View Matrix Table →</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Card>
      ) : (
        /* Section Matrix Table */
        <Card>
          <div style={{ padding: "12px 18px", background: C.primary, color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: "10px 10px 0 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button onClick={() => setActiveSec(null)} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer" }}>
                ← Back
              </button>
              <span style={{ fontWeight: 700, fontSize: 14 }}>
                {SECTIONS.find((s) => s.id === activeSec)?.label} — Matrix Summary ({dayResults.filter((r) => r.section === activeSec).length} exams)
              </span>
            </div>

            <button onClick={() => handlePrint(SECTIONS.find((s) => s.id === activeSec))} style={Btn("accent", { height: 30, fontSize: 11.5 })}>
              Print Section PDF
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            {(() => {
              const secR = dayResults.filter((r) => r.section === activeSec);
              const testNames = [...new Set(secR.flatMap((r) => (r.lines || []).map((l) => l.testName)))];

              return (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, textAlign: "left" }}>
                  <thead>
                    <tr style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, color: C.muted, fontSize: 10.5, fontWeight: 700, textTransform: "uppercase" }}>
                      <th style={{ padding: "10px 12px", width: 30 }}>No.</th>
                      <th style={{ padding: "10px 12px" }}>Patient Name</th>
                      <th style={{ padding: "10px 12px" }}>DOB</th>
                      <th style={{ padding: "10px 12px" }}>Age/Sex</th>
                      <th style={{ padding: "10px 12px" }}>Ward</th>
                      <th style={{ padding: "10px 12px" }}>Address</th>
                      {testNames.map((tn) => (
                        <th key={tn} style={{ padding: "10px 12px", textAlign: "center" }}>
                          {tn}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {secR.map((r, i) => {
                      const pt = getP(r.patientId);
                      return (
                        <tr key={r.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                          <td style={{ padding: "10px 12px", color: C.muted }}>{i + 1}</td>
                          <td style={{ padding: "10px 12px", fontWeight: 600, color: C.text }}>{pt ? pt.name : "Unknown"}</td>
                          <td style={{ padding: "10px 12px", color: C.muted }}>{pt ? fmtDate(pt.dob) : "—"}</td>
                          <td style={{ padding: "10px 12px", color: C.muted }}>{pt ? `${pt.age || calcAge(pt.dob)} / ${pt.gender || "—"}` : "—"}</td>
                          <td style={{ padding: "10px 12px", color: C.muted }}>{r.ward || "OP"}</td>
                          <td style={{ padding: "10px 12px", color: C.muted }}>{pt ? pt.address : "—"}</td>
                          {testNames.map((tn) => {
                            const line = (r.lines || []).find((l) => l.testName === tn);
                            const val = line?.value || "—";
                            const flag = line?.flag;
                            return (
                              <td
                                key={tn}
                                style={{
                                  padding: "10px 12px",
                                  textAlign: "center",
                                  fontWeight: 700,
                                  color: flag === "HI" ? C.danger : flag === "LO" ? C.accent : C.text,
                                }}
                              >
                                {val} {flag && <span style={{ fontSize: 9.5, padding: "1px 4px", borderRadius: 4, background: flag === "HI" ? C.dangerLight : C.accentLight, color: flag === "HI" ? C.danger : C.accent, marginLeft: 2 }}>{flag}</span>}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              );
            })()}
          </div>
        </Card>
      )}
    </div>
  );
}
````

## File: src/components/views/TemplatesView.jsx
````javascript
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
                  <button onClick={() => setSigs(sigs.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: 12, fontWeight: 700 }}>×</button>
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
                  <button onClick={(e) => { e.stopPropagation(); deleteFloatImg(img.id); }} style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontWeight: 700 }}>×</button>
                </div>
              ))}
              {floatTexts.map((ft) => (
                <div key={ft.id} onClick={() => { setSelTxt(ft.id); setSelImg(null); setSelBlock(null); }} style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 4px", borderRadius: 3, cursor: "pointer", background: selTxt === ft.id ? "#f0f9ff" : "transparent", marginBottom: 2, fontSize: 9 }}>
                  <span style={{ flex: 1, color: ft.color || C.text, fontWeight: ft.bold ? 700 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ft.text || "(empty)"}</span>
                  <button onClick={(e) => { e.stopPropagation(); setFloatTexts((p) => p.filter((t) => t.id !== ft.id)); if (selTxt === ft.id) setSelTxt(null); }} style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontWeight: 700 }}>×</button>
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
                      <div onClick={(e) => { e.stopPropagation(); deleteFloatImg(img.id); }} style={{ position: "absolute", top: -8, right: -8, width: 16, height: 16, borderRadius: "50%", background: C.red, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 900, cursor: "pointer" }}>×</div>
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
                      <div onClick={(e) => { e.stopPropagation(); deleteFloatImg(img.id); }} style={{ position: "absolute", top: -8, right: -8, width: 16, height: 16, borderRadius: "50%", background: C.red, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 900, cursor: "pointer" }}>×</div>
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
                    <div onClick={(e) => { e.stopPropagation(); setFloatTexts((p) => p.filter((t) => t.id !== ft.id)); setSelTxt(null); }} style={{ position: "absolute", top: -8, right: -8, width: 14, height: 14, borderRadius: "50%", background: C.red, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 900, cursor: "pointer" }}>
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
````

## File: src/components/views/WelcomePage.jsx
````javascript
import React, { useState } from "react";
import { C, Btn, inp, Field, Card } from "../../utils/helpers.jsx";
import { Icon } from "../common/Icons.jsx";

export function WelcomePage({ hospital = {}, onSave }) {
  const [name, setName] = useState(hospital.name || "");
  const [address, setAddress] = useState(hospital.address || "");
  const [phone, setPhone] = useState(hospital.phone || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter your facility name.");
      return;
    }
    onSave({
      ...hospital,
      name: name.trim(),
      address: address.trim(),
      phone: phone.trim(),
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: C.primary, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Card style={{ width: "100%", maxWidth: 500, padding: 32, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.3)" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: C.accentLight, color: C.accent, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
            <Icon name="hospital" size={32} color={C.accent} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: "0 0 6px 0" }}>Welcome to MedLIMS</h2>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>
            Let's set up your clinical laboratory facility details.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Field label="Facility / Hospital Name *">
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. City General Hospital Laboratory" style={inp({ width: "100%", fontWeight: 600 })} required autoFocus />
          </Field>

          <Field label="Address">
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="e.g. 123 Health Ave, Metro City" style={inp({ width: "100%" })} />
          </Field>

          <Field label="Contact Phone Number">
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. (02) 8123-4567" style={inp({ width: "100%" })} />
          </Field>

          <button type="submit" style={Btn("accent", { width: "100%", height: 42, justifyContent: "center", fontSize: 14, marginTop: 8 })}>
            Complete Setup & Start LIMS
          </button>
        </form>
      </Card>
    </div>
  );
}
````

## File: electron/main.js
````javascript
const { app, BrowserWindow, shell, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { exec, execFile } = require('child_process');

let mainWindow;
let pdfWindow = null;

// Windows 7 compatibility — only apply on Win7 (6.1)
const winVer = os.release();
const isWin7 = process.platform === 'win32' && winVer.startsWith('6.1');
if (isWin7) {
  app.commandLine.appendSwitch('no-sandbox');
  app.commandLine.appendSwitch('disable-gpu');
  app.commandLine.appendSwitch('disable-software-rasterizer');
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'MedLIMS',
    icon: path.join(__dirname, '../icons/icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    autoHideMenuBar: true,
    show: false,
    backgroundColor: '#ffffff',
  });

  mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // ── Block DevTools in production builds ──
  if (app.isPackaged) {
    // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    mainWindow.webContents.on('before-input-event', (event, input) => {
      if (input.key === 'F12') { event.preventDefault(); return; }
      if (input.control && input.shift && input.key.toLowerCase() === 'i') { event.preventDefault(); return; }
      if (input.control && input.shift && input.key.toLowerCase() === 'j') { event.preventDefault(); return; }
      if (input.control && input.key.toLowerCase() === 'u') { event.preventDefault(); return; }
    });
    // Block right-click Inspect Element
    mainWindow.webContents.on('context-menu', (event) => { event.preventDefault(); });
    // Force-close DevTools if somehow opened
    mainWindow.webContents.on('devtools-opened', () => { mainWindow.webContents.closeDevTools(); });
  }

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Get PDF save folder — use custom path if set, otherwise default
const CUSTOM_PATH_FILE = path.join(app.getPath('userData'), 'pdf_save_path.txt');
function getPDFFolder() {
  // Check for custom path
  try {
    if (fs.existsSync(CUSTOM_PATH_FILE)) {
      const custom = fs.readFileSync(CUSTOM_PATH_FILE, 'utf8').trim();
      if (custom && fs.existsSync(custom)) {
        return custom;
      }
    }
  } catch(e) {}
  const folder = path.join(app.getPath('userData'), 'Saved PDFs');
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
  return folder;
}

ipcMain.handle('get-pdf-folder', () => getPDFFolder());

// Set custom PDF save folder
ipcMain.handle('set-pdf-folder', async (event, folderPath) => {
  try {
    if (folderPath) {
      if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });
      fs.writeFileSync(CUSTOM_PATH_FILE, folderPath, 'utf8');
      return { success: true, path: folderPath };
    } else {
      // Reset to default
      if (fs.existsSync(CUSTOM_PATH_FILE)) fs.unlinkSync(CUSTOM_PATH_FILE);
      return { success: true, path: getPDFFolder() };
    }
  } catch(e) {
    return { success: false, error: e.message };
  }
});

// Open folder picker dialog
ipcMain.handle('pick-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: 'Select folder to save PDF results',
  });
  if (result.canceled || !result.filePaths.length) return { canceled: true };
  return { canceled: false, path: result.filePaths[0] };
});

// Open folder in file explorer
ipcMain.handle('open-folder', (event, folderPath) => {
  shell.openPath(folderPath || getPDFFolder());
});

// ── Printer Management ──
const PRINTER_PREFS_FILE = path.join(app.getPath('userData'), 'printer_prefs.json');
function loadPrinterPrefs() {
  try {
    if (fs.existsSync(PRINTER_PREFS_FILE)) return JSON.parse(fs.readFileSync(PRINTER_PREFS_FILE, 'utf8'));
  } catch(e) {}
  return { resultPrinter: '', labelPrinter: '' };
}
function savePrinterPrefs(prefs) {
  try { fs.writeFileSync(PRINTER_PREFS_FILE, JSON.stringify(prefs), 'utf8'); } catch(e) {}
}

// Get list of all printers
ipcMain.handle('get-printers', async () => {
  try {
    const printers = mainWindow.webContents.getPrinters();
    return printers.map(p => ({
      name: p.name,
      displayName: p.displayName || p.name,
      isDefault: p.isDefault,
      status: p.status,
    }));
  } catch(e) {
    return [];
  }
});

// Get saved printer preferences
ipcMain.handle('get-printer-prefs', () => loadPrinterPrefs());

// Save printer preferences
ipcMain.handle('set-printer-prefs', (event, prefs) => {
  savePrinterPrefs(prefs);
  return { success: true };
});

// Print label HTML to a specific printer (for barcode/thermal labels)
ipcMain.handle('print-label', (event, htmlContent, printerName) => {
  return new Promise((resolve) => {
    try {
      const labelWin = new BrowserWindow({
        width: 400,
        height: 300,
        show: true,
        skipTaskbar: true,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: false,
        },
        autoHideMenuBar: true,
        backgroundColor: '#ffffff',
      });

      // Position off-screen-ish
      labelWin.setPosition(-2000, 0);

      const tempPath = path.join(app.getPath('temp'), 'medlims_label_' + Date.now() + '.html');
      fs.writeFileSync(tempPath, htmlContent);
      labelWin.loadFile(tempPath);

      labelWin.webContents.once('did-finish-load', () => {
        setTimeout(() => {
          const printOpts = {
            silent: true,
            printBackground: true,
            color: true,
            margins: { marginType: 'none' },
          };
          if (printerName) printOpts.deviceName = printerName;
          labelWin.webContents.print(printOpts, (success) => {
            labelWin.close();
            try { fs.unlinkSync(tempPath); } catch(e) {}
            resolve({ success });
          });
        }, 800);
      });

      setTimeout(() => {
        if (labelWin && !labelWin.isDestroyed()) {
          labelWin.close();
          try { fs.unlinkSync(tempPath); } catch(e) {}
          resolve({ success: false, error: 'timeout' });
        }
      }, 15000);
    } catch(e) {
      resolve({ success: false, error: e.message });
    }
  });
});

ipcMain.handle('save-pdf', (event, filename, base64data) => {
  try {
    const folder = getPDFFolder();
    const filePath = path.join(folder, filename);
    const buffer = Buffer.from(base64data, 'base64');
    fs.writeFileSync(filePath, buffer);
    return { success: true, filePath, filename };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

// Open PDF in the built-in viewer (single result print)
ipcMain.handle('print-pdf', (event, filePath, filename) => {
  try {
    if (pdfWindow && !pdfWindow.isDestroyed()) {
      pdfWindow.close();
    }

    pdfWindow = new BrowserWindow({
      width: 950,
      height: 750,
      minWidth: 600,
      minHeight: 500,
      title: 'MedLIMS — PDF Viewer',
      icon: path.join(__dirname, '../icons/icon.ico'),
      parent: mainWindow,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: false,
        plugins: true,
        webSecurity: false,
      },
      autoHideMenuBar: true,
      backgroundColor: '#1a1a2e',
    });

    const viewerPath = path.join(__dirname, 'pdf-viewer.html');
    const encodedPath = encodeURIComponent(filePath);
    const encodedName = encodeURIComponent(filename || path.basename(filePath));
    pdfWindow.loadURL(`file://${viewerPath}?file=${encodedPath}&name=${encodedName}`);

    pdfWindow.on('closed', () => {
      pdfWindow = null;
    });

    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

// Silent print — uses OS-level print, optionally to a specific printer
ipcMain.handle('silent-print-pdf', (event, filePath, printerName) => {
  return new Promise((resolve) => {
    try {
      if (process.platform === 'win32') {
        const prefs = loadPrinterPrefs();
        const targetPrinter = printerName || prefs.resultPrinter || '';
        
        // Try Adobe Reader / Foxit with specific printer
        const tryPaths = [
          'C:\\Program Files (x86)\\Adobe\\Acrobat Reader DC\\Reader\\AcroRd32.exe',
          'C:\\Program Files\\Adobe\\Acrobat Reader DC\\Reader\\AcroRd32.exe',
          'C:\\Program Files (x86)\\Adobe\\Reader 11.0\\Reader\\AcroRd32.exe',
          'C:\\Program Files (x86)\\Foxit Software\\Foxit PDF Reader\\FoxitPDFReader.exe',
        ];
        
        let found = false;
        for (const readerPath of tryPaths) {
          if (fs.existsSync(readerPath)) {
            found = true;
            // /t file printer = print to specific printer
            const args = targetPrinter
              ? ['/t', filePath, targetPrinter]
              : ['/t', filePath];
            execFile(readerPath, args, { timeout: 30000 }, () => {
              resolve({ success: true });
            });
            break;
          }
        }
        
        if (!found) {
          const cmd = `powershell -Command "Start-Process -FilePath '${filePath.replace(/'/g, "''")}' -Verb Print"`;
          exec(cmd, { timeout: 15000 }, () => resolve({ success: true }));
        }
      } else {
        const cmd = printerName ? `lp -d "${printerName}" "${filePath}"` : `lp "${filePath}"`;
        exec(cmd, () => resolve({ success: true }));
      }
    } catch (e) {
      resolve({ success: false, error: e.message });
    }
  });
});

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  app.quit();
});
````

## File: electron/pdf-viewer.html
````html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>MedLIMS — PDF Viewer</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', sans-serif; background: #1a1a2e; display: flex; flex-direction: column; height: 100vh; overflow: hidden; }

    /* Toolbar */
    #toolbar {
      background: linear-gradient(135deg, #1a0000, #6b0000);
      padding: 10px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
    }

    #toolbar .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-right: 8px;
    }

    #toolbar .logo span {
      color: #fff;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }

    #toolbar .divider {
      width: 1px;
      height: 28px;
      background: rgba(255,255,255,0.2);
    }

    #filename {
      color: rgba(255,255,255,0.75);
      font-size: 12px;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 7px 16px;
      border: none;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.15s, transform 0.1s;
      font-family: inherit;
      flex-shrink: 0;
    }
    .btn:hover { opacity: 0.88; }
    .btn:active { transform: scale(0.97); }

    .btn-print {
      background: #fff;
      color: #8b0000;
    }

    .btn-close {
      background: rgba(255,255,255,0.12);
      color: #fff;
    }

    /* PDF Frame */
    #pdf-frame {
      flex: 1;
      width: 100%;
      border: none;
      background: #525659;
    }

    /* Keyboard hint */
    #hint {
      background: rgba(0,0,0,0.6);
      color: rgba(255,255,255,0.5);
      text-align: center;
      font-size: 10px;
      padding: 4px;
      flex-shrink: 0;
      letter-spacing: 0.3px;
    }

    /* When printing — hide toolbar and hint, show only PDF */
    @media print {
      #toolbar, #hint { display: none !important; }
      body { background: #fff !important; }
      #pdf-frame { position: fixed; top: 0; left: 0; width: 100%; height: 100%; }
    }
  </style>
</head>
<body>

  <div id="toolbar">
    <div class="logo">
      <span>🏥 MedLIMS</span>
    </div>
    <div class="divider"></div>
    <span id="filename">Loading...</span>
    <button class="btn btn-print" onclick="printPDF()" title="Print (Ctrl+P)">
      🖨️ Print
    </button>
    <button class="btn btn-close" onclick="window.close()" title="Close">
      ✕ Close
    </button>
  </div>

  <iframe id="pdf-frame" src=""></iframe>

  <div id="hint">Tip: Click Print or press Ctrl+P to print directly</div>

  <script>
    // Get PDF path from URL query string
    const params = new URLSearchParams(window.location.search);
    const pdfPath = params.get('file');
    const pdfName = params.get('name') || 'Report.pdf';
    const isLandscape = params.get('landscape') === '1';
    const isSilent = params.get('silent') === '1';

    if (isLandscape) {
      const style = document.createElement('style');
      style.textContent = '@page { size: landscape; margin: 8mm; }';
      document.head.appendChild(style);
    }

    // Hide toolbar and hint for silent/batch printing
    if (isSilent) {
      document.getElementById('toolbar').style.display = 'none';
      document.getElementById('hint').style.display = 'none';
      document.body.style.background = '#fff';
    }

    if (pdfPath) {
      document.getElementById('pdf-frame').src = 'file://' + pdfPath;
      document.getElementById('filename').textContent = pdfName;
      document.title = 'MedLIMS — ' + pdfName;
    }

    function printPDF() {
      const frame = document.getElementById('pdf-frame');
      try {
        frame.contentWindow.print();
      } catch(e) {
        // Fallback: print the whole window
        window.print();
      }
    }

    // Ctrl+P shortcut
    document.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        printPDF();
      }
    });
  </script>
</body>
</html>
````

## File: electron/preload.js
````javascript
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  version: process.versions.electron,
  savePDF: (filename, base64data) => ipcRenderer.invoke('save-pdf', filename, base64data),
  printPDF: (filePath, filename) => ipcRenderer.invoke('print-pdf', filePath, filename),
  silentPrintPDF: (filePath, printerName) => ipcRenderer.invoke('silent-print-pdf', filePath, printerName),
  getPDFFolder: () => ipcRenderer.invoke('get-pdf-folder'),
  setPDFFolder: (folderPath) => ipcRenderer.invoke('set-pdf-folder', folderPath),
  pickFolder: () => ipcRenderer.invoke('pick-folder'),
  openFolder: (folderPath) => ipcRenderer.invoke('open-folder', folderPath),
  // Printer management
  getPrinters: () => ipcRenderer.invoke('get-printers'),
  getPrinterPrefs: () => ipcRenderer.invoke('get-printer-prefs'),
  setPrinterPrefs: (prefs) => ipcRenderer.invoke('set-printer-prefs', prefs),
  printLabel: (html, printerName) => ipcRenderer.invoke('print-label', html, printerName),
});
````

## File: scripts/dummy-sign.js
````javascript
exports.default = async function() {
  console.log('✓ Custom signer: Bypassing Wine code signing on Linux Codespaces.');
  return true;
};
````

## File: src/constants/data.js
````javascript
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
````

## File: src/utils/helpers.js
````javascript
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
````

## File: src/utils/helpers.jsx
````javascript
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
````

## File: src/utils/pdfGenerator.js
````javascript
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
    ["Patient Name:", patient?.name || "—"],
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
  if (result?.remarks) {
    const remarkY = Math.min(lastTableFinalY + 4, SIG_Y - 14);
    doc.setFont("times", "bold"); doc.setFontSize(8); doc.setTextColor(...black);
    doc.text("REMARKS / CLINICAL IMPRESSION:", 10, remarkY);
    doc.setFont("times", "italic"); doc.setFontSize(8); doc.setTextColor(...grey);
    const remarkLines = doc.splitTextToSize(result.remarks, W - 40);
    doc.text(remarkLines, 60, remarkY);
  }

  // 9. Signatures Block
  const sigFS = fsMM("signatures", 8);
  const staffArr = Array.isArray(staff) ? staff : [];
  const getEsig = (name) => staffArr.find((s) => s.name === name)?.eSignature || null;
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

  const safeName = (patient?.name || "Patient").replace(/[^a-zA-Z0-9]/g, "_");
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
````

## File: src/main.jsx
````javascript
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
````

## File: .gitignore
````
node_modules/
dist/
release/
*.log
.env
````

## File: HOW-TO-BUILD.md
````markdown
# MedLIMS — Build Guide
### Created by Bryce Men Kenk C. Ablir, RMT

---

## Prerequisites
Make sure these are installed:
- Node.js (https://nodejs.org)
- Run `npm install` once before building

---

## Build Commands

Open CMD in the `medlims-electron` folder and run:

---

### Windows 7 (32-bit only)
```
npm run dist:win7-x86
```
Output: `release/win7-x86/MedLIMS-Setup-Win7-x86.exe`
Use this for: Old PCs, Windows 7 32-bit

---

### Windows 10/11 — 32-bit (x86)
```
npm run dist:win10-x86
```
Output: `release/win10/MedLIMS-Setup-Win10-ia32.exe`
Use this for: Windows 10/11 older/32-bit PCs

---

### Windows 10/11 — 64-bit (x64)
```
npm run dist:win10-x64
```
Output: `release/win10/MedLIMS-Setup-Win10-x64.exe`
Use this for: Modern Windows 10/11 PCs (most common)

---

### Windows 10/11 — Both x86 AND x64 at once
```
npm run dist:win10-both
```
Output: Both files above in `release/win10/`

---

## Which one should I use?

| Computer | Use this installer |
|---|---|
| Windows 7 | MedLIMS-Setup-Win7-x86.exe |
| Windows 10/11 older PC | MedLIMS-Setup-Win10-ia32.exe |
| Windows 10/11 modern PC | MedLIMS-Setup-Win10-x64.exe |
| Not sure (Win10/11) | Use x64 — most PCs today are 64-bit |

---

## How to check if a PC is 32 or 64 bit (Windows 10)
1. Right-click **This PC** → Properties
2. Look for **System type**
3. It will say "32-bit operating system" or "64-bit operating system"
````

## File: index.html
````html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MedLIMS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
````

## File: SETUP-GUIDE.md
````markdown
# MedLIMS — Electron Edition
## Windows 7 x32 Compatible — Direct Install, No Browser Needed

---

## What You Need (One-Time Setup on Your Build PC)

Install these on your **MAIN PC** (not the Win7 PC):

1. **Node.js v18 LTS (64-bit)** — for building only
   → https://nodejs.org/en/download (choose Windows x64)

2. **Git for Windows** (optional but helpful)
   → https://git-scm.com/download/win

---

## Step 1 — Install Dependencies

Open Command Prompt inside this folder and run:

```
npm install
```

---

## Step 2 — Build the Installer

To build a Windows 32-bit installer (.exe) that works on Windows 7:

```
npm run dist:win32
```

This will create:
```
release/
  MedLIMS Setup 1.0.0.exe   ← This is the installer!
```

---

## Step 3 — Install on Windows 7

1. Copy `MedLIMS Setup 1.0.0.exe` to the Windows 7 PC
2. Double-click to install — no Node.js, no browser, no CMD needed!
3. A desktop shortcut will be created automatically
4. Click the shortcut to open MedLIMS

✅ Works completely OFFLINE
✅ Data saved locally on each PC
✅ No internet required after installation

---

## Notes

- The installer bundles Chromium (browser engine) inside — that's why it's ~150MB
- Data is stored in: `C:\Users\[Username]\AppData\Roaming\MedLIMS\`
- To uninstall: Control Panel → Programs → MedLIMS → Uninstall

---

## Development Mode (on your build PC)

To run in development (live reload):
```
npm run dev
```

---

## Troubleshooting

**"electron-builder" error on build:**
→ Run `npm install` again, then retry

**"NSIS" error:**
→ electron-builder downloads NSIS automatically. Make sure you have internet on your build PC.

**App won't open on Win7:**
→ Make sure Windows 7 SP1 is installed with all Windows Updates

---

Created for MedLIMS by Bryce Men Kenk C. Ablir, RMT
````

## File: vite.config.js
````javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: "dist",
    target: "es2015",
    cssTarget: "chrome49",
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  esbuild: {
    target: "es2015",
  },
});
````

## File: src/App.jsx
````javascript
import React, { useState, useEffect } from "react";
import { SECTIONS, DEFAULT_TESTS, dbLoad, dbSave, loadLicense, verifyLicenseSig, licenseStatus } from "./constants/data.js";
import { C, toInputDate, dbLoadChunked, dbSaveChunked, uid } from "./utils/helpers.jsx";
import { downloadResultAsPDF, generateResultPDFDataUri } from "./utils/pdfGenerator.js";
import { Icon } from "./components/common/Icons.jsx";

import { SerialKeyGate, LicenseExpiredGate } from "./components/gates/SerialKeyGate.jsx";
import { SwitchProfileModal } from "./components/common/SwitchProfileModal.jsx";
import { PDFPreviewModal } from "./components/common/PDFPreviewModal.jsx";
import { DashboardView } from "./components/views/DashboardView.jsx";
import { LabEntry } from "./components/views/LabEntry.jsx";
import { SummaryView } from "./components/views/SummaryView.jsx";
import { ReportsView } from "./components/views/ReportsView.jsx";
import { PatientsView } from "./components/views/PatientsView.jsx";
import { PersonnelView } from "./components/views/PersonnelView.jsx";
import { ParametersView } from "./components/views/ParametersView.jsx";
import { HospitalView } from "./components/views/HospitalView.jsx";
import { WelcomePage } from "./components/views/WelcomePage.jsx";
import { LoginPage } from "./components/views/LoginPage.jsx";
import { AccountsView } from "./components/views/AccountsView.jsx";
import { TemplatesView } from "./components/views/TemplatesView.jsx";
import { BarcodeView } from "./components/views/BarcodeView.jsx";

export default function App() {
  const [licState, setLicState] = useState("loading");
  const [licData, setLicData] = useState(null);
  const [showKeyEntry, setShowKeyEntry] = useState(false);

  useEffect(() => {
    async function checkSavedLicense() {
      const savedLic = loadLicense();
      if (!savedLic) {
        setLicState("none");
        setShowKeyEntry(true);
        return;
      }
      const isSigValid = await verifyLicenseSig(savedLic);
      if (!isSigValid) {
        setLicState("none");
        setShowKeyEntry(true);
        return;
      }
      const status = licenseStatus(savedLic);
      setLicData(savedLic);
      setLicState(status);
      if (status === "valid") {
        setShowKeyEntry(false);
      } else if (status === "expired") {
        setShowKeyEntry(false);
      } else {
        setShowKeyEntry(true);
      }
    }
    checkSavedLicense();
  }, []);

  const handleActivated = () => {
    const savedLic = loadLicense();
    setLicData(savedLic || { type: "lifetime" });
    setLicState("valid");
    setShowKeyEntry(false);
  };

  if (licState === "loading") {
    return (
      <div style={{ minHeight: "100vh", background: "#0d213a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif", fontSize: 14 }}>
        Verifying License…
      </div>
    );
  }

  if (licState === "none" || showKeyEntry) {
    return <SerialKeyGate onActivated={handleActivated} />;
  }

  if (licState === "expired") {
    return <LicenseExpiredGate licType={licData?.type} onReactivate={() => setShowKeyEntry(true)} />;
  }

  return <AppMain licData={licData} />;
}

function AppMain({ licData }) {
  const [view, setView] = useState("dashboard");
  const [barcodeNav, setBarcodeNav] = useState(null);
  const [patients, setPatients] = useState([]);
  const [staff, setStaff] = useState([]);
  const [results, setResults] = useState([]);
  const [tests, setTests] = useState(null);
  const [hospital, setHospital] = useState({ name: "BAIS DISTRICT HOSPITAL", address: "", phone: "", setupDone: false });
  const [accounts, setAccounts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [switchModal, setSwitchModal] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [crossSectionPatientId, setCrossSectionPatientId] = useState("");

  const [previewPdfObj, setPreviewPdfObj] = useState(null);

  const curSection = view.startsWith("lab:") ? view.slice(4) : null;
  const secDef = curSection ? SECTIONS.find(s => s.id === curSection) : null;

  useEffect(() => {
    setPatients(dbLoadChunked("lims_p3", []));
    setStaff(dbLoad("lims_s3", []));
    setResults(dbLoadChunked("lims_r3", []));
    const savedTests = dbLoad("lims_t3", null);
    if (savedTests) {
      const merged = { ...savedTests };
      Object.keys(DEFAULT_TESTS).forEach(k => {
        if (!merged[k] || merged[k].length === 0) merged[k] = JSON.parse(JSON.stringify(DEFAULT_TESTS[k]));
      });
      setTests(merged);
    } else {
      setTests(DEFAULT_TESTS);
    }
    const hi = dbLoad("lims_h3", null);
    if (hi) setHospital(hi);
    const accs = dbLoad("lims_accounts", []);
    if (accs.length === 0) {
      const defaultAccounts = [{ id: uid(), username: "admin", password: "admin123", role: "Admin", name: "Administrator", createdAt: toInputDate() }];
      setAccounts(defaultAccounts);
      dbSave("lims_accounts", defaultAccounts);
    } else {
      setAccounts(accs);
    }
    setLoaded(true);
  }, []);

  const sp = v => { setPatients(v); dbSaveChunked("lims_p3", v); };
  const ss = v => { setStaff(v); dbSave("lims_s3", v); };
  const sr = v => { setResults(v); dbSaveChunked("lims_r3", v); };
  const st = v => { setTests(v); dbSave("lims_t3", v); };
  const sh = v => { setHospital(v); dbSave("lims_h3", v); };
  const sa = v => { setAccounts(v); dbSave("lims_accounts", v); };

  const addResult = r => { const u = [r, ...results]; sr(u); };
  useEffect(() => { if (crossSectionPatientId) setCrossSectionPatientId(""); }, [curSection]);
  const delResult = id => sr(results.filter(r => r.id !== id));
  const editResult = r => sr(results.map(x => x.id === r.id ? r : x));

  const handleTriggerPrint = async (resultObj) => {
    const pt = patients.find(p => p.id === resultObj.patientId);
    try {
      const { dataUri, filename } = await generateResultPDFDataUri(resultObj, pt, hospital, staff);
      setPreviewPdfObj({ dataUri, filename, resultObj, pt });
    } catch (e) {
      console.error(e);
      downloadResultAsPDF(resultObj, pt, hospital, false, staff);
    }
  };

  const handleConfirmPrintFromPreview = () => {
    if (!previewPdfObj) return;
    const { resultObj, pt } = previewPdfObj;
    downloadResultAsPDF(resultObj, pt, hospital, false, staff).then(() => {
      setResults(prev => {
        const updated = prev.map(r => r.id === resultObj.id ? { ...r, printed: true, printedAt: new Date().toISOString() } : r);
        dbSaveChunked("lims_r3", updated);
        return updated;
      });
      setPreviewPdfObj(null);
    });
  };

  if (!loaded || !tests) return <div style={{ padding: 40, textAlign: "center", fontFamily: "'Inter', sans-serif", color: C.muted }}>Loading Enterprise LIMS…</div>;
  if (!hospital.setupDone) return <WelcomePage hospital={hospital} onSave={h => { const v = { ...h, setupDone: true }; sh(v); }}/>;
  if (!currentUser) return <LoginPage accounts={accounts} onLogin={setCurrentUser} hospital={hospital}/>;

  const isAdmin = currentUser?.role === "Admin";
  const navItems = [
    { id: "dashboard",   icon: "dashboard",  label: "Dashboard" },
    { id: "patients",    icon: "patients",   label: "Patients" },
    { id: "personnel",   icon: "personnel",  label: "Personnel" },
    { id: "parameters",  icon: "parameters", label: "Parameters" },
    { id: "templates",   icon: "templates",  label: "Templates" },
    { id: "reports",     icon: "reports",    label: "Reports" },
    { id: "summary",     icon: "summary",    label: "Summary" },
    { id: "barcode",     icon: "barcode",    label: "Barcode" },
    { id: "hospitalinfo",icon: "hospitalinfo", label: "Hospital Info" },
    ...(isAdmin ? [{ id: "accounts", icon: "accounts", label: "User Accounts" }] : []),
  ];

  return (
    <div style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontSize: 13, background: C.bg, height: "100vh", display: "flex", flexDirection: "column", color: C.text, overflow: "hidden" }}>
      
      {/* ── 1. TOP HEADER BAR ── */}
      <header style={{ background: "#0d213a", color: "#fff", padding: "0 20px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.2)", zIndex: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.2)" }}>
            <Icon name="hospital" size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 14, letterSpacing: "0.02em", color: "#fff", lineHeight: 1.2 }}>
              {hospital.name || "BAIS DISTRICT HOSPITAL"}
            </div>
            <div style={{ fontSize: 9.5, color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, marginTop: 1 }}>
              CLINICAL INFORMATION SYSTEM
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <HeaderClock />
          <div style={{ width: 1, height: 26, background: "rgba(255,255,255,0.15)" }} />
          
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 12 }}>
              {(currentUser.name || currentUser.username || "AD").slice(0, 2).toUpperCase()}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: "#fff", lineHeight: 1.1 }}>{currentUser.name || "Administrator"}</span>
              <span style={{ fontSize: 11, color: "#93c5fd", fontWeight: 500, marginTop: 2 }}>{currentUser.role || "Admin"}</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginLeft: 6 }}>
            <button onClick={() => setSwitchModal(true)} style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
              <Icon name="switch" size={14} color="#fff" /> Switch
            </button>
            <button onClick={() => setCurrentUser(null)} style={{ background: "#dc2626", color: "#fff", border: "none", borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
              <Icon name="logout" size={14} color="#fff" /> Exit
            </button>
          </div>
        </div>
      </header>

      {/* ── 2. SIDEBAR & MAIN BODY ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        
        {/* Dark Navy Sidebar */}
        <aside style={{ width: 220, background: "#0b1d33", display: "flex", flexDirection: "column", padding: "16px 12px", borderRight: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0 10px 12px 10px" }}>
            CORE MODULES
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1, overflowY: "auto" }}>
            {navItems.map(n => {
              const active = view === n.id || (n.id === "dashboard" && curSection !== null);
              return (
                <button
                  key={n.id}
                  onClick={() => setView(n.id)}
                  style={{
                    width: "100%",
                    background: active ? "#2563eb" : "transparent",
                    border: "none",
                    borderRadius: 8,
                    color: active ? "#ffffff" : "#94a3b8",
                    padding: "10px 14px",
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    fontSize: 13,
                    fontWeight: active ? 700 : 500,
                    transition: "all .15s ease-in-out"
                  }}
                >
                  <Icon name={n.icon} size={18} color={active ? "#ffffff" : "#94a3b8"} />
                  <span>{n.label}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Content View Area */}
        <main style={{ flex: 1, padding: 24, overflowY: "auto", background: C.bg }}>
          {view === "dashboard" && <DashboardView results={results} patients={patients} sections={SECTIONS} onNav={setView} onPrint={handleTriggerPrint}/>}
          {curSection && <LabEntry key={curSection} section={curSection} secDef={secDef} tests={tests} patients={patients} staff={staff} results={results} hospital={hospital} onSave={addResult} onPrint={handleTriggerPrint} onSwitchSection={(v, pId) => { if (pId) setCrossSectionPatientId(pId); setView(v); }} preSelectedTests={barcodeNav?.section === curSection ? barcodeNav.testIds : null} prePatientId={barcodeNav?.section === curSection ? barcodeNav.patientId : crossSectionPatientId}/>}
          {view === "reports" && <ReportsView results={results} patients={patients} staff={staff} onPrint={handleTriggerPrint} onBatchPrint={q => q.forEach(handleTriggerPrint)} onDelete={delResult} onEdit={editResult}/>}
          {view === "patients" && <PatientsView data={patients} onSave={sp}/>}
          {view === "personnel" && <PersonnelView data={staff} onSave={ss}/>}
          {view === "parameters" && <ParametersView tests={tests} onSave={st}/>}
          {view === "templates" && <TemplatesView sections={SECTIONS} hospital={hospital}/>}
          {view === "summary" && <SummaryView results={results} patients={patients} hospital={hospital}/>}
          {view === "hospitalinfo" && <HospitalView data={hospital} onSave={sh}/>}
          {view === "accounts" && <AccountsView accounts={accounts} onSave={sa}/>}
          {view === "barcode" && <BarcodeView patients={patients} tests={tests} sections={SECTIONS} onNav={(v, bNav) => { if (bNav) setBarcodeNav(bNav); setView(v); }}/>}
        </main>
      </div>

      {switchModal && <SwitchProfileModal accounts={accounts} currentUser={currentUser} onSwitch={u => { setCurrentUser(u); setSwitchModal(false); }} onClose={() => setSwitchModal(false)}/>}

      {previewPdfObj && (
        <PDFPreviewModal
          pdfDataUri={previewPdfObj.dataUri}
          filename={previewPdfObj.filename}
          onPrint={handleConfirmPrintFromPreview}
          onClose={() => setPreviewPdfObj(null)}
        />
      )}
    </div>
  );
}

function HeaderClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ textAlign: "right" }}>
      <div style={{ fontSize: 13, fontWeight: 700, fontVariantNumeric: "tabular-nums", letterSpacing: ".02em", color: "#fff", lineHeight: 1.1 }}>
        {time.toLocaleTimeString("en-US", { hour12: false })}
      </div>
      <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2, fontWeight: 500 }}>
        {time.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
      </div>
    </div>
  );
}
````

## File: package.json
````json
{
  "name": "medlims",
  "version": "1.0.0",
  "description": "MedLIMS - Laboratory Information Management System",
  "main": "electron/main.js",
  "scripts": {
    "dev": "concurrently \"vite\" \"wait-on http://localhost:5173 && electron .\"",
    "build": "vite build",
    "electron": "electron .",
    "obfuscate": "echo 'Skipping obfuscation'",
    "dist:win10-x64": "npm run build && npx electron-builder --win zip --x64 -c.directories.output=release/win10"
  },
  "author": "Bryce Men Kenk C. Ablir, RMT",
  "license": "ISC",
  "dependencies": {
    "better-sqlite3": "^13.0.2",
    "dexie": "^4.4.4",
    "jspdf": "^2.5.1",
    "jspdf-autotable": "^3.8.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "concurrently": "^8.2.2",
    "electron": "22.3.27",
    "electron-builder": "^24.13.3",
    "javascript-obfuscator": "^5.3.0",
    "vite": "^5.4.0",
    "wait-on": "^7.2.0"
  }
}
````
