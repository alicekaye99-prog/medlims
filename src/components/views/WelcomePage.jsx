import React, { useState } from "react";
import { C, Btn, inp, Field, Card } from "../../utils/helpers.jsx";

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
          {/* Custom B-Cross Logo Display */}
          <div style={{ width: 72, height: 72, borderRadius: 16, background: "#ffffff", border: `1px solid ${C.border}`, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: 8, marginBottom: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <img src={hospital.logoUri || "/icons/icon.png"} alt="MedLIMS Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
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
