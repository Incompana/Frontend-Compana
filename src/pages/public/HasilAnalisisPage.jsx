// src/pages/public/HasilAnalisisPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { Logo, StarField } from "../../components/Shared";
import LoginRegisterPrompt from "../../components/LoginRegisterPrompt";
import { useAssessment } from "../../context/AssessmentContext";
import api from "../../api/axios";

export default function HasilAnalisisPage({ onSelesai }) {
  const navigate = useNavigate();
  const { draft, clearDraft } = useAssessment();

  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [saving, setSaving] = useState(false);

  const answers = draft.answers || {};
  const analysis = draft.analysisResult || {};
  const skillGap = draft.skillGap || [];
  const recommendedTasks = draft.recommendedTasks || [];

  const formatLabel = (value = "") =>
    String(value || "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

  const targetRole = formatLabel(analysis.role || "Career Path");
  const problemCategory = analysis.problemCategory || "Skill Gap";
  const confidenceScore = Number(analysis.confidence || 0);
  const currentLevel = analysis.currentLevel || answers[4] || "Belum ditentukan";
  const persona = formatLabel(
    analysis.personaType || analysis.persona || "Career Explorer"
  );

  const problemDesc =
    analysis.summary ||
    analysis.problemDescription ||
    "AI menemukan beberapa area yang bisa kamu perkuat lewat action plan.";

  const steps = recommendedTasks.length
    ? recommendedTasks
    : ["Buka action plan untuk melihat task AI pertama kamu"];

  const storePendingAssessment = () => {
    if (!draft?.assessmentPayload) {
      toast.error("Data assessment belum tersedia");
      navigate("/assessment");
      return false;
    }

    sessionStorage.setItem(
      "pendingAssessmentPayload",
      JSON.stringify(draft.assessmentPayload)
    );
    sessionStorage.setItem("pendingAssessmentRedirect", "/skill-gap");

    return true;
  };

  const updateLocalUserAssessmentStatus = () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user) return;

    localStorage.setItem(
      "user",
      JSON.stringify({
        ...user,
        is_assessment_done: true,
        isAssessmentDone: true,
      })
    );
  };

  const handleNextJourney = async () => {
    if (!draft?.assessmentPayload) {
      toast.error("Data assessment belum tersedia");
      navigate("/assessment");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token || token === "undefined" || token === "null") {
      if (!storePendingAssessment()) return;
      setShowLoginPrompt(true);
      return;
    }

    try {
      setSaving(true);

      const saveResponse = await api.post(
        "/assessments/save",
        draft.assessmentPayload
      );

      localStorage.setItem(
        "lastAssessmentResult",
        JSON.stringify(saveResponse.data?.data || saveResponse.data)
      );

      updateLocalUserAssessmentStatus();
      clearDraft();

      toast.success("Hasil assessment berhasil disimpan");
      navigate("/skill-gap");
    } catch (error) {
      console.log(error.response?.data || error.message);
      toast.error("Gagal menyimpan hasil assessment");
    } finally {
      setSaving(false);
    }
  };

  const handleFinish = () => {
    if (onSelesai) {
      onSelesai();
      return;
    }

    navigate("/");
  };

  const goToLogin = () => {
    if (!storePendingAssessment()) return;
    navigate("/login?redirect=/skill-gap&saveAssessment=1");
  };

  const goToRegister = () => {
    if (!storePendingAssessment()) return;
    navigate("/register?redirect=/skill-gap&saveAssessment=1");
  };

  return (
    <div className="result-page">
      <nav className="result-navbar">
        <Logo />

        <div className="result-nav-pill">Hasil Analisis</div>

        <button type="button" onClick={handleFinish} className="result-nav-button">
          Selesai ✓
        </button>
      </nav>

      <main className="result-main">
        <div className="mesh-bg" />
        <StarField />

        <section className="result-content">
          <header className="result-header">
            <div className="result-icon">🧠</div>

            <h1>
              <span>Analisismu</span> sudah siap
            </h1>

            <p>
              AI sudah membaca jawabanmu dan menyiapkan skill gap serta langkah
              pertama yang bisa langsung kamu kerjakan.
            </p>
          </header>

          <div className="result-summary-grid">
            <article className="result-light-card">
              <div className="result-card-icon">💻</div>
              <p className="result-label">Target Role</p>
              <h3>{targetRole}</h3>
              <p className="result-muted">Level: {formatLabel(currentLevel)}</p>
            </article>

            <article className="result-light-card">
              <div className="result-card-icon result-warning">😕</div>
              <p className="result-label">Problem Category</p>
              <h3 className="warning-text">{problemCategory}</h3>
              <p className="result-muted">Persona: {persona}</p>
            </article>

            <article className="result-light-card">
              <div className="result-card-icon">📊</div>
              <p className="result-label">Confidence</p>
              <h3 className="result-score">{confidenceScore}%</h3>

              <div className="result-score-track">
                <div
                  className="result-score-fill"
                  style={{
                    width: `${Math.min(100, Math.max(0, confidenceScore))}%`,
                  }}
                />
              </div>

              <p className="result-muted">Berdasarkan hasil assessment AI</p>
            </article>
          </div>

          <article className="result-dark-card result-description">
            <h3>📝 Ringkasan AI</h3>
            <p>{problemDesc}</p>
          </article>

          <div className="result-detail-grid">
            <article className="result-dark-card">
              <h3>🚀 Skill Gap Prioritas</h3>

              <div className="result-chip-list">
                {skillGap.length ? (
                  skillGap.map((skill) => (
                    <span key={skill} className="result-chip">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="result-empty">
                    Skill gap akan muncul setelah assessment berhasil diproses.
                  </p>
                )}
              </div>
            </article>

            <article className="result-dark-card">
              <h3>🎯 Langkah Pertama</h3>

              <div className="result-step-list">
                {steps.slice(0, 3).map((task, index) => (
                  <div key={`${task}-${index}`} className="result-step">
                    <span>{index + 1}</span>
                    <p>{task}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <button
            type="button"
            onClick={handleNextJourney}
            disabled={saving}
            className="result-primary-button"
          >
            {saving
              ? "Menyimpan hasil..."
              : "Simpan Hasil & Lanjutkan Journey →"}
          </button>
        </section>
      </main>

      {showLoginPrompt && (
        <LoginRegisterPrompt
          open={showLoginPrompt}
          onLogin={goToLogin}
          onRegister={goToRegister}
          onSkip={() => setShowLoginPrompt(false)}
          onCancel={() => setShowLoginPrompt(false)}
        />
      )}

      <style>{`
        .result-page {
          min-height: 100vh;
          background: #0a1f12;
          color: white;
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
        }

        .result-navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 14px clamp(20px, 4vw, 40px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          position: relative;
          z-index: 2;
        }

        .result-nav-pill {
          padding: 6px 18px;
          border-radius: 999px;
          border: 1.5px solid rgba(61,186,116,0.5);
          background: rgba(61,186,116,0.08);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(255,255,255,0.82);
          font-weight: 800;
          white-space: nowrap;
        }

        .result-nav-button {
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.58);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          white-space: nowrap;
        }

        .result-nav-button:hover {
          color: white;
        }

        .result-main {
          flex: 1;
          position: relative;
          display: flex;
          justify-content: center;
          padding: clamp(22px, 5vh, 42px) clamp(16px, 4vw, 24px) 54px;
          overflow: hidden;
        }

        .result-content {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 820px;
          animation: resultSlideUp 0.55s ease both;
        }

        .result-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .result-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(45,140,94,0.25);
          border: 1.5px solid rgba(61,186,116,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          margin: 0 auto 16px;
        }

        .result-header h1 {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: clamp(30px, 5vw, 42px);
          line-height: 1.12;
          margin: 0 0 10px;
          letter-spacing: -0.5px;
        }

        .result-header h1 span {
          color: #3dba74;
          text-decoration: underline;
          text-decoration-color: rgba(61,186,116,0.38);
          text-underline-offset: 6px;
        }

        .result-header p {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(13px, 2vw, 15px);
          color: rgba(255,255,255,0.58);
          line-height: 1.7;
          max-width: 590px;
          margin: 0 auto;
        }

        .result-summary-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 14px;
        }

        .result-light-card,
        .result-dark-card {
          border-radius: 17px;
          padding: 18px;
          min-width: 0;
        }

        .result-light-card {
          background: rgba(255,255,255,0.94);
          border: 1px solid rgba(255,255,255,0.18);
          color: #1a3a2a;
        }

        .result-dark-card {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.11);
        }

        .result-card-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(45,140,94,0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 17px;
          margin-bottom: 10px;
        }

        .result-card-icon.result-warning {
          background: rgba(220,140,80,0.18);
        }

        .result-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 0.08em;
          color: rgba(40,70,55,0.48);
          text-transform: uppercase;
          margin: 0 0 6px;
          font-weight: 900;
        }

        .result-light-card h3 {
          margin: 0;
          color: #2d8c5e;
          font-size: 18px;
          font-family: 'DM Sans', sans-serif;
          line-height: 1.3;
        }

        .result-light-card h3.warning-text {
          color: #c07030;
        }

        .result-light-card h3.result-score {
          margin: 0 0 8px;
          color: #2d8c5e;
          font-size: 28px;
          font-family: 'Playfair Display', serif;
        }

        .result-muted {
          margin: 6px 0 0;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          color: rgba(40,70,55,0.62);
          line-height: 1.5;
        }

        .result-score-track {
          height: 6px;
          border-radius: 999px;
          background: rgba(45,140,94,0.15);
          overflow: hidden;
        }

        .result-score-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #2d8c5e, #3dba74);
        }

        .result-description {
          margin-bottom: 14px;
        }

        .result-dark-card h3 {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #3dba74;
          margin: 0 0 12px;
        }

        .result-description p,
        .result-empty {
          font-family: 'DM Sans', sans-serif;
          margin: 0;
          color: rgba(255,255,255,0.62);
          font-size: 13px;
          line-height: 1.7;
        }

        .result-detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 20px;
        }

        .result-chip-list {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
        }

        .result-chip {
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(61,186,116,0.14);
          border: 1px solid rgba(61,186,116,0.28);
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          color: rgba(255,255,255,0.85);
        }

        .result-step-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .result-step {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 12px;
          border-radius: 12px;
          background: rgba(255,255,255,0.045);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .result-step span {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: rgba(45,140,94,0.28);
          color: #3dba74;
          font-weight: 900;
          font-size: 12px;
          font-family: 'DM Sans', sans-serif;
        }

        .result-step p {
          margin: 0;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(255,255,255,0.82);
          line-height: 1.45;
        }

        .result-primary-button {
          width: 100%;
          padding: 15px 20px;
          border-radius: 14px;
          border: none;
          background: #3dba74;
          color: white;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 0 12px 32px rgba(45,140,94,0.25);
          transition: transform 0.2s, background 0.2s, opacity 0.2s;
        }

        .result-primary-button:hover:not(:disabled) {
          background: #45c77f;
          transform: translateY(-1px);
        }

        .result-primary-button:disabled {
          opacity: 0.52;
          cursor: not-allowed;
        }

        @keyframes resultSlideUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 780px) {
          .result-summary-grid,
          .result-detail-grid {
            grid-template-columns: 1fr;
          }

          .result-main {
            padding-top: 28px;
          }
        }

        @media (max-width: 520px) {
          .result-navbar {
            padding: 14px 18px;
            gap: 10px;
          }

          .result-nav-pill {
            display: none;
          }

          .result-light-card,
          .result-dark-card {
            padding: 16px;
          }

          .result-icon {
            width: 58px;
            height: 58px;
            font-size: 25px;
          }

          .result-primary-button {
            font-size: 14px;
            padding: 14px 16px;
          }
        }

        @media (min-width: 1024px) {
          .result-main {
            padding-top: 46px;
          }
        }
      `}</style>
    </div>
  );
}
