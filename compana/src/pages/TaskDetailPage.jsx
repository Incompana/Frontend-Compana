// src/pages/TaskDetailPage.jsx
import { useState } from "react";
import { Logo, StarField } from "../components/Shared";

const TASK_DATA = {
  breadcrumb: ["Action Plan", "Phase 1", "Langkah 3"],
  phase: "PHASE 1 — FONDASI",
  title: "JavaScript ES6 Dasar",
  tags: ["JavaScript", "ES6"],
  duration: "7 hari",
  xp: 120,
  currentStep: 3,
  totalSteps: 6,
  sections: {
    deskripsi:
      "Pelajari dasar-dasar JavaScript modern (ES6+) yang wajib dikuasai sebelum masuk ke framework seperti React. Fokus pada sintaks baru yang membuat kode lebih bersih dan efisien.",
    yangHarusDikerjakan: [
      "Pelajari perbedaan let, const, dan var — lalu tulis 5 contoh penggunaannya",
      "Buat 3 arrow function yang melakukan operasi berbeda (penjumlahan, filter array, map)",
      "Gunakan template literals untuk membuat string dinamis dari sebuah objek",
      "Buat mini project: To-Do list menggunakan array methods (push, filter, map)",
    ],
    expectedOutput: [
      { icon: "📄", text: "File script.js berisi semua latihan dan komentar penjelasan" },
      { icon: "📷", text: "Screenshot hasil output di console browser (DevTools)" },
      { icon: "🔗", text: "Link CodePen / JSFiddle dengan mini project To-Do list" },
    ],
    referensiBelajar: [
      { icon: "🤖", text: "Minta penjelasan dari Compana AI", isExternal: true },
      { icon: "📘", text: "MDN Web Docs — JavaScript ES6", isExternal: true },
      { icon: "▶️", text: "Video: JavaScript ES6 Tutorial (YouTube)", isExternal: true },
    ],
  },
};

const SectionDot = ({ color = "#3dba74" }) => (
  <span
    style={{
      width: "8px",
      height: "8px",
      borderRadius: "50%",
      background: color,
      display: "inline-block",
      flexShrink: 0,
      marginRight: "8px",
    }}
  />
);

const SectionLabel = ({ children, color = "#3dba74" }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      marginBottom: "12px",
    }}
  >
    <SectionDot color={color} />
    <span
      style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "10px",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.4)",
        fontWeight: 600,
      }}
    >
      {children}
    </span>
  </div>
);

const sectionCard = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: "14px",
  padding: "16px 20px",
  marginBottom: "10px",
};

