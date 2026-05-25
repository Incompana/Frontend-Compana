// src/pages/FeedbackPage.jsx
import { Logo, StarField } from "../components/Shared";

const FEEDBACK_DATA = {
  breadcrumb: ["Action Plan", "Langkah 3", "Feedback"],
  status: "need-revision", // "need-revision" | "passed"
  needRevision: {
    title: "Need Revision",
    desc: "Ada beberapa hal yang perlu diperbaiki sebelum lanjut ke langkah berikutnya.",
    xp: 60,
  },
  strengths: [
    "Struktur HTML sudah rapi dan mudah dibaca",
    "Arrow function ditulis dengan benar dan berjalan",
    "Template literals digunakan di tempat yang tepat",
  ],
  weaknesses: [
    "Tidak ada semantic tag (header, main, footer)",
    "Mini project belum menggunakan filter()",
  ],
  saranPerbaikan: [
    "Tambahkan tag <header>, <main>, dan <footer> untuk struktur semantic HTML yang benar",
    "Implementasikan array.filter() pada fungsi hapus tugas agar lebih idiomatik",
    "Tambahkan komentar kode (// comment) untuk menjelaskan logika di setiap fungsi",
  ],
  skor: {
    ketepatan: 72,
    kelengkapan: 60,
    kualitasKode: 80,
  },
  contohPassed: {
    title: "Passed!",
    desc: "Selamat! Semua kriteria terpenuhi. Langkah berikutnya sudah terbuka.",
    xp: 120,
  },
};

const ScoreBar = ({ label, pct, color }) => (
  <div style={{ flex: 1, textAlign: "center", padding: "0 10px" }}>
    <p
      style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "11px",
        color: "rgba(60,80,70,0.5)",
        textTransform: "capitalize",
        marginBottom: "8px",
        letterSpacing: "0.03em",
      }}
    >
      {label}
    </p>
    <div
      style={{
        height: "4px",
        borderRadius: "999px",
        background: "rgba(0,0,0,0.08)",
        marginBottom: "8px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${pct}%`,
          borderRadius: "999px",
          background: color,
          transition: "width 1s ease",
        }}
      />
    </div>
    <p
      style={{
        fontFamily: "'Playfair Display', serif",
        fontWeight: 700,
        fontSize: "20px",
        color: "#1a3a2a",
        margin: 0,
      }}
    >
      {pct}%
    </p>
  </div>
);

