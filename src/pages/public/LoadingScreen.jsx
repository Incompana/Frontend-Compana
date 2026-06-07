// src/pages/public/LoadingScreen.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo, StarField } from "../../components/Shared";

const SKIP_LOADING_EVENT = "compana:skip-loading";
const READY_REDIRECT_DELAY_MS = 800;
const MANUAL_READY_DELAY_MS = 3000;

const QUOTES = [
  {
    text: "Mulailah dari tempatmu berada. Gunakan yang kamu punya. Lakukan yang kamu bisa.",
    author: "Arthur Ashe",
    role: "Legenda tenis dunia",
    accent: "🎾",
  },
  {
    text: "Hal besar tidak langsung jadi besar. Ia dimulai dari langkah kecil yang dilakukan terus-menerus.",
    author: "Confucius",
    role: "Filsuf",
    accent: "🏛️",
  },
  {
    text: "Kelihatannya selalu mustahil sampai akhirnya berhasil dilakukan.",
    author: "Nelson Mandela",
    role: "Tokoh perdamaian dunia",
    accent: "🕊️",
  },
  {
    text: "Kamu tidak harus hebat untuk memulai, tapi kamu harus mulai untuk menjadi hebat.",
    author: "Zig Ziglar",
    role: "Motivator",
    accent: "🚀",
  },
];

