// src/pages/AssessmentPage.jsx
import { useState } from "react";
import { Logo, StarField } from "../components/Shared";

const QUESTIONS = [
  {
    id: 1,
    category: "Situasi",
    question: "Situasi sekarang gimana nih ?",
    options: ["mahasiswa aktif", "fresh graduate", "kerja", "ingin berpindah pekerjaan"],
  },
  {
    id: 2,
    category: "Pengalaman",
    question: "situasi apa yang membuat mu merasa stuck ?",
    options: [
      "gatau mau mulai dari mana",
      "banyak skill, tapi bingung bangettt",
      "takut salah jalur",
      "sudah belajar, tapi merasa tidak belajar",
    ],
  },
  {
    id: 3,
    category: "Pengalaman",
    question: "mau coba apa dulu nih",
    options: ["full stack", "data science", "machine learning", "gatau sama sekali"],
  },
];

const TOTAL_QUESTIONS = QUESTIONS.length;

export default function AssessmentPage({ onBack, onNext }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});

  const q = QUESTIONS[currentQ];
  const selected = answers[q.id];
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / TOTAL_QUESTIONS) * 100);

  const handleSelect = (option) => {
    setAnswers((prev) => ({ ...prev, [q.id]: option }));
  };

  const handleNext = () => {
    if (currentQ < QUESTIONS.length - 1) setCurrentQ((i) => i + 1);
    else onNext();
  };

  const handlePrev = () => {
    if (currentQ > 0) setCurrentQ((i) => i - 1);
    else onBack();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a1f12", color: "white", display: "flex", flexDirection: "column" }}>
      {/* Navbar */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 40px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <Logo />
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.45)" }}>
          Pertanyaan{" "}
          <span style={{ color: "white", fontWeight: 600 }}>{currentQ + 1}</span>
          {" "}dari{" "}
          <span style={{ color: "white", fontWeight: 600 }}>{TOTAL_QUESTIONS}</span>
        </div>
        <button className="ghost-btn">Lewati →</button>
      </nav>

      {/* Progress bar */}
      <div style={{ height: "3px", background: "rgba(255,255,255,0.08)" }}>
        <div style={{
          width: "66.66%", height: "100%",
          background: "linear-gradient(90deg, #2d8c5e, #3dba74)",
          transition: "width 0.5s ease",
        }} />
      </div>

      {/* Content */}
      <section style={{
        flex: 1, position: "relative",
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", padding: "40px 24px 24px", overflow: "hidden",
      }}>
        <div className="mesh-bg" />
        <StarField />

        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "600px" }}>
          {/* Step + badge */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: "13px",
              color: "rgba(255,255,255,0.4)",
            }}>
              Langkah{" "}
              <span style={{ color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>2</span>
              {" "}dari 3
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
              <div className="badge-pill" style={{ marginBottom: 0, fontSize: "11px", padding: "4px 12px" }}>
                <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#4de89a", flexShrink: 0 }} />
                Assessment Karir
              </div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: "12px",
                color: "rgba(255,255,255,0.35)",
              }}>
                {progressPercent}%
              </div>
            </div>
          </div>

          {/* Progress track */}
          <div style={{ height: "3px", background: "rgba(255,255,255,0.08)", borderRadius: "2px", marginBottom: "24px" }}>
            <div style={{
              width: `${progressPercent}%`, height: "100%",
              background: "linear-gradient(90deg, #2d8c5e, #3dba74)",
              borderRadius: "2px", transition: "width 0.4s ease",
            }} />
          </div>

          {/* Question card */}
          <div style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "16px", padding: "28px",
            backdropFilter: "blur(8px)",
          }}>
            {/* Card header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <span style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: "12px",
                color: "rgba(255,255,255,0.35)",
              }}>
                Pertanyaan {currentQ + 1}
              </span>
              <span style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: "11px",
                color: "rgba(100, 220, 150, 0.8)",
                background: "rgba(45,140,94,0.15)",
                border: "1px solid rgba(45,140,94,0.3)",
                borderRadius: "999px", padding: "3px 10px",
              }}>
                {q.category}
              </span>
            </div>

            {/* Question text */}
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: "clamp(18px, 3vw, 24px)",
              lineHeight: 1.3,
              marginBottom: "20px",
              textDecoration: "underline",
              textDecorationColor: "rgba(255,255,255,0.2)",
              textUnderlineOffset: "4px",
            }}>
              {q.question}
            </h2>

            {/* Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
              {q.options.map((option) => {
                const isSelected = selected === option;
                return (
                  <button
                    key={option}
                    onClick={() => handleSelect(option)}
                    style={{
                      display: "flex", alignItems: "center", gap: "12px",
                      padding: "14px 16px", borderRadius: "10px",
                      border: isSelected ? "1px solid rgba(45,140,94,0.5)" : "1px solid rgba(255,255,255,0.08)",
                      background: isSelected ? "rgba(45,140,94,0.15)" : "rgba(255,255,255,0.03)",
                      cursor: "pointer", textAlign: "left",
                      transition: "all 0.18s",
                      width: "100%",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    }}
                  >
                    {/* Radio indicator */}
                    <div style={{
                      width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0,
                      border: isSelected ? "2px solid #3dba74" : "2px solid rgba(255,255,255,0.25)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: isSelected ? "rgba(45,140,94,0.2)" : "transparent",
                      transition: "all 0.18s",
                    }}>
                      {isSelected && (
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#3dba74" }} />
                      )}
                    </div>
                    <span style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: "14px",
                      color: isSelected ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.65)",
                      fontWeight: isSelected ? 500 : 400,
                      transition: "color 0.18s",
                    }}>
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Divider */}
            <div style={{ height: "1px", background: "rgba(255,255,255,0.07)", marginBottom: "20px" }} />

            {/* Card footer nav */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button onClick={handlePrev} className="ghost-btn">← Sebelumnya</button>
              <button
                onClick={handleNext}
                className="cta-btn"
                style={{ padding: "10px 24px", fontSize: "13px", animation: "none" }}
                disabled={!selected}
              >
                Selanjutnya →
              </button>
            </div>
          </div>

          {/* Dot indicators */}
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "20px" }}>
            {QUESTIONS.map((_, i) => (
              <div key={i} style={{
                width: "8px", height: "8px", borderRadius: "50%",
                background: i < currentQ
                  ? "#3dba74"
                  : i === currentQ
                  ? "rgba(61,186,116,0.5)"
                  : "rgba(255,255,255,0.2)",
                transition: "background 0.3s",
              }} />
            ))}
          </div>

          {/* Answered count */}
          <p style={{
            textAlign: "center", marginTop: "10px",
            fontFamily: "'DM Sans', sans-serif", fontSize: "12px",
            color: "rgba(255,255,255,0.3)",
          }}>
            {answeredCount} dari {TOTAL_QUESTIONS} pertanyaan dijawab
          </p>
        </div>
      </section>
    </div>
  );
}