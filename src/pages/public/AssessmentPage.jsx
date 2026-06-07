// src/pages/public/AssessmentPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo, StarField } from "../../components/Shared";
import { useAssessment } from "../../context/AssessmentContext";
import api from "../../api/axios";

const MIN_LOADING_TIME_MS = 16000;

const wait = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

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

export default function AssessmentPage() {
  const navigate = useNavigate();
  const { draft, setDraft } = useAssessment();

  const [currentQ, setCurrentQ] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const answers = draft.answers || {};
  const q = QUESTIONS[currentQ];
  const selected = answers[q.id];

  const answeredCount = Object.values(answers).filter(Boolean).length;

  /*
    Progress visual mengikuti posisi pertanyaan, bukan jumlah jawaban lama
    di draft. Ini mencegah progress terlihat 100% saat user kembali ke Q1.
  */
  const progressPercent = Math.round(((currentQ + 1) / TOTAL_QUESTIONS) * 100);

  const handleSelect = (option) => {
    setDraft((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [q.id]: option,
      },
    }));
  };

  const buildPayload = (latestAnswers) => {
    const roleAnswer = latestAnswers[3];
    const blockerAnswer = latestAnswers[2];
    const levelAnswer = latestAnswers[4] || "beginner";

    return {
      targetRole: roleMap[roleAnswer] || "Frontend Developer",
      currentLevel: levelAnswer,
      problemCategory:
        problemCategoryMap[blockerAnswer] || "Bingung mulai belajar dari mana",
      blockerType: blockerMap[blockerAnswer] || "belum_tahu_mulai",
      maxQuestions: 3,
      answers: QUESTIONS.map((questionItem) => ({
        question: questionItem.question,
        answer: latestAnswers[questionItem.id] || "",
      })),
    };
  };

  const handleNext = async () => {
    if (!selected || submitting) return;

    const updatedDraft = {
      ...draft,
      answers,
    };

    setDraft(updatedDraft);

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ((prev) => prev + 1);
      return;
    }

    try {
      setSubmitting(true);

      const payload = buildPayload(updatedDraft.answers);

      navigate("/loading");

      /*
        Request AI tetap langsung berjalan, tapi halaman loading dipertahankan
        minimal 16 detik supaya user sempat membaca quote penyemangat.
      */
      const [response] = await Promise.all([
        api.post("/assessments/analyze", payload),
        wait(MIN_LOADING_TIME_MS),
      ]);

      const data = response.data?.data || response.data;

      setDraft((prev) => ({
        ...prev,
        assessmentPayload: payload,
        analysisResult: data.analysis,
        skillGap: data.skillGap,
        recommendedTasks: data.recommendedTasks,
        aiResult: data.ai,
      }));

      navigate("/hasil-analisis");
    } catch (error) {
      console.log(error.response?.data || error.message);
      alert("Gagal analyze assessment");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrev = () => {
    if (currentQ > 0) {
      setCurrentQ((prev) => prev - 1);
      return;
    }

    navigate("/input");
  };

  const handleSkip = () => {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ((prev) => prev + 1);
      return;
    }

    navigate("/input");
  };

  return (
    <div className="assessment-page">
      <nav className="assessment-navbar">
        <div className="assessment-logo-wrap">
          <Logo />
        </div>

        <div className="assessment-nav-step">
          Pertanyaan <span>{currentQ + 1}</span> dari <span>{TOTAL_QUESTIONS}</span>
        </div>

        <button
          type="button"
          className="assessment-skip-desktop"
          onClick={handleSkip}
        >
          Lewati →
        </button>
      </nav>

      <div className="assessment-progress-track">
        <div
          className="assessment-progress-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <main className="assessment-main">
        <div className="mesh-bg" />
        <StarField />

        <section className="assessment-content">
          <div className="assessment-top-row">
            <div className="assessment-small-step">
              Langkah <span>{currentQ + 1}</span> dari {TOTAL_QUESTIONS}
            </div>

            <div className="assessment-meta">
              <div className="badge-pill assessment-badge">
                <span className="assessment-badge-dot" />
                Assessment Karir
              </div>

              <span className="assessment-percent">{progressPercent}%</span>
            </div>
          </div>

          <div className="assessment-card">
            <div className="assessment-card-header">
              <span>Pertanyaan {currentQ + 1}</span>
              <span>{q.category}</span>
            </div>

            <h1 className="assessment-question">{q.question}</h1>

            <div className="assessment-options">
              {q.options.map((option) => {
                const isSelected = selected === option;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`assessment-option ${isSelected ? "selected" : ""}`}
                  >
                    <span className="assessment-radio">
                      {isSelected && <span />}
                    </span>

                    <span className="assessment-option-text">{option}</span>
                  </button>
                );
              })}
            </div>

            <div className="assessment-actions">
              <button
                type="button"
                onClick={handlePrev}
                className="assessment-ghost-button"
              >
                ← Sebelumnya
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="assessment-primary-button"
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

          <p className="assessment-count">
            {answeredCount} dari {TOTAL_QUESTIONS} pertanyaan dijawab
          </p>

          <button
            type="button"
            onClick={handleSkip}
            className="assessment-skip-mobile"
          >
            Lewati pertanyaan ini →
          </button>
        </section>
      </main>

      <style>{`
        .assessment-page {
          min-height: 100vh;
          background: #0a1f12;
          color: white;
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
        }

        .assessment-navbar {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto auto;
          align-items: center;
          gap: 18px;
          padding: 16px clamp(20px, 4vw, 40px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          position: relative;
          z-index: 2;
          min-width: 0;
        }

        .assessment-logo-wrap {
          min-width: 0;
          overflow: hidden;
        }

        .assessment-nav-step,
        .assessment-small-step,
        .assessment-percent {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(255,255,255,0.45);
          white-space: nowrap;
        }

        .assessment-nav-step span,
        .assessment-small-step span {
          color: white;
          font-weight: 800;
        }

        .assessment-skip-desktop,
        .assessment-skip-mobile,
        .assessment-ghost-button {
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.55);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          transition: color 0.2s, border-color 0.2s;
          white-space: nowrap;
        }

        .assessment-skip-desktop:hover,
        .assessment-skip-mobile:hover,
        .assessment-ghost-button:hover {
          color: white;
        }

        .assessment-skip-mobile {
          display: none;
        }

        .assessment-progress-track {
          height: 3px;
          background: rgba(255,255,255,0.08);
          flex-shrink: 0;
        }

        .assessment-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #2d8c5e, #3dba74);
          transition: width 0.45s ease;
        }

        .assessment-main {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(28px, 6vh, 56px) clamp(16px, 4vw, 24px) 28px;
          overflow: hidden;
        }

        .assessment-content {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 660px;
          animation: assessmentSlideUp 0.45s ease both;
        }

        .assessment-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 14px;
        }

        .assessment-meta {
          display: flex;
          align-items: center;
          gap: 18px;
          min-width: 0;
        }

        .assessment-badge {
          margin-bottom: 0;
          font-size: 11px;
          padding: 5px 12px;
        }

        .assessment-badge-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #4de89a;
          flex-shrink: 0;
          box-shadow: 0 0 8px rgba(77,232,154,0.7);
        }

        .assessment-card {
          background: rgba(255,255,255,0.055);
          border: 1px solid rgba(255,255,255,0.11);
          border-radius: 18px;
          padding: clamp(18px, 4vw, 30px);
          backdrop-filter: blur(8px);
          box-shadow: 0 20px 70px rgba(0,0,0,0.18);
        }

        .assessment-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 18px;
          font-family: 'DM Sans', sans-serif;
        }

        .assessment-card-header span:first-child {
          font-size: 12px;
          color: rgba(255,255,255,0.36);
        }

        .assessment-card-header span:last-child {
          font-size: 11px;
          color: rgba(100, 220, 150, 0.88);
          background: rgba(45,140,94,0.15);
          border: 1px solid rgba(45,140,94,0.3);
          border-radius: 999px;
          padding: 4px 11px;
          white-space: nowrap;
        }

        .assessment-question {
          font-family: 'Playfair Display', serif;
          font-weight: 800;
          font-size: clamp(22px, 4vw, 30px);
          line-height: 1.25;
          margin: 0 0 22px;
          letter-spacing: -0.3px;
        }

        .assessment-options {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 22px;
        }

        .assessment-option {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 14px 16px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.035);
          cursor: pointer;
          text-align: left;
          transition: background 0.18s, border-color 0.18s, transform 0.18s;
        }

        .assessment-option:hover {
          background: rgba(255,255,255,0.06);
          transform: translateY(-1px);
        }

        .assessment-option.selected {
          border-color: rgba(45,140,94,0.55);
          background: rgba(45,140,94,0.16);
        }

        .assessment-radio {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          flex-shrink: 0;
          border: 2px solid rgba(255,255,255,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .assessment-option.selected .assessment-radio {
          border-color: #3dba74;
        }

        .assessment-radio span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #3dba74;
        }

        .assessment-option-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          line-height: 1.45;
          color: rgba(255,255,255,0.72);
        }

        .assessment-option.selected .assessment-option-text {
          color: rgba(255,255,255,0.96);
          font-weight: 700;
        }

        .assessment-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
        }

        .assessment-primary-button {
          border: none;
          border-radius: 12px;
          padding: 12px 25px;
          background: rgba(45, 140, 94, 0.95);
          color: white;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 900;
          cursor: pointer;
          transition: transform 0.2s, background 0.2s, opacity 0.2s;
          white-space: nowrap;
        }

        .assessment-primary-button:hover:not(:disabled) {
          background: #3dba74;
          transform: translateY(-1px);
        }

        .assessment-primary-button:disabled {
          opacity: 0.42;
          cursor: not-allowed;
        }

        .assessment-count {
          text-align: center;
          margin: 16px 0 0;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          color: rgba(255,255,255,0.32);
        }

        @keyframes assessmentSlideUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 860px) {
          .assessment-navbar {
            grid-template-columns: 1fr;
            justify-items: center;
            padding: 14px 18px;
            gap: 0;
          }

          .assessment-logo-wrap {
            width: 100%;
            display: flex;
            justify-content: center;
          }

          .assessment-nav-step,
          .assessment-skip-desktop {
            display: none;
          }

          .assessment-main {
            align-items: flex-start;
            padding: 26px 14px 24px;
          }

          .assessment-content {
            max-width: 100%;
          }

          .assessment-top-row {
            display: grid;
            grid-template-columns: 1fr;
            gap: 10px;
            margin-bottom: 12px;
          }

          .assessment-small-step {
            text-align: center;
            font-size: 13px;
          }

          .assessment-meta {
            width: 100%;
            display: grid;
            grid-template-columns: 1fr auto;
            align-items: center;
            gap: 10px;
          }

          .assessment-badge {
            justify-content: center;
            width: 100%;
            box-sizing: border-box;
          }

          .assessment-percent {
            font-size: 12px;
          }

          .assessment-card {
            border-radius: 16px;
            padding: 22px 18px;
          }

          .assessment-card-header {
            margin-bottom: 16px;
          }

          .assessment-actions {
            flex-direction: column-reverse;
            align-items: stretch;
            gap: 10px;
          }

          .assessment-primary-button,
          .assessment-ghost-button {
            width: 100%;
            min-height: 46px;
            text-align: center;
          }

          .assessment-ghost-button {
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 12px;
          }

          .assessment-skip-mobile {
            display: block;
            margin: 12px auto 0;
            padding: 10px 14px;
            border-radius: 12px;
          }
        }

        @media (max-width: 480px) {
          .assessment-main {
            padding-left: 12px;
            padding-right: 12px;
          }

          .assessment-card {
            padding: 20px 16px;
          }

          .assessment-question {
            font-size: 24px;
          }

          .assessment-option {
            padding: 13px 14px;
            min-height: 56px;
          }

          .assessment-option-text {
            font-size: 14px;
          }

          .assessment-card-header span:first-child {
            font-size: 11px;
          }

          .assessment-card-header span:last-child {
            font-size: 11px;
          }
        }

        @media (max-width: 360px) {
          .assessment-question {
            font-size: 22px;
          }

          .assessment-option-text {
            font-size: 13px;
          }

          .assessment-meta {
            grid-template-columns: 1fr;
          }

          .assessment-percent {
            text-align: center;
          }
        }

        @media (min-width: 1024px) {
          .assessment-main {
            padding-top: 62px;
            padding-bottom: 42px;
          }
        }
      `}</style>
    </div>
  );
}
