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