export default function LoadingScreen({
  currentQuestion = 4,
  totalQuestions = 4,
  currentStep = 2,
  totalSteps = 3,
  progress = 66,
  onSkip,
  onDone,
}) {
  const navigate = useNavigate();

  const [activeQuote, setActiveQuote] = useState(0);
  const [fade, setFade] = useState(true);
  const [skipping, setSkipping] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        setActiveQuote((prev) => (prev + 1) % QUOTES.length);
        setFade(true);
      }, 320);
    }, 3800);

    return () => clearInterval(interval);
  }, []);

  /*
    Fallback penting:
    Kalau user menekan tombol Back dari /hasil-analisis ke /loading,
    loading screen tidak akan stuck. Kalau hasil analysis sudah siap,
    otomatis balik lagi ke /hasil-analisis dengan replace.
  */
  useEffect(() => {
    const isAnalysisReady =
      sessionStorage.getItem("assessmentAnalysisReady") === "true";

    if (!isAnalysisReady) return;

    const timeout = setTimeout(() => {
      navigate("/hasil-analisis", { replace: true });
    }, READY_REDIRECT_DELAY_MS);

    return () => clearTimeout(timeout);
  }, [navigate]);

  useEffect(() => {
    if (!onDone) return;

    const timeout = setTimeout(() => {
      onDone();
    }, QUOTES.length * 3800 + 600);

    return () => clearTimeout(timeout);
  }, [onDone]);

  const handleDotClick = (index) => {
    setFade(false);

    setTimeout(() => {
      setActiveQuote(index);
      setFade(true);
    }, 260);
  };

  const handleSkipLoading = () => {
    if (skipping) return;

    setSkipping(true);

    window.dispatchEvent(new Event(SKIP_LOADING_EVENT));

    const isAnalysisReady =
      sessionStorage.getItem("assessmentAnalysisReady") === "true";

    /*
      Kalau user masuk lagi ke /loading setelah hasil sudah siap,
      tombol lewati tetap terasa proses sebentar, lalu kembali ke hasil.
    */
    if (isAnalysisReady) {
      setTimeout(() => {
        navigate("/hasil-analisis", { replace: true });
      }, MANUAL_READY_DELAY_MS);
    }

    if (onSkip) {
      onSkip();
    }
  };

  const quote = QUOTES[activeQuote];

  return (
    <div className="loading-page">
      <nav className="loading-navbar">
        <div className="loading-logo-wrap">
          <Logo />
        </div>

        <div className="loading-nav-status">
          Pertanyaan <span>{currentQuestion}</span> dari <span>{totalQuestions}</span>
        </div>

        <button type="button" onClick={handleSkipLoading} className="loading-skip">
          {skipping ? "Menyiapkan..." : "Lewati →"}
        </button>
      </nav>

      <main className="loading-main">
        <div className="mesh-bg" />
        <StarField />

        <section className="loading-content">
          <div className="loading-badge">
            <span className="loading-badge-dot" />
            AI sedang menyusun journey kamu
          </div>

          <div className="loading-progress-block">
            <div className="loading-progress-top">
              <span>Langkah {currentStep} dari {totalSteps}</span>
              <span>{progress}%</span>
            </div>

            <div className="loading-progress-track">
              <div
                className="loading-progress-fill"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
          </div>

          <article className="loading-quote-card">
            <div className="loading-card-glow" />

            <div className="loading-card-top">
              <div className="loading-title-block">
                <p className="loading-eyebrow">Quote penyemangat</p>
                <h1>Tenang, prosesmu sedang dibaca AI</h1>
              </div>

              <div className="loading-accent">{quote.accent}</div>
            </div>

            <div className={`loading-quote-body ${fade ? "show" : "hide"}`}>
              <p className="loading-quote-text">“{quote.text}”</p>

              <div className="loading-author">
                <div className="loading-author-avatar">
                  {quote.author
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)}
                </div>

                <div className="loading-author-text">
                  <p>{quote.author}</p>
                  <span>{quote.role}</span>
                </div>
              </div>
            </div>

            <div className="loading-dots">
              {QUOTES.map((item, index) => (
                <button
                  key={item.author}
                  type="button"
                  onClick={() => handleDotClick(index)}
                  aria-label={`Tampilkan quote ${index + 1}`}
                  className={index === activeQuote ? "active" : ""}
                />
              ))}
            </div>
          </article>

          <button
            type="button"
            onClick={handleSkipLoading}
            disabled={skipping}
            className="loading-skip-main"
          >
            {skipping ? "Sebentar, hasil sedang disiapkan..." : "Lewati dan lihat hasil →"}
          </button>

          <p className="loading-note">
            Compana sedang memetakan target role, skill gap, dan action plan
            pertamamu. Kalau hasil AI sudah siap, kamu akan masuk ke halaman
            hasil secara otomatis.
          </p>
        </section>
      </main>

      <style>{`
        .loading-page {
          min-height: 100vh;
          min-height: 100svh;
          background: #0a1f12;
          color: white;
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
        }

        .loading-navbar {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
          align-items: center;
          gap: 16px;
          padding: 14px clamp(18px, 4vw, 40px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          position: relative;
          z-index: 2;
          flex-shrink: 0;
        }

        .loading-logo-wrap {
          min-width: 0;
          overflow: hidden;
        }

        .loading-nav-status {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(255,255,255,0.55);
          white-space: nowrap;
        }

        .loading-nav-status span {
          color: white;
          font-weight: 800;
        }

        .loading-skip {
          justify-self: end;
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.62);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          white-space: nowrap;
        }

        .loading-skip:hover {
          color: white;
        }

        .loading-main {
          position: relative;
          flex: 1;
          min-height: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: clamp(22px, 5vh, 48px) clamp(14px, 4vw, 24px) 28px;
          overflow: hidden;
        }

        .loading-content {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 740px;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: loadingSlideUp 0.55s ease both;
        }

        .loading-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 7px 18px;
          border-radius: 999px;
          border: 1.5px solid rgba(61, 186, 116, 0.5);
          background: rgba(61, 186, 116, 0.08);
          color: rgba(255,255,255,0.82);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 800;
          margin-bottom: 18px;
          text-align: center;
        }

        .loading-badge-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #3dba74;
          box-shadow: 0 0 9px rgba(61,186,116,0.75);
          flex-shrink: 0;
        }

        .loading-progress-block {
          width: 100%;
          margin-bottom: 18px;
        }

        .loading-progress-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 9px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          color: rgba(255,255,255,0.48);
        }

        .loading-progress-track {
          width: 100%;
          height: 6px;
          border-radius: 999px;
          background: rgba(255,255,255,0.1);
          overflow: hidden;
        }

        .loading-progress-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #2d8c5e, #3dba74);
          transition: width 0.8s ease;
          box-shadow: 0 0 16px rgba(61,186,116,0.35);
        }

        .loading-quote-card {
          position: relative;
          width: 100%;
          min-height: 340px;
          background: linear-gradient(145deg, rgba(255,255,255,0.98), rgba(235,246,240,0.96));
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 28px;
          padding: clamp(22px, 4vw, 36px);
          box-shadow: 0 24px 90px rgba(0,0,0,0.36);
          color: #143522;
          overflow: hidden;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }

        .loading-card-glow {
          position: absolute;
          width: 230px;
          height: 230px;
          border-radius: 50%;
          background: rgba(61,186,116,0.16);
          filter: blur(12px);
          right: -90px;
          top: -80px;
          pointer-events: none;
        }

        .loading-card-top {
          position: relative;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 22px;
        }

        .loading-title-block {
          min-width: 0;
        }

        .loading-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.09em;
          color: rgba(20,53,34,0.48);
          font-weight: 900;
          margin: 0 0 8px;
        }

        .loading-card-top h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(25px, 4vw, 36px);
          line-height: 1.13;
          margin: 0;
          color: #143522;
          max-width: 510px;
        }

        .loading-accent {
          width: 56px;
          height: 56px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(45,140,94,0.1);
          border: 1px solid rgba(45,140,94,0.16);
          font-size: 27px;
          flex-shrink: 0;
        }

        .loading-quote-body {
          position: relative;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          transition: opacity 0.32s ease, transform 0.32s ease;
        }

        .loading-quote-body.show {
          opacity: 1;
          transform: translateY(0);
        }

        .loading-quote-body.hide {
          opacity: 0;
          transform: translateY(8px);
        }

        .loading-quote-text {
          font-family: 'Playfair Display', serif;
          font-weight: 800;
          font-size: clamp(21px, 4vw, 31px);
          color: #2d8c5e;
          line-height: 1.45;
          margin: 0 0 26px;
          text-align: left;
        }

        .loading-author {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .loading-author-avatar {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: #2d8c5e;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 900;
          flex-shrink: 0;
        }

        .loading-author-text {
          min-width: 0;
        }

        .loading-author p {
          margin: 0;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 900;
          color: #143522;
        }

        .loading-author span {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          color: rgba(20,53,34,0.56);
          font-weight: 700;
        }

        .loading-dots {
          position: relative;
          display: flex;
          justify-content: center;
          gap: 9px;
          margin-top: 26px;
        }

        .loading-dots button {
          width: 9px;
          height: 9px;
          border-radius: 999px;
          border: none;
          padding: 0;
          cursor: pointer;
          background: rgba(45,140,94,0.25);
          transition: width 0.25s, background 0.25s;
        }

        .loading-dots button.active {
          width: 28px;
          background: #2d8c5e;
        }

        .loading-skip-main {
          margin-top: 16px;
          width: 100%;
          border: 1px solid rgba(61,186,116,0.3);
          background: rgba(61,186,116,0.12);
          color: #7ef0aa;
          border-radius: 14px;
          padding: 13px 18px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 900;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s, opacity 0.2s;
        }

        .loading-skip-main:hover:not(:disabled) {
          background: rgba(61,186,116,0.18);
          transform: translateY(-1px);
        }

        .loading-skip-main:disabled {
          opacity: 0.65;
          cursor: wait;
        }

        .loading-note {
          margin: 14px 0 0;
          text-align: center;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(255,255,255,0.46);
          line-height: 1.6;
          max-width: 560px;
        }

        @keyframes loadingSlideUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 720px) {
          .loading-navbar {
            grid-template-columns: 1fr auto;
            justify-items: initial;
            gap: 12px;
            padding: 12px 16px;
          }

          .loading-logo-wrap {
            transform: scale(0.92);
            transform-origin: left center;
          }

          .loading-nav-status {
            display: none;
          }

          .loading-skip {
            display: inline-flex;
            justify-self: end;
            color: rgba(126,240,170,0.85);
          }

          .loading-main {
            align-items: flex-start;
            padding: 22px 14px 22px;
            overflow-y: auto;
          }

          .loading-content {
            max-width: 100%;
          }

          .loading-badge {
            font-size: 12px;
            padding: 7px 14px;
            margin-bottom: 14px;
          }

          .loading-progress-block {
            margin-bottom: 14px;
          }

          .loading-quote-card {
            min-height: auto;
            border-radius: 22px;
            padding: 22px 20px;
          }

          .loading-card-top {
            flex-direction: row;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 18px;
          }

          .loading-card-top h1 {
            font-size: clamp(24px, 7vw, 30px);
          }

          .loading-accent {
            width: 48px;
            height: 48px;
            border-radius: 15px;
            font-size: 23px;
          }

          .loading-quote-body {
            min-height: 210px;
          }

          .loading-quote-text {
            font-size: clamp(22px, 6vw, 26px);
            line-height: 1.42;
            margin-bottom: 22px;
          }

          .loading-note {
            margin-top: 12px;
            font-size: 12px;
          }
        }

        @media (max-width: 430px) {
          .loading-main {
            padding-left: 12px;
            padding-right: 12px;
          }

          .loading-progress-top {
            font-size: 11px;
          }

          .loading-quote-card {
            padding: 20px 18px;
            border-radius: 20px;
          }

          .loading-eyebrow {
            font-size: 10px;
            margin-bottom: 6px;
          }

          .loading-card-top h1 {
            font-size: 24px;
          }

          .loading-accent {
            width: 44px;
            height: 44px;
            font-size: 21px;
          }

          .loading-quote-body {
            min-height: 190px;
          }

          .loading-quote-text {
            font-size: 22px;
            line-height: 1.38;
          }

          .loading-author-avatar {
            width: 42px;
            height: 42px;
            font-size: 13px;
          }

          .loading-author p {
            font-size: 14px;
          }

          .loading-author span {
            font-size: 11px;
          }

          .loading-dots {
            margin-top: 22px;
          }
        }

        @media (max-width: 360px) {
          .loading-card-top {
            flex-direction: column;
          }

          .loading-quote-body {
            min-height: 210px;
          }

          .loading-quote-text {
            font-size: 21px;
          }
        }
      `}</style>
    </div>
  );
}
