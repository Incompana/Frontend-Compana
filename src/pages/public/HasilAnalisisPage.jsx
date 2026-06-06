// src/pages/public/HasilAnalisisPage.jsx
import { useState } from "react";
import { Logo, StarField } from "../../components/Shared";
import { useAssessment } from "../../context/AssessmentContext";
import { useNavigate } from "react-router-dom";
import LoginRegisterPrompt from "../../components/LoginRegisterPrompt";
import api from "../../api/axios";
import toast from "react-hot-toast";

export default function HasilAnalisisPage({ onLihatRoadmap, onSimpan, onSelesai }) {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const navigate = useNavigate();

  const { draft, clearDraft } = useAssessment();

  const answers = draft.answers || {};
  const analysis = draft.analysisResult || {};
  const skillGap = draft.skillGap || [];
  const recommendedTasks = draft.recommendedTasks || [];

  const problemCategory = analysis.problemCategory || "Skill Gap";
  const problemDesc =
    analysis.summary || analysis.problemDescription || "Masih membutuhkan peningkatan skill";

  const formatRoleLabel = (role = "Frontend Developer") =>
    role.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

  const formatPersonaLabel = (personaValue = "Career Explorer") =>
    personaValue.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

  const persona = analysis.personaType || analysis.persona || "Career Explorer";

  const DATA = {
    targetRole: formatRoleLabel(analysis.role || "Frontend Developer"),
    level: analysis.currentLevel || "Entry Level",
    problemCategory,
    problemDesc,
    confidenceScore: analysis.confidence || 75,
    confidenceLabel: "Berdasarkan hasil assessment AI",
    persona: {
      nama: formatPersonaLabel(persona),
      tahapKarir: answers[1] === "mahasiswa aktif" ? "Mahasiswa" : "Pemula",
      skillSaatIni: answers[3] || "Belum ditentukan",
      gayaBelajar: "Praktek + Video",
      waktuTersedia: "1–2 jam / hari",
      target6Bulan: "Dapat pekerjaan pertama",
    },
    langkah: (
      recommendedTasks.length
        ? recommendedTasks
        : ["Buka action plan untuk melihat task AI pertama kamu"]
    ).map((task, index) => ({
      no: index + 1,
      text: task,
      badge: "Rekomendasi AI",
      badgeColor: "#2d8c5e",
    })),
  };

  const pct = DATA.confidenceScore;

  const handleNextJourney = async () => {
    if (!draft?.assessmentPayload) {
      toast.error("Data assessment belum tersedia");
      navigate("/assessment");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token || token === "undefined" || token === "null") {
      setShowLoginPrompt(true);
      return;
    }

    try {
      const saveResponse = await api.post("/assessments/save", draft.assessmentPayload);

      localStorage.setItem("lastAssessmentResult", JSON.stringify(saveResponse.data.data));

      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (user) {
        localStorage.setItem("user", JSON.stringify({ ...user, is_assessment_done: true }));
      }

      clearDraft();
      navigate("/skill-gap");
    } catch (error) {
      console.log(error.response?.data || error.message);
      toast.error("Gagal menyimpan hasil assessment");
    }
  };

  const handleFinish = () => {
    if (onSelesai) {
      onSelesai();
      return;
    }
    navigate("/");
  };

  if (showLoginPrompt) {
    return (
      <LoginRegisterPrompt
        onLogin={() => navigate("/login?redirect=/skill-gap")}
        onRegister={() => navigate("/register?redirect=/skill-gap")}
        onSkip={() => setShowLoginPrompt(false)}
      />
    );
  }

  const personaFields = [
    { lbl: "Nama Persona", val: DATA.persona.nama },
    { lbl: "Tahap Karir", val: DATA.persona.tahapKarir },
    { lbl: "Skill Saat Ini", val: DATA.persona.skillSaatIni },
    { lbl: "Gaya Belajar", val: DATA.persona.gayaBelajar },
    { lbl: "Waktu Tersedia", val: DATA.persona.waktuTersedia },
    { lbl: "Target 6 Bulan", val: DATA.persona.target6Bulan },
  ];

  return (
    <div style={styles.page}>
      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <Logo />

        <div style={styles.navBadge}>Hasil Analisis</div>

        <button
          onClick={handleFinish}
          style={styles.finishBtn}
          onMouseEnter={(e) => (e.target.style.color = "rgba(255,255,255,0.95)")}
          onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,0.55)")}
        >
          Selesai ✓
        </button>
      </nav>

      {/* BODY */}
      <div style={styles.body}>
        <div className="mesh-bg" />
        <StarField />

        <div style={styles.inner}>
          {/* HERO */}
          <div style={styles.hero}>
            <div style={styles.heroIcon}>🧠</div>

            <h1 style={styles.heroTitle}>
              <span style={styles.heroTitleGreen}>Analisismu</span>{" "}
              <span style={{ color: "white" }}>sudah siap!</span>
            </h1>

            <p style={styles.heroSub}>
              Berdasarkan jawabanmu, berikut profil karir dan rekomendasi
              langkah yang bisa diambil hari ini.
            </p>
          </div>

          {/* TOP 3 CARDS */}
          <div style={styles.topCards}>
            {/* Target Role */}
            <div style={styles.whiteCard}>
              <div style={{ ...styles.cardIcon, background: "rgba(45,140,94,0.18)" }}>💻</div>
              <p style={{ ...styles.cardLabel, color: "rgba(40,60,50,0.5)" }}>Target Role</p>
              <p style={{ ...styles.cardValue, color: "#2d8c5e" }}>{DATA.targetRole}</p>
              <p style={{ ...styles.cardSub, color: "rgba(40,60,50,0.55)" }}>{DATA.level}</p>
            </div>

            {/* Problem */}
            <div style={styles.whiteCard}>
              <div style={{ ...styles.cardIcon, background: "rgba(220,140,80,0.18)" }}>😕</div>
              <p style={{ ...styles.cardLabel, color: "rgba(40,60,50,0.5)" }}>Problem Category</p>
              <p style={{ ...styles.cardValue, color: "#c07030" }}>{DATA.problemCategory}</p>
              <p style={{ ...styles.cardSub, color: "rgba(40,60,50,0.55)" }}>{DATA.problemDesc}</p>
            </div>

            {/* Confidence */}
            <div style={styles.whiteCard}>
              <div style={{ ...styles.cardIcon, background: "rgba(45,140,94,0.18)" }}>📊</div>
              <p style={{ ...styles.cardLabel, color: "rgba(40,60,50,0.5)" }}>Confidence Score</p>
              <p style={styles.confScore}>{pct}%</p>
              <div style={styles.confTrack}>
                <div style={{ ...styles.confFill, width: `${pct}%` }} />
              </div>
              <p style={{ ...styles.cardSub, color: "rgba(40,60,50,0.55)", fontSize: "11px" }}>
                {DATA.confidenceLabel}
              </p>
            </div>
          </div>

          {/* PERSONA */}
          <div style={{ ...styles.darkCard, marginBottom: "16px" }}>
            <p style={styles.sectionTitle}>
              👤{" "}
              <span style={styles.greenUnderline}>Profil Persona Kamu</span>
            </p>

            <div style={styles.personaGrid}>
              {personaFields.map(({ lbl, val }) => (
                <div key={lbl} style={styles.personaCell}>
                  <p style={styles.cardLabel}>{lbl}</p>
                  <p style={styles.personaValue}>{val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SKILL GAP */}
          <div style={{ ...styles.darkCard, marginBottom: "16px" }}>
            <p style={{ ...styles.sectionTitle, color: "#3dba74" }}>🚀 Skill Gap</p>

            <div style={styles.skillGapWrap}>
              {skillGap.length ? (
                skillGap.map((skill) => (
                  <span key={skill} style={styles.skillPill}>
                    {skill}
                  </span>
                ))
              ) : (
                <p style={styles.emptyText}>
                  Skill gap akan ditampilkan setelah hasil assessment berhasil diproses.
                </p>
              )}
            </div>
          </div>

          {/* LANGKAH */}
          <div style={{ ...styles.darkCard, marginBottom: "24px" }}>
            <p style={styles.sectionTitle}>
              🎯{" "}
              <span style={styles.greenUnderline}>3 Langkah Pertama Kamu</span>
            </p>

            <div style={styles.langkahList}>
              {DATA.langkah.map((item) => (
                <div key={item.no} style={styles.langkahItem}>
                  <div style={styles.langkahNo}>{item.no}</div>

                  <p style={styles.langkahText}>{item.text}</p>

                  <span
                    style={{
                      ...styles.langkahBadge,
                      background: item.badgeColor,
                    }}
                  >
                    {item.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA BUTTONS */}
          <div style={styles.ctaRow}>
            <button
              onClick={handleNextJourney}
              style={styles.secondaryBtn}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255,255,255,0.12)";
                e.target.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255,255,255,0.07)";
                e.target.style.color = "rgba(255,255,255,0.75)";
              }}
            >
              Lanjut ke Skill Gap →
            </button>

            <button
              onClick={handleNextJourney}
              style={styles.primaryBtn}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(61,186,116,1)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(61,186,116,0.75)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Simpan Hasil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Styles ─────────────────────────────────────────────────────────────── */

const cardBase = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "14px",
  padding: "18px 20px",
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0a1f12",
    color: "white",
    display: "flex",
    flexDirection: "column",
    overflowX: "hidden",
  },

  // Navbar
  navbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px clamp(16px, 5vw, 40px)",
    flexShrink: 0,
    gap: "12px",
  },
  navBadge: {
    padding: "6px 20px",
    borderRadius: "999px",
    border: "1.5px solid rgba(61,186,116,0.5)",
    background: "rgba(61,186,116,0.08)",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13px",
    color: "rgba(255,255,255,0.8)",
    fontWeight: 500,
    whiteSpace: "nowrap",
  },
  finishBtn: {
    background: "transparent",
    border: "none",
    color: "rgba(255,255,255,0.55)",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13px",
    cursor: "pointer",
    transition: "color 0.2s",
    whiteSpace: "nowrap",
  },

  // Body
  body: {
    position: "relative",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "0 clamp(16px, 4vw, 24px) 48px",
  },
  inner: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: "680px",
    animation: "slideUp 0.6s ease both",
  },

  // Hero
  hero: {
    textAlign: "center",
    marginBottom: "28px",
  },
  heroIcon: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    background: "rgba(45,140,94,0.25)",
    border: "1.5px solid rgba(61,186,116,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    margin: "0 auto 16px",
  },
  heroTitle: {
    fontFamily: "'Playfair Display', serif",
    fontWeight: 700,
    fontSize: "clamp(24px, 4vw, 34px)",
    margin: "0 0 10px",
  },
  heroTitleGreen: {
    color: "#3dba74",
    textDecoration: "underline",
    textDecorationColor: "rgba(61,186,116,0.4)",
    textUnderlineOffset: "4px",
  },
  heroSub: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13px",
    color: "rgba(255,255,255,0.5)",
    textDecoration: "underline",
    textDecorationColor: "rgba(255,255,255,0.2)",
    margin: 0,
  },

  // Top 3 cards grid — stacks to 1 col on mobile
  topCards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "12px",
    marginBottom: "16px",
  },
  whiteCard: {
    ...cardBase,
    background: "rgba(255,255,255,0.92)",
  },
  cardIcon: {
    width: "34px",
    height: "34px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    marginBottom: "10px",
  },
  cardLabel: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "10px",
    letterSpacing: "0.08em",
    color: "rgba(255,255,255,0.4)",
    textTransform: "uppercase",
    marginBottom: "4px",
    margin: "0 0 4px",
  },
  cardValue: {
    fontFamily: "'Playfair Display', serif",
    fontWeight: 700,
    fontSize: "17px",
    textDecoration: "underline",
    textDecorationColor: "rgba(61,186,116,0.35)",
    textUnderlineOffset: "3px",
    margin: "0 0 2px",
  },
  cardSub: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "12px",
    color: "rgba(255,255,255,0.5)",
    margin: 0,
  },
  confScore: {
    fontFamily: "'Playfair Display', serif",
    fontWeight: 700,
    fontSize: "26px",
    color: "#2d8c5e",
    margin: "0 0 6px",
  },
  confTrack: {
    height: "5px",
    borderRadius: "999px",
    background: "rgba(45,140,94,0.15)",
    marginBottom: "6px",
    overflow: "hidden",
  },
  confFill: {
    height: "100%",
    borderRadius: "999px",
    background: "linear-gradient(90deg, #2d8c5e, #3dba74)",
  },

  // Dark cards
  darkCard: {
    ...cardBase,
    background: "rgba(255,255,255,0.06)",
  },
  sectionTitle: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13px",
    fontWeight: 600,
    color: "rgba(255,255,255,0.75)",
    marginBottom: "14px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    margin: "0 0 14px",
  },
  greenUnderline: {
    color: "#3dba74",
    textDecoration: "underline",
    textDecorationColor: "rgba(61,186,116,0.35)",
    textUnderlineOffset: "3px",
  },

  // Persona grid — 3 cols desktop, 2 cols mobile
  personaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
    gap: "10px",
  },
  personaCell: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: "10px",
    padding: "10px 12px",
  },
  personaValue: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13px",
    color: "#3dba74",
    textDecoration: "underline",
    textDecorationColor: "rgba(61,186,116,0.3)",
    textUnderlineOffset: "3px",
    margin: 0,
  },

  // Skill gap
  skillGapWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  skillPill: {
    padding: "8px 14px",
    borderRadius: "999px",
    background: "rgba(61,186,116,0.15)",
    border: "1px solid rgba(61,186,116,0.3)",
    fontSize: "13px",
    fontFamily: "'DM Sans', sans-serif",
  },
  emptyText: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13px",
    color: "rgba(255,255,255,0.6)",
    margin: 0,
  },

  // Langkah
  langkahList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  langkahItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    padding: "12px 14px",
    flexWrap: "wrap",
  },
  langkahNo: {
    width: "26px",
    height: "26px",
    borderRadius: "50%",
    background: "rgba(45,140,94,0.3)",
    border: "1.5px solid rgba(61,186,116,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 700,
    fontSize: "12px",
    color: "#3dba74",
    flexShrink: 0,
  },
  langkahText: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13px",
    color: "rgba(255,255,255,0.8)",
    flex: 1,
    margin: 0,
    textDecoration: "underline",
    textDecorationColor: "rgba(255,255,255,0.2)",
    textUnderlineOffset: "3px",
    minWidth: "120px",
  },
  langkahBadge: {
    padding: "4px 10px",
    borderRadius: "999px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "11px",
    fontWeight: 600,
    color: "white",
    flexShrink: 0,
  },

  // CTA buttons — stack on mobile
  ctaRow: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: "12px",
  },
  secondaryBtn: {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.07)",
    color: "rgba(255,255,255,0.75)",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
    textDecoration: "underline",
    textDecorationColor: "rgba(255,255,255,0.2)",
    textUnderlineOffset: "3px",
  },
  primaryBtn: {
    padding: "14px 28px",
    borderRadius: "12px",
    border: "none",
    background: "rgba(61,186,116,0.75)",
    color: "white",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
    whiteSpace: "nowrap",
  },
};