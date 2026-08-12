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
