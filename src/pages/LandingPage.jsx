// src/pages/LandingPage.jsx
import { useState, useEffect } from "react";
import { Logo, StarField } from "../components/Shared";

const ChatBubble = () => {
  const [showTyping, setShowTyping] = useState(false);
  const [showReply, setShowReply] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowTyping(true), 800);
    const t2 = setTimeout(() => { setShowTyping(false); setShowReply(true); }, 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "16px", padding: "20px",
      maxWidth: "520px", margin: "0 auto",
      backdropFilter: "blur(8px)",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: "8px",
        marginBottom: "16px", paddingBottom: "12px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}>
        <div style={{ display: "flex", gap: "5px" }}>
          {["#ff5f57","#febc2e","#28c840"].map((c, i) => (
            <div key={i} style={{ width: "10px", height: "10px", borderRadius: "50%", background: c }} />
          ))}
        </div>
        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginLeft: "4px", fontFamily: "monospace" }}>
          Compana AI
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-start", gap: "8px" }}>
          <div style={{
            background: "rgba(255,255,255,0.12)", borderRadius: "12px 12px 2px 12px",
            padding: "10px 14px", maxWidth: "75%", fontSize: "13px",
            color: "rgba(255,255,255,0.85)", lineHeight: 1.5,
          }}>
            Aku bingung harus mulai dari mana untuk berkarir di UI/UX..
          </div>
          <div style={{
            width: "28px", height: "28px", borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "11px", fontWeight: 600, color: "white", flexShrink: 0,
          }}>K</div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
          <div style={{
            width: "28px", height: "28px", borderRadius: "50%",
            background: "linear-gradient(135deg, #2d8c5e, #1a5c3e)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "11px", fontWeight: 600, color: "white", flexShrink: 0,
          }}>C</div>
          <div style={{
            background: "rgba(45, 140, 94, 0.25)", border: "1px solid rgba(45, 140, 94, 0.3)",
            borderRadius: "12px 12px 12px 2px", padding: "10px 14px", maxWidth: "75%",
            fontSize: "13px", color: "rgba(255,255,255,0.85)", lineHeight: 1.5,
          }}>
            Tenang! Mari kita mulai dengan 3 langkah kecil hari ini
          </div>
        </div>

        {showTyping && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", animation: "fadeIn 0.3s ease" }}>
            <div style={{
              width: "28px", height: "28px", borderRadius: "50%",
              background: "linear-gradient(135deg, #2d8c5e, #1a5c3e)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "11px", fontWeight: 600, color: "white", flexShrink: 0,
            }}>C</div>
            <div style={{
              background: "rgba(45, 140, 94, 0.15)", border: "1px solid rgba(45, 140, 94, 0.2)",
              borderRadius: "12px 12px 12px 2px", padding: "12px 16px",
              display: "flex", gap: "4px", alignItems: "center",
            }}>
              {[0,1,2].map(i => (
                <div key={i} style={{
                  width: "6px", height: "6px", borderRadius: "50%",
                  background: "rgba(45, 200, 120, 0.7)",
                  animation: `bounce 1s ease-in-out ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}

        {showReply && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", animation: "fadeIn 0.4s ease" }}>
            <div style={{
              width: "28px", height: "28px", borderRadius: "50%",
              background: "linear-gradient(135deg, #2d8c5e, #1a5c3e)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "11px", fontWeight: 600, color: "white", flexShrink: 0,
            }}>C</div>
            <div style={{
              background: "rgba(45, 140, 94, 0.25)", border: "1px solid rgba(45, 140, 94, 0.3)",
              borderRadius: "12px 12px 12px 2px", padding: "10px 14px",
              fontSize: "13px", color: "rgba(255,255,255,0.85)", lineHeight: 1.5,
            }}>
              Pertama, pelajari dasar-dasar Figma selama 30 menit hari ini 🎯
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function LandingPage({ onNext }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0a1f12", color: "white", overflowX: "hidden" }}>
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 40px",
        background: scrolled ? "rgba(10, 31, 18, 0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        transition: "all 0.3s",
      }}>
        <Logo />
        <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          <a href="#" className="nav-link">Fitur</a>
          <a href="#" className="nav-link">Tentang</a>
          <button className="cta-btn-nav" onClick={onNext}>Mulai Sekarang</button>
        </div>
      </nav>

      <section style={{
        position: "relative", minHeight: "88vh",
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", textAlign: "center",
        padding: "60px 24px 40px", overflow: "hidden",
      }}>
        <div className="mesh-bg" />
        <StarField />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "720px" }}>
          <div className="badge-pill">
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4de89a", flexShrink: 0 }} />
            AI Career Companion
          </div>
          <h1 className="hero-title">
            Dari{" "}
            <span style={{ color: "#3dba74", textDecoration: "underline", textDecorationColor: "rgba(61,186,116,0.4)", textUnderlineOffset: "6px" }}>
              Kebingungan
            </span>
            <br />Menuju Kejelasan
          </h1>
          <p className="hero-subtitle" style={{ marginTop: "20px" }}>
            Temukan langkah karirmu dengan satu action kecil.<br />
            Compana memandu kamu dari bingung jadi yakin.
          </p>
          <div style={{ marginTop: "32px", marginBottom: "48px" }}>
            <button className="cta-btn" onClick={onNext}>
              Mulai Sekarang <span style={{ fontSize: "16px" }}>›</span>
            </button>
          </div>
          <ChatBubble />
        </div>
      </section>

      <section style={{ padding: "60px 40px 80px", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          {[
            { icon: "🧭", title: "Panduan Personal", desc: "Rencana karir yang disesuaikan untukmu" },
            { icon: "⚡", title: "Action Kecil", desc: "Langkah nyata yang bisa dimulai hari ini juga" },
            { icon: "📈", title: "Progres Nyata", desc: "Pantau perkembanganmu dan rayakan pencapaianmu" },
          ].map((f, i) => (
            <div key={i} className="feature-card">
              <div style={{ fontSize: "22px", marginBottom: "12px" }}>{f.icon}</div>
              <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "15px", color: "#3dba74", marginBottom: "8px" }}>{f.title}</h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "20px 40px", textAlign: "center" }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>
          © 2025 Compana · Karirmu, Satu Langkah Lebih Jelas
        </p>
      </footer>
    </div>
  );
}