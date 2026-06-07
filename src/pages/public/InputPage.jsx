// src/pages/public/InputPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo, StarField } from "../../components/Shared";
import { useAssessment } from "../../context/AssessmentContext";

const TOPICS = [
  { icon: "🎓", label: "Baru lulus kuliah" },
  { icon: "🔄", label: "Mau ganti karir" },
  { icon: "📊", label: "Ingin naik jabatan" },
];

export default function InputPage() {
  const navigate = useNavigate();
  const { draft, setDraft } = useAssessment();

  const [text, setText] = useState(draft.inputText || "");

  const handleNext = () => {
    if (text.trim().length < 5) return;

    setDraft((prev) => ({
      ...prev,
      inputText: text,
    }));

    navigate("/assessment");
  };

  const handleTopicClick = (label) => {
    setText((prev) =>
      prev ? `${prev} ${label.toLowerCase()}.` : `${label}.`
    );
  };

  const canContinue = text.trim().length >= 5;

  return (
    <div className="input-page">
      <nav className="input-navbar">
        <Logo />

        <div className="input-step">
          Langkah <span>1</span> dari 3
        </div>

        <button
          type="button"
          onClick={() => navigate("/assessment")}
          className="input-skip-desktop"
        >
          Lewati
        </button>
      </nav>

      <div className="input-progress-track">
        <div className="input-progress-fill" />
      </div>

      <main className="input-main">
        <div className="mesh-bg" />
        <StarField />

        <section className="input-content">
          <div className="badge-pill input-badge">
            <span className="input-badge-dot" />
            Input kondisimu
          </div>

          <h1 className="input-title">
            Ceritakan kondisimu
            <br />
            <span>sekarang</span>
          </h1>

          <p className="input-subtitle">
            Tulis apapun yang kamu rasakan. Tidak perlu sempurna, cukup jujur
            agar AI bisa memberi arahan yang lebih sesuai.
          </p>

          <div className="input-card">
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Contoh: Saya ingin jadi frontend developer tapi bingung mulai dari mana. Saya sudah coba beberapa course, tapi belum konsisten. Skill saya masih basic HTML/CSS..."
              rows={7}
              className="input-textarea"
            />

            <div className="input-card-footer">
              <div className="input-hint">
                <span>💡</span>
                <span>Semakin jujur, semakin akurat</span>
              </div>

              <button
                type="button"
                className="input-primary-button"
                disabled={!canContinue}
                onClick={handleNext}
              >
                Analyze →
              </button>
            </div>
          </div>

          <div className="input-topics">
            <p>Butuh inspirasi? Coba topik ini:</p>

            <div className="input-topic-list">
              {TOPICS.map((topic) => (
                <button
                  key={topic.label}
                  type="button"
                  onClick={() => handleTopicClick(topic.label)}
                  className="input-topic-chip"
                >
                  <span>{topic.icon}</span>
                  <span>{topic.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="input-bottom-nav">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="input-ghost-button"
        >
          ← Kembali
        </button>

        <button
          type="button"
          onClick={() => navigate("/assessment")}
          className="input-ghost-button"
        >
          Lewati
        </button>
      </footer>

      <style>{`
        .input-page {
          min-height: 100vh;
          background: #0a1f12;
          color: white;
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
        }

        .input-navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 16px clamp(20px, 4vw, 40px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          position: relative;
          z-index: 2;
        }

        .input-step {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(255,255,255,0.46);
          white-space: nowrap;
        }

        .input-step span {
          color: white;
          font-weight: 800;
        }

        .input-skip-desktop,
        .input-ghost-button {
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.5);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: color 0.2s;
          white-space: nowrap;
        }

        .input-skip-desktop:hover,
        .input-ghost-button:hover {
          color: rgba(255,255,255,0.88);
        }

        .input-progress-track {
          height: 3px;
          background: rgba(255,255,255,0.08);
          flex-shrink: 0;
        }

        .input-progress-fill {
          width: 33.33%;
          height: 100%;
          background: linear-gradient(90deg, #2d8c5e, #3dba74);
        }

        .input-main {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(28px, 6vh, 56px) clamp(16px, 4vw, 24px) 28px;
          overflow: hidden;
        }

        .input-content {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 680px;
          text-align: center;
          animation: inputSlideUp 0.55s ease both;
        }

        .input-badge {
          margin-bottom: 18px;
        }

        .input-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4de89a;
          flex-shrink: 0;
          box-shadow: 0 0 8px rgba(77,232,154,0.7);
        }

        .input-title {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: clamp(34px, 7vw, 58px);
          line-height: 1.08;
          letter-spacing: -0.8px;
          margin: 0 0 14px;
        }

        .input-title span {
          color: #3dba74;
          text-decoration: underline;
          text-decoration-color: rgba(61,186,116,0.4);
          text-underline-offset: 6px;
        }

        .input-subtitle {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(13px, 2vw, 15px);
          color: rgba(255,255,255,0.5);
          margin: 0 auto 26px;
          line-height: 1.7;
          max-width: 560px;
        }

        .input-card {
          background: rgba(255,255,255,0.055);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 18px;
          padding: clamp(16px, 3vw, 22px);
          text-align: left;
          backdrop-filter: blur(8px);
          box-shadow: 0 20px 70px rgba(0,0,0,0.18);
        }

        .input-textarea {
          width: 100%;
          min-height: clamp(150px, 28vh, 230px);
          background: transparent;
          border: none;
          outline: none;
          resize: vertical;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: rgba(255,255,255,0.88);
          line-height: 1.75;
          caret-color: #3dba74;
          box-sizing: border-box;
        }

        .input-textarea::placeholder {
          color: rgba(255,255,255,0.26);
        }

        .input-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-top: 14px;
          padding-top: 14px;
          border-top: 1px solid rgba(255,255,255,0.07);
        }

        .input-hint {
          display: flex;
          align-items: center;
          gap: 7px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          color: rgba(255,255,255,0.38);
          min-width: 0;
        }

        .input-primary-button {
          border: none;
          border-radius: 12px;
          padding: 11px 24px;
          background: rgba(45, 140, 94, 0.95);
          color: white;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 900;
          cursor: pointer;
          transition: transform 0.2s, background 0.2s, opacity 0.2s;
          white-space: nowrap;
        }

        .input-primary-button:hover:not(:disabled) {
          background: #3dba74;
          transform: translateY(-1px);
        }

        .input-primary-button:disabled {
          opacity: 0.42;
          cursor: not-allowed;
        }

        .input-topics {
          margin-top: 24px;
        }

        .input-topics p {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          color: rgba(255,255,255,0.38);
          margin: 0 0 12px;
        }

        .input-topic-list {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .input-topic-chip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.75);
          border-radius: 999px;
          padding: 9px 15px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
        }

        .input-topic-chip:hover {
          background: rgba(45,140,94,0.15);
          border-color: rgba(61,186,116,0.38);
          color: white;
        }

        .input-bottom-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
          padding: 16px clamp(20px, 4vw, 40px);
          border-top: 1px solid rgba(255,255,255,0.06);
          position: relative;
          z-index: 2;
        }

        @keyframes inputSlideUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 720px) {
          .input-navbar {
            padding: 14px 18px;
          }

          .input-skip-desktop {
            display: none;
          }

          .input-main {
            align-items: flex-start;
            padding: 30px 16px 22px;
          }

          .input-card-footer {
            align-items: stretch;
            flex-direction: column;
          }

          .input-primary-button {
            width: 100%;
            padding: 13px 20px;
          }

          .input-hint {
            justify-content: center;
            text-align: center;
          }

          .input-topic-list {
            display: grid;
            grid-template-columns: 1fr;
            width: 100%;
          }

          .input-topic-chip {
            width: 100%;
          }
        }

        @media (max-width: 430px) {
          .input-navbar {
            gap: 10px;
          }

          .input-step {
            font-size: 12px;
          }

          .input-title {
            font-size: 34px;
          }

          .input-subtitle {
            font-size: 13px;
          }

          .input-card {
            border-radius: 16px;
          }

          .input-bottom-nav {
            padding: 14px 18px;
          }
        }

        @media (min-width: 1024px) {
          .input-main {
            padding-top: 62px;
            padding-bottom: 42px;
          }
        }
      `}</style>
    </div>
  );
}