export default function FeedbackPage({ feedback, onPerbaikiAI, onSubmitUlang, onBack }) {
  const data = feedback || FEEDBACK_DATA;
  const isPassed = data.status === "passed";

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
        <div
          style={{
            padding: "6px 20px",
            borderRadius: "999px",
            border: "1.5px solid rgba(61,186,116,0.5)",
            background: "rgba(61,186,116,0.1)",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px",
            color: "rgba(255,255,255,0.85)",
            fontWeight: 500,
          }}
        >
          Hasil Evaluasi
        </div>
        <div style={{ width: "80px" }} />
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
                  onClick={() => idx === 0 && onBack && onBack()}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "12px",
                    color:
                      idx === data.breadcrumb.length - 1
                        ? "rgba(255,255,255,0.85)"
                        : "rgba(255,255,255,0.4)",
                    cursor: idx === 0 ? "pointer" : "default",
                    textDecoration: idx < data.breadcrumb.length - 1 ? "underline" : "none",
                    textDecorationColor: "rgba(255,255,255,0.2)",
                    textUnderlineOffset: "3px",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (idx === 0) e.target.style.color = "rgba(255,255,255,0.8)";
                  }}
                  onMouseLeave={(e) => {
                    if (idx === 0) e.target.style.color = "rgba(255,255,255,0.4)";
                  }}
                >
                  {crumb}
                </span>
              </span>
            ))}
          </div>

          {/* Status banner — Need Revision */}
          {!isPassed && (
            <div
              style={{
                background: "rgba(255,248,230,0.95)",
                border: "1px solid rgba(212,168,68,0.4)",
                borderRadius: "14px",
                padding: "16px 20px",
                display: "flex",
                alignItems: "flex-start",
                gap: "14px",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "rgba(212,168,68,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  flexShrink: 0,
                }}
              >
                💬
              </div>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 700,
                    fontSize: "17px",
                    color: "#b87a00",
                    textDecoration: "underline",
                    textDecorationColor: "rgba(184,122,0,0.35)",
                    textUnderlineOffset: "3px",
                    margin: "0 0 4px",
                  }}
                >
                  {data.needRevision.title}
                </p>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "13px",
                    color: "rgba(100,70,0,0.7)",
                    margin: 0,
                    textDecoration: "underline",
                    textDecorationColor: "rgba(100,70,0,0.2)",
                    textUnderlineOffset: "3px",
                  }}
                >
                  {data.needRevision.desc}
                </p>
              </div>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#b87a00",
                  background: "rgba(212,168,68,0.15)",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  flexShrink: 0,
                }}
              >
                +{data.needRevision.xp} XP
              </span>
            </div>
          )}

          {/* Strengths + Weaknesses */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            {/* Strengths */}
            <div
              style={{
                background: "rgba(255,255,255,0.93)",
                borderRadius: "14px",
                padding: "16px 18px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#2d8c5e",
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#3dba74",
                      display: "inline-block",
                    }}
                  />
                  Strengths
                </p>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "11px",
                    color: "#2d8c5e",
                    background: "rgba(45,140,94,0.1)",
                    padding: "2px 8px",
                    borderRadius: "999px",
                  }}
                >
                  {data.strengths.length} poin
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {data.strengths.map((s, idx) => (
                  <div
                    key={idx}
                    style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}
                  >
                    <span
                      style={{
                        color: "#3dba74",
                        fontWeight: 700,
                        fontSize: "13px",
                        flexShrink: 0,
                        marginTop: "1px",
                      }}
                    >
                      ✓
                    </span>
                    <p
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "12px",
                        color: "#2a4a38",
                        margin: 0,
                        lineHeight: 1.55,
                        textDecoration: "underline",
                        textDecorationColor: "rgba(45,140,94,0.25)",
                        textUnderlineOffset: "3px",
                      }}
                    >
                      {s}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Weakness */}
            <div
              style={{
                background: "rgba(255,255,255,0.93)",
                borderRadius: "14px",
                padding: "16px 18px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#c04040",
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#e05a5a",
                      display: "inline-block",
                    }}
                  />
                  Weakness
                </p>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "11px",
                    color: "#c04040",
                    background: "rgba(220,80,80,0.1)",
                    padding: "2px 8px",
                    borderRadius: "999px",
                  }}
                >
                  {data.weaknesses.length} poin
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {data.weaknesses.map((w, idx) => (
                  <div
                    key={idx}
                    style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}
                  >
                    <span
                      style={{
                        color: "#e05a5a",
                        fontWeight: 700,
                        fontSize: "13px",
                        flexShrink: 0,
                        marginTop: "1px",
                      }}
                    >
                      ✕
                    </span>
                    <p
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "12px",
                        color: "#2a4a38",
                        margin: 0,
                        lineHeight: 1.55,
                        textDecoration: "underline",
                        textDecorationColor: "rgba(220,80,80,0.25)",
                        textUnderlineOffset: "3px",
                      }}
                    >
                      {w}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Saran Perbaikan */}
          <div
            style={{
              background: "rgba(255,255,255,0.93)",
              borderRadius: "14px",
              padding: "16px 20px",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#1a3a2a",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#d4a844",
                    display: "inline-block",
                  }}
                />
                Saran Perbaikan
              </p>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "11px",
                  color: "#b87a00",
                  background: "rgba(212,168,68,0.15)",
                  padding: "2px 8px",
                  borderRadius: "999px",
                }}
              >
                {data.saranPerbaikan.length} saran
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {data.saranPerbaikan.map((s, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    padding: "10px 0",
                    borderBottom:
                      idx < data.saranPerbaikan.length - 1
                        ? "1px solid rgba(0,0,0,0.06)"
                        : "none",
                  }}
                >
                  <span style={{ fontSize: "15px", flexShrink: 0, marginTop: "1px" }}>💡</span>
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "13px",
                      color: "#2a4a38",
                      margin: 0,
                      lineHeight: 1.6,
                      textDecoration: "underline",
                      textDecorationColor: "rgba(45,140,94,0.2)",
                      textUnderlineOffset: "3px",
                    }}
                  >
                    {s}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Skor Evaluasi */}
          <div
            style={{
              background: "rgba(255,255,255,0.93)",
              borderRadius: "14px",
              padding: "16px 20px",
              marginBottom: "10px",
            }}
          >
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                fontWeight: 700,
                color: "#1a3a2a",
                margin: "0 0 16px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#3dba74",
                  display: "inline-block",
                }}
              />
              Skor Evaluasi
            </p>
            <div
              style={{
                display: "flex",
                borderTop: "1px solid rgba(0,0,0,0.07)",
                paddingTop: "14px",
              }}
            >
              <ScoreBar
                label="Ketepatan"
                pct={data.skor.ketepatan}
                color="linear-gradient(90deg,#7c6fe0,#a89cf0)"
              />
              <div style={{ width: "1px", background: "rgba(0,0,0,0.07)", margin: "0 4px" }} />
              <ScoreBar
                label="Kelengkapan"
                pct={data.skor.kelengkapan}
                color="linear-gradient(90deg,#d4a844,#f0c85c)"
              />
              <div style={{ width: "1px", background: "rgba(0,0,0,0.07)", margin: "0 4px" }} />
              <ScoreBar
                label="Kualitas Kode"
                pct={data.skor.kualitasKode}
                color="linear-gradient(90deg,#2d8c5e,#3dba74)"
              />
            </div>
          </div>

          {/* Contoh status PASSED */}
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "10px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
              marginBottom: "8px",
            }}
          >
            Contoh Status: Passed ↓
          </p>
          <div
            style={{
              background: "rgba(235,255,245,0.95)",
              border: "1px solid rgba(61,186,116,0.4)",
              borderRadius: "14px",
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "rgba(61,186,116,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                flexShrink: 0,
              }}
            >
              🎉
            </div>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: "17px",
                  color: "#2d8c5e",
                  textDecoration: "underline",
                  textDecorationColor: "rgba(45,140,94,0.3)",
                  textUnderlineOffset: "3px",
                  margin: "0 0 3px",
                }}
              >
                {data.contohPassed.title}
              </p>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  color: "rgba(30,80,55,0.7)",
                  margin: 0,
                  textDecoration: "underline",
                  textDecorationColor: "rgba(45,140,94,0.2)",
                  textUnderlineOffset: "3px",
                }}
              >
                {data.contohPassed.desc}
              </p>
            </div>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "12px",
                fontWeight: 600,
                color: "#2d8c5e",
                background: "rgba(45,140,94,0.12)",
                padding: "4px 10px",
                borderRadius: "999px",
                flexShrink: 0,
              }}
            >
              +{data.contohPassed.xp} XP
            </span>
          </div>

          {/* Bottom buttons */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "12px" }}>
            <button
              onClick={onPerbaikiAI}
              style={{
                padding: "14px",
                borderRadius: "12px",
                border: "none",
                background: "rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.7)",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s",
                textDecoration: "underline",
                textDecorationColor: "rgba(255,255,255,0.2)",
                textUnderlineOffset: "3px",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255,255,255,0.16)";
                e.target.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255,255,255,0.1)";
                e.target.style.color = "rgba(255,255,255,0.7)";
              }}
            >
              Perbaiki dengan AI →
            </button>
            <button
              onClick={onSubmitUlang}
              style={{
                padding: "14px 28px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.8)",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.14)";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                e.currentTarget.style.color = "rgba(255,255,255,0.8)";
              }}
            >
              Submit Ulang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}