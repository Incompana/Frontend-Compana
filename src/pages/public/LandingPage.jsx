// src/pages/public/LandingPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo, StarField } from "../../components/Shared";
import { getUser, isLoggedIn, logout } from "../../utils/auth";
import FiturPage from "./FiturPage";
import TentangPage from "./TentangPage";
import LogoutConfirmModal from "../../components/LogoutConfirmModal";

const LANDING_FEATURES = [
  {
    icon: "🧭",
    title: "Panduan Personal",
    desc: "Rencana karir yang disesuaikan dengan kondisi dan tujuanmu.",
  },
  {
    icon: "⚡",
    title: "Action Kecil",
    desc: "Langkah nyata yang bisa dimulai hari ini juga.",
  },
  {
    icon: "📈",
    title: "Progres Nyata",
    desc: "Pantau perkembanganmu dan rayakan pencapaianmu.",
  },
];

const ChatBubble = () => {
  const [showTyping, setShowTyping] = useState(false);
  const [showReply, setShowReply] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowTyping(true), 800);

    const t2 = setTimeout(() => {
      setShowTyping(false);
      setShowReply(true);
    }, 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="landing-chat-card">
      <div className="landing-chat-topbar">
        <div className="landing-window-dots">
          {["#ff5f57", "#febc2e", "#28c840"].map((color, index) => (
            <span key={index} style={{ background: color }} />
          ))}
        </div>

        <span>Compana AI</span>
      </div>

      <div className="landing-chat-body">
        <div className="landing-message-row user">
          <div className="landing-message user">
            Aku bingung harus mulai dari mana untuk berkarir di UI/UX..
          </div>

          <div className="landing-avatar user">K</div>
        </div>

        <div className="landing-message-row bot">
          <div className="landing-avatar bot">C</div>

          <div className="landing-message bot">
            Tenang! Mari kita mulai dengan 3 langkah kecil hari ini
          </div>
        </div>

        {showTyping && (
          <div className="landing-message-row bot fade">
            <div className="landing-avatar bot">C</div>

            <div className="landing-typing">
              {[0, 1, 2].map((index) => (
                <span
                  key={index}
                  style={{
                    animationDelay: `${index * 0.2}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {showReply && (
          <div className="landing-message-row bot fade">
            <div className="landing-avatar bot">C</div>

            <div className="landing-message bot">
              Pertama, pelajari dasar-dasar Figma selama 30 menit hari ini 🎯
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function LandingPage() {
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [activePage, setActivePage] = useState("home");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const user = getUser();
  const loggedIn = isLoggedIn();

  useEffect(() => {
    if (loggedIn && user?.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [loggedIn, user?.role, navigate]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);

    window.addEventListener("scroll", handler);

    return () => window.removeEventListener("scroll", handler);
  }, []);

  const getDisplayName = () => {
    if (!user) return "User";

    return user.username || user.name || user.email?.split("@")[0] || "User";
  };

  const handleOpenLogoutModal = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate("/", { replace: true });
  };

  const handleMainCTA = () => {
    if (!loggedIn || !user) {
      navigate("/input");
      return;
    }

    if (user.role === "admin") {
      navigate("/admin/dashboard");
      return;
    }

    if (user.is_assessment_done || user.isAssessmentDone) {
      navigate("/dashboardUser");
      return;
    }

    navigate("/input");
  };

  const handleDashboard = () => {
    handleMainCTA();
  };

  if (activePage === "fitur") {
    return (
      <FiturPage
        onBack={() => setActivePage("home")}
        onMulai={handleMainCTA}
      />
    );
  }

  if (activePage === "tentang") {
    return (
      <TentangPage
        onBack={() => setActivePage("home")}
        onMulai={handleMainCTA}
      />
    );
  }

  return (
    <div className="landing-page">
      <nav className={`landing-navbar ${scrolled ? "scrolled" : ""}`}>
        <Logo />

        <div className="landing-nav-actions">
          <button
            type="button"
            className="nav-link landing-nav-text"
            onClick={() => setActivePage("fitur")}
          >
            Fitur
          </button>

          <button
            type="button"
            className="nav-link landing-nav-text"
            onClick={() => setActivePage("tentang")}
          >
            Tentang
          </button>

          {!loggedIn ? (
            <>
              <button
                type="button"
                className="landing-ghost-button"
                onClick={() => navigate("/login")}
              >
                Login
              </button>

              <button
                type="button"
                className="landing-nav-cta"
                onClick={() => navigate("/register")}
              >
                Register
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="landing-ghost-button user-name"
                onClick={handleDashboard}
                title={getDisplayName()}
              >
                {getDisplayName()}
              </button>

              <button
                type="button"
                className="landing-nav-cta"
                onClick={handleOpenLogoutModal}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      <main>
        <section className="landing-hero">
          <div className="mesh-bg" />
          <StarField />

          <div className="landing-hero-content">
            <div className="badge-pill landing-badge">
              <span className="landing-badge-dot" />
              AI Career Companion
            </div>

            <h1 className="landing-title">
              Dari <span>Kebingungan</span>
              <br />
              Menuju Kejelasan
            </h1>

            <p className="landing-subtitle">
              Temukan langkah karirmu dengan satu action kecil.
              <br />
              Compana memandu kamu dari bingung jadi yakin.
            </p>

            <div className="landing-cta-wrap">
              <button
                type="button"
                className="landing-main-cta"
                onClick={handleMainCTA}
              >
                {loggedIn ? "Lanjutkan Perjalanan" : "Mulai Sekarang"}{" "}
                <span>›</span>
              </button>
            </div>

            <ChatBubble />
          </div>
        </section>

        <section id="fitur" className="landing-features-section">
          <div className="landing-feature-grid">
            {LANDING_FEATURES.map((feature, index) => (
              <article key={index} className="landing-feature-card">
                <div className="landing-feature-icon">{feature.icon}</div>

                <h3>{feature.title}</h3>

                <p>{feature.desc}</p>
              </article>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setActivePage("fitur")}
            className="landing-secondary-cta"
          >
            Lihat Semua Fitur →
          </button>
        </section>

        <section id="tentang" className="landing-about-section">
          <p>
            Compana membantu kamu memahami kondisi karier, menemukan skill gap,
            dan menyusun langkah kecil yang bisa langsung dikerjakan.
          </p>

          <button
            type="button"
            onClick={() => setActivePage("tentang")}
            className="landing-about-button"
          >
            Pelajari Tentang Compana →
          </button>
        </section>
      </main>

      <footer className="landing-footer">
        <p>© 2025 Compana · Karirmu, Satu Langkah Lebih Jelas</p>
      </footer>

      <LogoutConfirmModal
        open={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
      />

      <style>{`
        .landing-page {
          min-height: 100vh;
          background: #0a1f12;
          color: white;
          overflow-x: hidden;
        }

        .landing-navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 16px clamp(20px, 4vw, 40px);
          background: transparent;
          transition: all 0.3s ease;
        }

        .landing-navbar.scrolled {
          background: rgba(10, 31, 18, 0.86);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .landing-nav-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 18px;
          min-width: 0;
        }

        .landing-nav-text {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        .landing-ghost-button {
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.58);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: color 0.2s;
        }

        .landing-ghost-button:hover {
          color: white;
        }

        .landing-ghost-button.user-name {
          max-width: 170px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .landing-nav-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 10px;
          padding: 9px 18px;
          background: rgba(45, 140, 94, 0.9);
          color: white;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.2s, transform 0.2s;
        }

        .landing-nav-cta:hover {
          background: #3dba74;
          transform: translateY(-1px);
        }

        .landing-hero {
          position: relative;
          min-height: 88vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: clamp(46px, 8vh, 74px) clamp(16px, 4vw, 24px) 44px;
          overflow: hidden;
        }

        .landing-hero-content {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 760px;
        }

        .landing-badge {
          margin-bottom: 22px;
        }

        .landing-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4de89a;
          flex-shrink: 0;
          box-shadow: 0 0 8px rgba(77,232,154,0.75);
        }

        .landing-title {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: clamp(42px, 8vw, 78px);
          line-height: 1.05;
          letter-spacing: -1.2px;
          margin: 0;
          animation: slideUp 0.75s ease both;
        }

        .landing-title span {
          color: #3dba74;
          text-decoration: underline;
          text-decoration-color: rgba(61,186,116,0.4);
          text-underline-offset: 7px;
        }

        .landing-subtitle {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(14px, 2.2vw, 17px);
          color: rgba(255,255,255,0.55);
          line-height: 1.75;
          max-width: 520px;
          margin: 22px auto 0;
          animation: slideUp 0.75s 0.12s ease both;
        }

        .landing-cta-wrap {
          margin-top: 32px;
          margin-bottom: 44px;
        }

        .landing-main-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: none;
          border-radius: 12px;
          padding: 14px 30px;
          background: rgba(45, 140, 94, 0.95);
          color: white;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 0 16px 42px rgba(45,140,94,0.22);
          transition: transform 0.22s, background 0.22s;
          animation: slideUp 0.75s 0.22s ease both;
        }

        .landing-main-cta:hover {
          background: #3dba74;
          transform: translateY(-2px);
        }

        .landing-main-cta span {
          font-size: 17px;
        }

        .landing-chat-card {
          background: rgba(255,255,255,0.045);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 18px;
          padding: clamp(16px, 3vw, 20px);
          width: 100%;
          max-width: 540px;
          margin: 0 auto;
          backdrop-filter: blur(8px);
          box-shadow: 0 20px 70px rgba(0,0,0,0.16);
        }

        .landing-chat-topbar {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .landing-window-dots {
          display: flex;
          gap: 5px;
        }

        .landing-window-dots span {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .landing-chat-topbar > span {
          font-size: 12px;
          color: rgba(255,255,255,0.42);
          margin-left: 4px;
          font-family: monospace;
        }

        .landing-chat-body {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .landing-message-row {
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        .landing-message-row.user {
          justify-content: flex-end;
        }

        .landing-message-row.bot {
          justify-content: flex-start;
        }

        .landing-message-row.fade {
          animation: fadeIn 0.35s ease both;
        }

        .landing-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 800;
          color: white;
          flex-shrink: 0;
          font-family: 'DM Sans', sans-serif;
        }

        .landing-avatar.user {
          background: rgba(255,255,255,0.15);
        }

        .landing-avatar.bot {
          background: linear-gradient(135deg, #2d8c5e, #1a5c3e);
        }

        .landing-message {
          border-radius: 13px;
          padding: 10px 14px;
          max-width: min(78%, 370px);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(255,255,255,0.87);
          line-height: 1.5;
          text-align: left;
        }

        .landing-message.user {
          background: rgba(255,255,255,0.12);
          border-radius: 13px 13px 3px 13px;
        }

        .landing-message.bot {
          background: rgba(45, 140, 94, 0.25);
          border: 1px solid rgba(45, 140, 94, 0.3);
          border-radius: 13px 13px 13px 3px;
        }

        .landing-typing {
          background: rgba(45, 140, 94, 0.15);
          border: 1px solid rgba(45, 140, 94, 0.2);
          border-radius: 13px 13px 13px 3px;
          padding: 12px 16px;
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .landing-typing span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(45, 200, 120, 0.7);
          animation: bounce 1s ease-in-out infinite;
        }

        .landing-features-section {
          padding: 58px clamp(18px, 5vw, 40px) 78px;
          max-width: 980px;
          margin: 0 auto;
          text-align: center;
        }

        .landing-feature-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .landing-feature-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 24px 20px;
          text-align: left;
          transition: border-color 0.25s, background 0.25s, transform 0.25s;
        }

        .landing-feature-card:hover {
          border-color: rgba(45, 140, 94, 0.38);
          background: rgba(45, 140, 94, 0.06);
          transform: translateY(-2px);
        }

        .landing-feature-icon {
          font-size: 24px;
          margin-bottom: 12px;
        }

        .landing-feature-card h3 {
          font-family: 'DM Sans', sans-serif;
          font-weight: 800;
          font-size: 15px;
          color: #3dba74;
          margin: 0 0 8px;
        }

        .landing-feature-card p {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(255,255,255,0.48);
          line-height: 1.65;
          margin: 0;
        }

        .landing-secondary-cta,
        .landing-about-button {
          margin-top: 20px;
          padding: 12px 26px;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          transition: transform 0.2s, background 0.2s, color 0.2s;
        }

        .landing-secondary-cta {
          border: 1px solid rgba(61,186,116,0.35);
          background: rgba(61,186,116,0.1);
          color: #3dba74;
        }

        .landing-about-section {
          padding: 0 clamp(18px, 5vw, 40px) 70px;
          max-width: 900px;
          margin: 0 auto;
          text-align: center;
        }

        .landing-about-section p {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(255,255,255,0.48);
          line-height: 1.8;
          margin: 0 auto 22px;
          max-width: 680px;
        }

        .landing-about-button {
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.75);
        }

        .landing-secondary-cta:hover,
        .landing-about-button:hover {
          transform: translateY(-1px);
        }

        .landing-footer {
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 20px clamp(18px, 5vw, 40px);
          text-align: center;
        }

        .landing-footer p {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          color: rgba(255,255,255,0.26);
          margin: 0;
        }

        @media (max-width: 820px) {
          .landing-navbar {
            align-items: flex-start;
            flex-direction: column;
          }

          .landing-nav-actions {
            width: 100%;
            justify-content: flex-start;
            flex-wrap: wrap;
            gap: 12px;
          }

          .landing-nav-cta,
          .landing-ghost-button {
            min-height: 38px;
          }

          .landing-hero {
            min-height: auto;
            padding-top: 54px;
          }

          .landing-feature-grid {
            grid-template-columns: 1fr;
          }

          .landing-feature-card {
            text-align: center;
          }
        }

        @media (max-width: 520px) {
          .landing-navbar {
            padding: 14px 18px;
          }

          .landing-nav-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }

          .landing-nav-text,
          .landing-ghost-button,
          .landing-nav-cta {
            width: 100%;
            justify-content: center;
            text-align: center;
          }

          .landing-title {
            font-size: 42px;
          }

          .landing-subtitle br {
            display: none;
          }

          .landing-main-cta {
            width: 100%;
            padding: 14px 22px;
          }

          .landing-message {
            max-width: 82%;
            font-size: 12.5px;
          }

          .landing-avatar {
            width: 26px;
            height: 26px;
          }

          .landing-chat-card {
            border-radius: 16px;
          }

          .landing-features-section {
            padding-top: 44px;
            padding-bottom: 60px;
          }
        }

        @media (max-width: 380px) {
          .landing-nav-actions {
            grid-template-columns: 1fr;
          }

          .landing-title {
            font-size: 38px;
          }
        }
      `}</style>
    </div>
  );
}
