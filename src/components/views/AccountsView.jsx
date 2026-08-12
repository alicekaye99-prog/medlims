import React, { useState } from "react";
import { C, Btn, inp, Field, Card, CardHead, uid, toInputDate } from "../../utils/helpers.jsx";
import { Icon } from "../common/Icons.jsx";

export function AccountsView({ accounts = [], onSave, currentUser }) {
  const ROLES = ["Admin", "Staff", "Viewer"];
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAcc, setEditingAcc] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const isAdmin = currentUser?.role === "Admin";

  const handleOpenAdd = () => {
    setEditingAcc(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (acc) => {
    setEditingAcc(acc);
    setModalOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    onSave(accounts.filter((a) => a.id !== deleteTarget));
    setDeleteTarget(null);
  };

  const handleSaveAccount = (accObj) => {
    const dup = accounts.find(
      (a) => a.username.toLowerCase() === accObj.username.toLowerCase() && a.id !== accObj.id
    );
    if (dup) {
      alert(`Username "${accObj.username}" is already taken.`);
      return;
    }

    if (editingAcc) {
      onSave(accounts.map((a) => (a.id === accObj.id ? accObj : a)));
    } else {
      onSave([...accounts, accObj]);
    }
    setModalOpen(false);
  };

  const roleBadge = (role) => {
    const map = {
      Admin: { bg: "#fef3c7", color: "#92400e" },
      Staff: { bg: "#dbeafe", color: "#1e40af" },
      Viewer: { bg: "#f0fdf4", color: "#166534" },
    };
    return map[role] || { bg: "#f3f4f6", color: "#374151" };
  };

  const deleteAcc = deleteTarget ? accounts.find((a) => a.id === deleteTarget) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 28, maxWidth: 400, width: "90%", boxShadow: "0 20px 50px rgba(0,0,0,0.3)", textAlign: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: C.dangerLight, color: C.danger, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px auto" }}>
              <Icon name="reports" size={24} color={C.danger} />
            </div>
            <div style={{ fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 6 }}>Delete User Account?</div>
            <div style={{ fontSize: 12.5, color: C.muted, marginBottom: 20 }}>
              Are you sure you want to delete <strong>{deleteAcc?.name}</strong> (@{deleteAcc?.username})? This action cannot be undone.
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button style={Btn("ghost")} onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button style={Btn("danger", { background: C.danger, color: "#fff" })} onClick={confirmDelete}>Delete Account</button>
            </div>
          </div>
        </div>
      )}

      <Card style={{ padding: "16px 20px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="accounts" size={22} color={C.accent} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: C.text }}>System User Accounts</div>
            <div style={{ fontSize: 11.5, color: C.muted }}>Manage login credentials, roles, and system access permissions</div>
          </div>
        </div>

        {isAdmin && (
          <button onClick={handleOpenAdd} style={Btn("accent", { height: 38 })}>
            ➕ Create User Account
          </button>
        )}
      </Card>

      <Card>
        <CardHead title="Role Permissions Legend" icon={<Icon name="hospitalinfo" size={18} color={C.accent} />} />
        <div style={{ padding: 16, display: "flex", gap: 24, flexWrap: "wrap" }}>
          {[
            { role: "Admin", desc: "Full administrative access — manage accounts, parameters, settings, and templates" },
            { role: "Staff", desc: "Standard clinical access — register patients, enter test results, and print reports" },
            { role: "Viewer", desc: "Read-only access — inspect reports and summary matrices without editing privileges" },
          ].map(({ role, desc }) => {
            const b = roleBadge(role);
            return (
              <div key={role} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 700, background: b.bg, color: b.color }}>
                  {role}
                </span>
                <span style={{ fontSize: 12, color: C.muted }}>{desc}</span>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <CardHead title={`Registered Profiles (${accounts.length})`} sub="List of authorized system user profiles" icon={<Icon name="accounts" size={18} color={C.accent} />} />
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
              {accounts.map((a) => {
                const b = roleBadge(a.role);
                const isSelf = a.id === currentUser?.id;
                const isProtected = a.username.toLowerCase() === "admin";

                return (
                  <tr key={a.id} style={{ borderBottom: `1px solid ${C.border}`, background: isSelf ? C.accentLight : "#fff" }}>
                    <td style={{ padding: "12px 16px", fontWeight: 600, color: C.text }}>
                      {a.name || a.username}
                      {isSelf && (
                        <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 10, background: C.accentMid, color: C.primary }}>
                          You
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "12px 16px", color: C.accent, fontWeight: 600, fontFamily: "monospace" }}>@{a.username}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: 12, background: b.bg, color: b.color, fontSize: 11, fontWeight: 700 }}>
                        {a.role}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", color: C.muted }}>{a.createdAt || "—"}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right" }}>
                      {isAdmin && (
                        <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                          <button onClick={() => handleOpenEdit(a)} style={Btn("ghost", { height: 28, padding: "0 10px", fontSize: 11 })}>
                            Edit
                          </button>
                          {!isSelf && !isProtected && (
                            <button onClick={() => setDeleteTarget(a.id)} style={Btn("danger", { height: 28, padding: "0 10px", fontSize: 11 })}>
                              Delete
                            </button>
                          )}
                          {isProtected && (
                            <span style={{ fontSize: 11, color: C.faint, fontStyle: "italic", padding: "4px 8px" }}>Protected</span>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {modalOpen && (
        <AccountFormModal
          account={editingAcc}
          roles={ROLES}
          onSave={handleSaveAccount}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}

function AccountFormModal({ account, roles = [], onSave, onClose }) {
  const [name, setName] = useState(account ? account.name || "" : "");
  const [username, setUsername] = useState(account ? account.username || "" : "");
  const [password, setPassword] = useState(account ? account.password || "" : "");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState(account ? account.role || "Staff" : "Staff");

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
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password"
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

            <Field label="Role Permission">
              <select value={role} onChange={(e) => setRole(e.target.value)} style={inp({ width: "100%" })}>
                {roles.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
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
