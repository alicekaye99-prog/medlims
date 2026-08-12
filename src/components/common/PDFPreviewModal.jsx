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
