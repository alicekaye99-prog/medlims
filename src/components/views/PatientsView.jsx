import React, { useState, useMemo, useEffect } from "react";
import { C, Btn, inp, Field, Card, CardHead, uid, toInputDate, calcAge, fmtDate } from "../../utils/helpers.jsx";
import { Icon } from "../common/Icons.jsx";

export function PatientsView({ data = [], onSave }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  
  const [page, setPage] = useState(1);
  const PATIENTS_PER_PAGE = 50;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredPatients = useMemo(() => {
    const list = Array.isArray(data) ? data : [];
    const term = debouncedSearch.toLowerCase().trim();
    if (!term) return list;

    return list.filter((p) => {
      return (
        (p.name || "").toLowerCase().includes(term) ||
        (p.mrn || p.pid || "").toLowerCase().includes(term) ||
        (p.phone || "").toLowerCase().includes(term) ||
        (p.address || "").toLowerCase().includes(term)
      );
    });
  }, [data, debouncedSearch]);

  const totalPages = Math.max(1, Math.ceil(filteredPatients.length / PATIENTS_PER_PAGE));
  const paginatedPatients = useMemo(() => {
    return filteredPatients.slice((page - 1) * PATIENTS_PER_PAGE, page * PATIENTS_PER_PAGE);
  }, [filteredPatients, page]);

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
            placeholder="Search patient by name, MRN/PID, phone, address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={inp({ width: "100%", maxWidth: 400 })}
          />
          <span style={{ fontSize: 12, color: C.muted }}>
            Showing {filteredPatients.length} of {data.length} patients {totalPages > 1 && `(Page ${page} of ${totalPages})`}
          </span>
        </div>
      </Card>

      <Card style={{ display: "flex", flexDirection: "column" }}>
        <CardHead
          title={`Patient Records (${filteredPatients.length})`}
          sub="Master list of registered clinic patients"
          icon={<Icon name="patients" size={18} color={C.accent} />}
        />
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, textAlign: "left" }}>
            <thead>
              <tr style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, color: C.muted, fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
                <th style={{ padding: "12px 16px" }}>PID / MRN</th>
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
                paginatedPatients.map((p) => (
                  <tr key={p.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "12px 16px", fontWeight: 700, color: C.accent, fontSize: 11.5, fontFamily: "monospace" }}>
                      {p.mrn || p.pid || ("PT-" + String(p.id).slice(0, 5).toUpperCase())}
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

        {totalPages > 1 && (
          <div style={{ padding: "10px 16px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: C.surface }}>
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} style={Btn("ghost", { height: 28, fontSize: 11.5 })}>
              ‹ Prev Page
            </button>
            <span style={{ fontSize: 11.5, color: C.muted }}>Page {page} of {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} style={Btn("ghost", { height: 28, fontSize: 11.5 })}>
              Next Page ›
            </button>
          </div>
        )}
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
    const seq = String(totalCount + 1).padStart(5, "0");
    return `PT-${seq}`;
  };

  const [mrn, setMrn] = useState(patient ? patient.mrn || patient.pid || "" : generateSeqMrn());

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

  const handleDobTextChange = (e) => {
    const rawVal = e.target.value;
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
      pid: mrn.trim(),
      mrn: mrn.trim(),
      name: name.trim(),
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

              <Field label="Patient ID / MRN">
                <input type="text" value={mrn} onChange={(e) => setMrn(e.target.value)} placeholder="PT-00001" style={inp({ width: "100%", fontWeight: 700, color: C.accent })} />
              </Field>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <Field label="Date of Birth (MM/DD/YYYY)">
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
                  onChange={(e) => setAge(e.target.value)}
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
