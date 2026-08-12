import React, { useState } from "react";
import { C, Btn, inp, Field, Card, CardHead, uid } from "../../utils/helpers.jsx";
import { Icon } from "../common/Icons.jsx";

export function PersonnelView({ data = [], onSave }) {
  const ROLES = ["Physician", "Pathologist", "Medical Technologist", "Lab Aide", "Nurse", "Admin", "Receptionist"];
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filterRole, setFilterRole] = useState("");

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

  const filtered = filterRole ? data.filter((s) => s.role === filterRole) : data;
  const keyRoles = ["Physician", "Pathologist", "Medical Technologist"];

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

      <div style={{ background: "#fefce8", border: "1px solid #fde68a", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#92400e", display: "flex", alignItems: "center", gap: 8 }}>
        <Icon name="hospitalinfo" size={16} color="#92400e" />
        <span>Staff with roles <strong>Physician</strong>, <strong>Pathologist</strong>, and <strong>Medical Technologist</strong> automatically appear as dropdown suggestions in result entry forms.</span>
      </div>

      <Card>
        <CardHead
          title={`Staff Registry (${filtered.length})`}
          sub="List of authorized laboratory personnel and physicians"
          icon={<Icon name="personnel" size={18} color={C.accent} />}
          right={
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 12, color: C.muted }}>Filter:</span>
              <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} style={inp({ width: 180 })}>
                <option value="">All Roles</option>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          }
        />

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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: 24, textAlign: "center", color: C.muted }}>
                    No personnel added yet. Click <strong>Add Personnel</strong> to register staff or physicians.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "12px 16px", fontWeight: 600, color: C.text }}>{s.name}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ padding: "2px 8px", borderRadius: 6, background: keyRoles.includes(s.role) ? C.accentLight : C.surface, color: keyRoles.includes(s.role) ? C.accent : C.muted, fontSize: 11, fontWeight: 600, border: `1px solid ${C.border}` }}>
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
          roles={ROLES}
          onSave={handleSaveStaff}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}

function StaffFormModal({ item, roles = [], onSave, onClose }) {
  const [name, setName] = useState(item ? item.name : "");
  const [role, setRole] = useState(item ? item.role || "Medical Technologist" : "Medical Technologist");
  const [licenseNo, setLicenseNo] = useState(item ? item.licenseNo || "" : "");
  const [phone, setPhone] = useState(item ? item.phone || "" : "");
  const [email, setEmail] = useState(item ? item.email || "" : "");
  const [signatureUri, setSignatureUri] = useState(item ? item.signatureUri || item.eSignature || "" : "");

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Signature image file must be smaller than 2MB.");
        return;
      }
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
                {roles.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </Field>

            <Field label="PRC / License Number">
              <input type="text" value={licenseNo} onChange={(e) => setLicenseNo(e.target.value)} placeholder="PRC Lic. No. 0012345" style={inp({ width: "100%" })} />
            </Field>

            <div style={{ padding: 12, border: `1px solid ${C.border}`, borderRadius: 8, background: C.surface, display: "flex", flexDirection: "column", gap: 10 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase" }}>
                Digital Signature Photo (PNG/JPG with transparent bg)
              </label>

              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                {signatureUri ? (
                  <img src={signatureUri} alt="Signature Preview" style={{ height: 40, maxWidth: 120, objectFit: "contain", border: `1px solid ${C.border}`, borderRadius: 4, background: "#fff", padding: 4 }} />
                ) : (
                  <div style={{ height: 40, width: 120, border: `1.5px dashed ${C.faint}`, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted, fontSize: 10 }}>
                    No Signature
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