export default function TaskDetailPage({ task, onBack, onSubmit }) {
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const data = task || TASK_DATA;

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer?.files?.[0] || e.target?.files?.[0];
    if (f) setFile(f);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a1f12",
        color: "white",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
      }}
    >
      {/* Nav */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 40px",
          flexShrink: 0,
        }}
      >
        <Logo />
        {/* Right: step counter + XP badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            Langkah {data.currentStep} dari {data.totalSteps}
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 14px",
              borderRadius: "999px",
              background: "rgba(61,186,116,0.12)",
              border: "1.5px solid rgba(61,186,116,0.35)",
            }}
          >
            <span style={{ fontSize: "13px" }}>⚡</span>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                color: "#3dba74",
              }}
            >
              +{data.xp} XP
            </span>
          </div>
        </div>
      </nav>

      {/* Body */}
      <div
        style={{
          position: "relative",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0 24px 48px",
        }}
      >
        <div className="mesh-bg" />
        <StarField />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: "640px",
            animation: "slideUp 0.5s ease both",
          }}
        >
          {/* Breadcrumb */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginBottom: "14px",
              flexWrap: "wrap",
            }}
          >
            {data.breadcrumb.map((crumb, idx) => (
              <span key={crumb} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {idx > 0 && (
                  <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "12px" }}>→</span>
                )}
                <span
                  onClick={() => idx < data.breadcrumb.length - 1 && onBack && onBack()}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "12px",
                    color:
                      idx === data.breadcrumb.length - 1
                        ? "rgba(255,255,255,0.85)"
                        : "rgba(255,255,255,0.4)",
                    cursor: idx < data.breadcrumb.length - 1 ? "pointer" : "default",
                    transition: "color 0.2s",
                    textDecoration: idx < data.breadcrumb.length - 1 ? "underline" : "none",
                    textDecorationColor: "rgba(255,255,255,0.2)",
                    textUnderlineOffset: "3px",
                  }}
                  onMouseEnter={(e) => {
                    if (idx < data.breadcrumb.length - 1)
                      e.target.style.color = "rgba(255,255,255,0.8)";
                  }}
                  onMouseLeave={(e) => {
                    if (idx < data.breadcrumb.length - 1)
                      e.target.style.color = "rgba(255,255,255,0.4)";
                  }}
                >
                  {crumb}
                </span>
              </span>
            ))}
          </div>

          {/* Task header card */}
          <div
            style={{
              ...sectionCard,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.11)",
              marginBottom: "12px",
              padding: "16px 20px",
            }}
          >
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "10px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.35)",
                marginBottom: "6px",
              }}
            >
              {data.phase}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  background: "rgba(45,140,94,0.2)",
                  border: "1.5px solid rgba(61,186,116,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  flexShrink: 0,
                }}
              >
                📝
              </div>
              <h1
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: "clamp(20px, 3.5vw, 26px)",
                  color: "white",
                  margin: 0,
                }}
              >
                {data.title}
              </h1>
            </div>
            {/* Tags + meta */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              {data.tags.map((t) => (
                <span
                  key={t}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "11px",
                    color: "rgba(255,255,255,0.65)",
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.13)",
                    padding: "3px 10px",
                    borderRadius: "6px",
                  }}
                >
                  {t}
                </span>
              ))}
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.5)",
                  background: "rgba(61,186,116,0.1)",
                  border: "1px solid rgba(61,186,116,0.25)",
                  padding: "3px 10px",
                  borderRadius: "6px",
                }}
              >
                ⏱ {data.duration}
              </span>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "11px",
                  color: "#3dba74",
                  background: "rgba(61,186,116,0.1)",
                  border: "1px solid rgba(61,186,116,0.25)",
                  padding: "3px 10px",
                  borderRadius: "6px",
                  fontWeight: 600,
                }}
              >
                +{data.xp} XP
              </span>
            </div>
          </div>

          {/* Deskripsi */}
          <div style={{ ...sectionCard }}>
            <SectionLabel>Deskripsi</SectionLabel>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.7,
                margin: 0,
                textDecoration: "underline",
                textDecorationColor: "rgba(255,255,255,0.15)",
                textUnderlineOffset: "3px",
              }}
            >
              {data.sections.deskripsi}
            </p>
          </div>

          {/* Yang Harus Dikerjakan */}
          <div style={{ ...sectionCard }}>
            <SectionLabel color="#3dba74">Yang Harus Dikerjakan</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {data.sections.yangHarusDikerjakan.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      background: "rgba(45,140,94,0.25)",
                      border: "1.5px solid rgba(61,186,116,0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 700,
                      fontSize: "11px",
                      color: "#3dba74",
                      flexShrink: 0,
                      marginTop: "1px",
                    }}
                  >
                    {idx + 1}
                  </div>
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "13px",
                      color: "rgba(255,255,255,0.75)",
                      margin: 0,
                      lineHeight: 1.6,
                      textDecoration: "underline",
                      textDecorationColor: "rgba(255,255,255,0.15)",
                      textUnderlineOffset: "3px",
                    }}
                  >
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Expected Output */}
          <div style={{ ...sectionCard }}>
            <SectionLabel color="#3dba74">Expected Output</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {data.sections.expectedOutput.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 12px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "8px",
                  }}
                >
                  <span style={{ fontSize: "16px", flexShrink: 0 }}>{item.icon}</span>
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "13px",
                      color: "rgba(255,255,255,0.7)",
                      textDecoration: "underline",
                      textDecorationColor: "rgba(255,255,255,0.15)",
                      textUnderlineOffset: "3px",
                    }}
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Referensi Belajar */}
          <div style={{ ...sectionCard }}>
            <SectionLabel color="#3dba74">Referensi Belajar</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {data.sections.referensiBelajar.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "background 0.2s, border-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(61,186,116,0.06)";
                    e.currentTarget.style.borderColor = "rgba(61,186,116,0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "16px" }}>{item.icon}</span>
                    <span
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "13px",
                        color: "rgba(255,255,255,0.7)",
                        textDecoration: "underline",
                        textDecorationColor: "rgba(255,255,255,0.15)",
                        textUnderlineOffset: "3px",
                      }}
                    >
                      {item.text}
                    </span>
                  </div>
                  {item.isExternal && (
                    <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "12px" }}>↗</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Task */}
          <div style={{ ...sectionCard }}>
            <SectionLabel color="#3dba74">Submit Task</SectionLabel>

            {/* Upload area */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleFileDrop}
              onClick={() => document.getElementById("file-upload").click()}
              style={{
                border: `2px dashed ${isDragging ? "rgba(61,186,116,0.6)" : "rgba(255,255,255,0.15)"}`,
                borderRadius: "12px",
                padding: "28px 20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                cursor: "pointer",
                background: isDragging ? "rgba(61,186,116,0.05)" : "rgba(255,255,255,0.02)",
                transition: "all 0.2s",
                marginBottom: "10px",
              }}
            >
              <input
                id="file-upload"
                type="file"
                style={{ display: "none" }}
                onChange={handleFileDrop}
              />
              <span style={{ fontSize: "24px" }}>📁</span>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  color: file ? "#3dba74" : "rgba(255,255,255,0.55)",
                  margin: 0,
                  fontWeight: file ? 600 : 400,
                }}
              >
                {file ? `✓ ${file.name}` : "Upload file kamu di sini"}
              </p>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.3)",
                  margin: 0,
                }}
              >
                script.js + screenshot (maks 10MB)
              </p>
            </div>

            {/* Notes textarea */}
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan tambahan (opsional) — ceritakan proses belajarmu..."
              rows={3}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.03)",
                color: "rgba(255,255,255,0.7)",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                outline: "none",
                resize: "vertical",
                transition: "border-color 0.2s",
                marginBottom: "0",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(61,186,116,0.4)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>

          {/* Bottom buttons */}
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "12px" }}>
            <button
              onClick={onBack}
              style={{
                padding: "14px 24px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.6)",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255,255,255,0.1)";
                e.target.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255,255,255,0.06)";
                e.target.style.color = "rgba(255,255,255,0.6)";
              }}
            >
              Simpan Draft
            </button>
            <button
              onClick={() => onSubmit && onSubmit({ notes, file })}
              style={{
                padding: "14px",
                borderRadius: "12px",
                border: "none",
                background: "rgba(45,140,94,0.9)",
                color: "white",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
                textDecoration: "underline",
                textDecorationColor: "rgba(255,255,255,0.3)",
                textUnderlineOffset: "3px",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(61,186,116,1)";
                e.target.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(45,140,94,0.9)";
                e.target.style.transform = "translateY(0)";
              }}
            >
              Submit Task →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}