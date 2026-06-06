// src/pages/AssessmentPage.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo, StarField } from "../../components/Shared";
import { useAssessment } from "../../context/AssessmentContext";
import api from "../../api/axios";

const QUESTIONS = [
  {
    id: 1,
    category: "Situasi",
    question: "Situasi kamu sekarang gimana?",
    options: [
      "mahasiswa aktif",
      "fresh graduate",
      "kerja",
      "ingin berpindah pekerjaan",
    ],
  },
  {
    id: 2,
    category: "Kendala",
    question: "Bagian mana yang paling bikin kamu bingung sekarang?",
    options: [
      "gatau mau mulai dari mana",
      "banyak skill, tapi bingung banget",
      "takut salah jalur",
      "sudah belajar, tapi merasa tidak berkembang",
      "belum punya portfolio",
    ],
  },
  {
    id: 3,
    category: "Target Role",
    question: "Kamu ingin diarahkan ke jalur apa dulu?",
    options: [
      "Frontend Developer",
      "Backend Developer",
      "UI/UX Designer",
      "Machine Learning Engineer",
      "SOC Analyst",
      "Masih bingung",
    ],
  },
  {
    id: 4,
    category: "Level",
    question: "Level skill kamu sekarang menurut kamu gimana?",
    options: ["beginner", "intermediate", "advanced"],
  },
];

const TOTAL_QUESTIONS = QUESTIONS.length;

export default function AssessmentPage() {
  const navigate = useNavigate();
  const { draft, setDraft } = useAssessment();

  const [currentQ, setCurrentQ] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const answers = draft.answers || {};
  const q = QUESTIONS[currentQ];
  const selected = answers[q.id];
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / TOTAL_QUESTIONS) * 100);

  const handleSelect = (option) => {
    setDraft((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [q.id]: option,
      },
    }));
  };

  const handleNext = async () => {
    const updatedDraft = { ...draft, answers };
    setDraft(updatedDraft);

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ((prev) => prev + 1);
      return;
    }

    if (submitting) return;

    try {
      setSubmitting(true);
      navigate("/loading");

      const roleAnswer = updatedDraft.answers[3];
      const blockerAnswer = updatedDraft.answers[2];
      const levelAnswer = updatedDraft.answers[4] || "beginner";

      const roleMap = {
        "Frontend Developer": "Frontend Developer",
        "Backend Developer": "Backend Developer",
        "UI/UX Designer": "UI/UX Designer",
        "Machine Learning Engineer": "Machine Learning Engineer",
        "SOC Analyst": "SOC Analyst",
        "Masih bingung": "Frontend Developer",
      };

      const blockerMap = {
        "gatau mau mulai dari mana": "belum_tahu_mulai",
        "banyak skill, tapi bingung banget": "skill_belum_cukup",
        "takut salah jalur": "takut_salah_pilih",
        "sudah belajar, tapi merasa tidak berkembang": "skill_belum_cukup",
        "belum punya portfolio": "belum_ada_portfolio",
      };

      const problemCategoryMap = {
        "gatau mau mulai dari mana": "Bingung mulai belajar dari mana",
        "banyak skill, tapi bingung banget": "Skill belum cukup",
        "takut salah jalur": "Takut salah pilih jalur",
        "sudah belajar, tapi merasa tidak berkembang": "Skill belum cukup",
        "belum punya portfolio": "Belum punya portfolio",
      };

      const payload = {
        targetRole: roleMap[roleAnswer] || "Frontend Developer",
        currentLevel: levelAnswer,
        problemCategory:
          problemCategoryMap[blockerAnswer] || "Bingung mulai belajar dari mana",
        blockerType: blockerMap[blockerAnswer] || "belum_tahu_mulai",
        maxQuestions: 3,
        answers: QUESTIONS.map((questionItem) => ({
          question: questionItem.question,
          answer: updatedDraft.answers[questionItem.id] || "",
        })),
      };

      const response = await api.post("/assessments/analyze", payload);
      console.log("RESPONSE:");
      console.log(response.data);

      setDraft((prev) => ({
        ...prev,
        assessmentPayload: payload,
        analysisResult: response.data.data.analysis,
        skillGap: response.data.data.skillGap,
        recommendedTasks: response.data.data.recommendedTasks,
        aiResult: response.data.data.ai,
      }));

      setSubmitting(false);
      navigate("/hasil-analisis");
    } catch (error) {
      console.log(error);
      setSubmitting(false);
      alert("Gagal analyze assessment");
    }
  };

  const handlePrev = () => {
    if (currentQ > 0) {
      setCurrentQ((prev) => prev - 1);
    } else {
      navigate("/input");
    }
  };

  return (
    <div style={styles.page}>
      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <Logo />

        <div style={styles.navCounter}>
          Pertanyaan{" "}
          <span style={styles.navCounterBold}>{currentQ + 1}</span>
          {" "}dari{" "}
          <span style={styles.navCounterBold}>{TOTAL_QUESTIONS}</span>
        </div>

        <button className="ghost-btn">Lewati →</button>
      </nav>

      {/* PROGRESS BAR */}
      <div style={styles.progressTrack}>
        <div
          style={{
            ...styles.progressFill,
            width: `${progressPercent}%`,
          }}
        />
      </div>

      {/* CONTENT */}
      <section style={styles.content}>
        <div className="mesh-bg" />
        <StarField />

        <div style={styles.inner}>
          {/* HEADER ROW */}
          <div style={styles.headerRow}>
            <span style={styles.stepLabel}>
              Langkah{" "}
              <span style={styles.stepLabelBold}>{currentQ + 1}</span>
              {" "}dari {TOTAL_QUESTIONS}
            </span>

            <div style={styles.headerRight}>
              <div className="badge-pill" style={styles.badge}>
                <span style={styles.badgeDot} />
                Assessment Karir
              </div>
              <span style={styles.percentLabel}>{progressPercent}%</span>
            </div>
          </div>

          {/* CARD */}
          <div style={styles.card}>
            {/* CARD TOP */}
            <div style={styles.cardTop}>
              <span style={styles.questionCounter}>
                Pertanyaan {currentQ + 1}
              </span>
              <span style={styles.categoryBadge}>{q.category}</span>
            </div>

            {/* QUESTION */}
            <h2 style={styles.questionText}>{q.question}</h2>

            {/* OPTIONS */}
            <div style={styles.optionsList}>
              {q.options.map((option) => {
                const isSelected = selected === option;
                return (
                  <button
                    key={option}
                    onClick={() => handleSelect(option)}
                    style={{
                      ...styles.optionBtn,
                      border: isSelected
                        ? "1px solid rgba(45,140,94,0.5)"
                        : "1px solid rgba(255,255,255,0.08)",
                      background: isSelected
                        ? "rgba(45,140,94,0.15)"
                        : "rgba(255,255,255,0.03)",
                    }}
                  >
                    <div
                      style={{
                        ...styles.radio,
                        border: isSelected
                          ? "2px solid #3dba74"
                          : "2px solid rgba(255,255,255,0.25)",
                      }}
                    >
                      {isSelected && <div style={styles.radioDot} />}
                    </div>
                    <span
                      style={{
                        ...styles.optionText,
                        color: isSelected
                          ? "rgba(255,255,255,0.95)"
                          : "rgba(255,255,255,0.65)",
                      }}
                    >
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* FOOTER */}
            <div style={styles.cardFooter}>
              <button onClick={handlePrev} className="ghost-btn">
                ← Sebelumnya
              </button>

              <button
                onClick={handleNext}
                className="cta-btn"
                style={styles.nextBtn}
                disabled={!selected || submitting}
              >
                {submitting
                  ? "Analyzing..."
                  : currentQ === QUESTIONS.length - 1
                  ? "Analisis AI →"
                  : "Selanjutnya →"}
              </button>
            </div>
          </div>

          {/* ANSWER COUNT */}
          <p style={styles.answerCount}>
            {answeredCount} dari {TOTAL_QUESTIONS} pertanyaan dijawab
          </p>
        </div>
      </section>
    </div>
  );
}

/* ─── Styles ─────────────────────────────────────────────────────────────── */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0a1f12",
    color: "white",
    display: "flex",
    flexDirection: "column",
  },

  // Navbar
  navbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px clamp(16px, 5vw, 40px)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    gap: "12px",
  },
  navCounter: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13px",
    color: "rgba(255,255,255,0.45)",
    whiteSpace: "nowrap",
  },
  navCounterBold: {
    color: "white",
    fontWeight: 600,
  },

  // Progress
  progressTrack: {
    height: "3px",
    background: "rgba(255,255,255,0.08)",
    flexShrink: 0,
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #2d8c5e, #3dba74)",
    transition: "width 0.5s ease",
  },

  // Content area
  content: {
    flex: 1,
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "clamp(24px, 5vw, 40px) clamp(16px, 4vw, 24px)",
    overflow: "hidden",
  },
  inner: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: "600px",
  },

  // Header row
  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "14px",
    flexWrap: "wrap",
    gap: "8px",
  },
  stepLabel: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13px",
    color: "rgba(255,255,255,0.4)",
  },
  stepLabelBold: {
    color: "rgba(255,255,255,0.8)",
    fontWeight: 600,
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  badge: {
    marginBottom: 0,
    fontSize: "11px",
    padding: "4px 12px",
  },
  badgeDot: {
    width: "5px",
    height: "5px",
    borderRadius: "50%",
    background: "#4de89a",
    flexShrink: 0,
    display: "inline-block",
  },
  percentLabel: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "12px",
    color: "rgba(255,255,255,0.35)",
  },

  // Card
  card: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "16px",
    padding: "clamp(20px, 4vw, 28px)",
    backdropFilter: "blur(8px)",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    flexWrap: "wrap",
    gap: "8px",
  },
  questionCounter: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "12px",
    color: "rgba(255,255,255,0.35)",
  },
  categoryBadge: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "11px",
    color: "rgba(100,220,150,0.8)",
    background: "rgba(45,140,94,0.15)",
    border: "1px solid rgba(45,140,94,0.3)",
    borderRadius: "999px",
    padding: "3px 10px",
  },

  // Question
  questionText: {
    fontFamily: "'Playfair Display', serif",
    fontWeight: 700,
    fontSize: "clamp(18px, 3.5vw, 24px)",
    lineHeight: 1.35,
    marginBottom: "20px",
    margin: "0 0 20px",
  },

  // Options
  optionsList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
  },
  optionBtn: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.18s",
    width: "100%",
  },
  radio: {
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#3dba74",
  },
  optionText: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "14px",
  },

  // Card footer
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "4px",
  },
  nextBtn: {
    padding: "10px 24px",
    fontSize: "13px",
    animation: "none",
  },

  // Answer count
  answerCount: {
    textAlign: "center",
    marginTop: "16px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "12px",
    color: "rgba(255,255,255,0.3)",
  },
};