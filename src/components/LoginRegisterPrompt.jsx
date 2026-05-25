// src/components/LoginRegisterPrompt.jsx
// Muncul saat user mengakses halaman yang memerlukan login

import { useState } from "react";

const PREVIEW_STATS = [
  { label: "TARGET ROLE", value: "Frontend", color: "#1a3a2a" },
  { label: "CONFIDENCE", bar: true, pct: 87, barColor: "#3dba74" },
  { label: "ACTION STEPS", bar: true, pct: 70, barColor: "#3dba74" },
  { label: "SKILL GAP", bar: true, pct: 55, barColor: "#3dba74" },
];

const BENEFITS = [
  { icon: "💾", text: "Simpan progress & hasil analisis" },
  { icon: "🗺️", text: "Akses action plan lengkap step-by-step" },
  { icon: "📊", text: "Pantau perjalanan karirmu dari dashboard" },
];

export default function LoginRegisterPrompt({ onLogin, onRegister, onGoogle, onSkip }) {
  const [hovBtn, setHovBtn] = useState(null);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a1f12",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "0 0 40px",
        fontFamily: "'DM Sans', sans-serif",
        overflowX: "hidden",
      }}
    >
      {/* ── Top nav ─────────────────────────────────── */}
      <nav
        style={{
          width: "100%",
          maxWidth: "430px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 20px 14px",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#3dba74",
              display: "inline-block",
              boxShadow: "0 0 6px rgba(61,186,116,0.7)",
            }}
          />
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: "16px",
              color: "white",
              textDecoration: "underline",
              textDecorationColor: "rgba(255,255,255,0.2)",
              textUnderlineOffset: "3px",
            }}
          >
            Compana
          </span>
        </div>

        {/* Right: result teaser */}
        <span
          style={{
            fontSize: "12px",
            color: "#3dba74",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "5px",
            cursor: "pointer",
          }}
        >
          Hasil analisismu sudah siap ✨
        </span>
      </nav>

      {/* ── Pill badges ─────────────────────────────── */}
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          display: "flex",
          gap: "8px",
          padding: "0 20px 16px",
          flexWrap: "wrap",
        }}
      >
        {[
          { icon: "💻", label: "Frontend Developer" },
          { icon: "📊", label: "87% match" },
          { icon: "🔍", label: "5 skill gap" },
        ].map((pill) => (
          <div
            key={pill.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 12px",
              borderRadius: "999px",
              border: "1.5px solid rgba(255,255,255,0.18)",
              background: "rgba(255,255,255,0.05)",
              fontSize: "12px",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            <span>{pill.icon}</span>
            {pill.label}
          </div>
        ))}
      </div>

      {/* ── Preview data teaser card ─────────────────── */}
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          padding: "0 20px 14px",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.94)",
            borderRadius: "14px",
            overflow: "hidden",
          }}
        >
          {/* Lock banner */}
          <div
            style={{
              padding: "8px 14px",
              background: "rgba(45,140,94,0.07)",
              borderBottom: "1px solid rgba(45,140,94,0.15)",
              display: "flex",
              alignItems: "center",
              gap: "7px",
            }}
          >
            <span style={{ fontSize: "12px" }}>🔒</span>
            <span
              style={{
                fontSize: "11px",
                color: "#2d8c5e",
                textDecoration: "underline",
                textDecorationColor: "rgba(45,140,94,0.3)",
                textUnderlineOffset: "2px",
              }}
            >
              Data lengkapmu tersimpan — login untuk melihat
            </span>
          </div>

          {/* Stats grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "0",
              padding: "14px 14px 16px",
            }}
          >
            {PREVIEW_STATS.map((stat, idx) => (
              <div
                key={stat.label}
                style={{
                  padding: "0 10px",
                  borderRight:
                    idx < PREVIEW_STATS.length - 1
                      ? "1px solid rgba(0,0,0,0.07)"
                      : "none",
                }}
              >
                <p
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "rgba(40,70,55,0.45)",
                    margin: "0 0 6px",
                  }}
                >
                  {stat.label}
                </p>
                {stat.bar ? (
                  <div
                    style={{
                      height: "10px",
                      borderRadius: "999px",
                      background: "rgba(45,140,94,0.15)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${stat.pct}%`,
                        borderRadius: "999px",
                        background: "linear-gradient(90deg,#2d8c5e,#3dba74)",
                      }}
                    />
                  </div>
                ) : (
                  <p
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 700,
                      fontSize: "16px",
                      color: stat.color,
                      margin: 0,
                    }}
                  >
                    {stat.value}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main card ─────────────────────────────────── */}
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          padding: "0 20px",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: "20px",
            padding: "24px 22px 28px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.28)",
          }}
        >
          {/* Roadmap badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 14px",
              borderRadius: "999px",
              background: "rgba(45,140,94,0.1)",
              border: "1.5px solid rgba(45,140,94,0.3)",
              marginBottom: "14px",
            }}
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "#3dba74",
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontSize: "12px",
                color: "#2d8c5e",
                fontWeight: 500,
                textDecoration: "underline",
                textDecorationColor: "rgba(45,140,94,0.3)",
                textUnderlineOffset: "2px",
              }}
            >
              Roadmap personalmu siap!
            </span>
          </div>

          {/* Headline */}
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: "clamp(24px, 6vw, 30px)",
              color: "#1a3a2a",
              margin: "0 0 12px",
              lineHeight: 1.2,
            }}
          >
            Lanjutkan{" "}
            <span
              style={{
                color: "#2d8c5e",
                textDecoration: "underline",
                textDecorationColor: "rgba(45,140,94,0.4)",
                textUnderlineOffset: "4px",
              }}
            >
              perjalanan
            </span>
            <br />
            <span
              style={{
                textDecoration: "underline",
                textDecorationColor: "rgba(26,58,42,0.25)",
                textUnderlineOffset: "4px",
              }}
            >
              karirmu
            </span>
          </h2>

          {/* Subtext */}
          <p
            style={{
              fontSize: "13px",
              color: "rgba(40,70,55,0.65)",
              margin: "0 0 18px",
              lineHeight: 1.65,
              textDecoration: "underline",
              textDecorationColor: "rgba(40,70,55,0.15)",
              textUnderlineOffset: "3px",
            }}
          >
            Simpan hasil analisis dan mulai action plan yang sudah disiapkan khusus untukmu. Gratis.
          </p>

          {/* Benefit list */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginBottom: "22px",
            }}
          >
            {BENEFITS.map((b) => (
              <div
                key={b.text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  background: "rgba(45,140,94,0.06)",
                  border: "1px solid rgba(45,140,94,0.15)",
                }}
              >
                <span style={{ fontSize: "16px", flexShrink: 0 }}>{b.icon}</span>
                <span
                  style={{
                    fontSize: "13px",
                    color: "#2a4a38",
                    textDecoration: "underline",
                    textDecorationColor: "rgba(45,140,94,0.2)",
                    textUnderlineOffset: "3px",
                  }}
                >
                  {b.text}
                </span>
              </div>
            ))}
          </div>

          {/* Primary CTA */}
          <button
            onClick={onLogin}
            onMouseEnter={() => setHovBtn("main")}
            onMouseLeave={() => setHovBtn(null)}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              border: "none",
              background: hovBtn === "main" ? "#2a7a54" : "#2d8c5e",
              color: "white",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
              transform: hovBtn === "main" ? "translateY(-1px)" : "translateY(0)",
              boxShadow:
                hovBtn === "main"
                  ? "0 6px 20px rgba(45,140,94,0.35)"
                  : "0 2px 8px rgba(45,140,94,0.2)",
              marginBottom: "14px",
              textDecoration: "underline",
              textDecorationColor: "rgba(255,255,255,0.3)",
              textUnderlineOffset: "3px",
            }}
          >
            Continue Your Journey →
          </button>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "14px",
            }}
          >
            <div style={{ flex: 1, height: "1px", background: "rgba(0,0,0,0.08)" }} />
            <span style={{ fontSize: "12px", color: "rgba(40,70,55,0.45)" }}>
              atau daftar dengan
            </span>
            <div style={{ flex: 1, height: "1px", background: "rgba(0,0,0,0.08)" }} />
          </div>

          {/* Google button */}
          <button
            onClick={onGoogle}
            onMouseEnter={() => setHovBtn("google")}
            onMouseLeave={() => setHovBtn(null)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "12px",
              border: `1.5px solid ${hovBtn === "google" ? "rgba(45,140,94,0.5)" : "rgba(0,0,0,0.12)"}`,
              background: hovBtn === "google" ? "rgba(45,140,94,0.04)" : "white",
              color: "#1a3a2a",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "18px",
            }}
          >
            {/* Google icon */}
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Lanjut dengan Google
          </button>

          {/* Skip link */}
          <p style={{ textAlign: "center", margin: 0 }}>
            <span
              onClick={onSkip}
              style={{
                fontSize: "12px",
                color: "rgba(40,70,55,0.5)",
                cursor: "pointer",
                transition: "color 0.2s",
                textDecoration: "underline",
                textDecorationColor: "rgba(40,70,55,0.2)",
                textUnderlineOffset: "3px",
              }}
              onMouseEnter={(e) => (e.target.style.color = "rgba(40,70,55,0.8)")}
              onMouseLeave={(e) => (e.target.style.color = "rgba(40,70,55,0.5)")}
            >
              Mungkin nanti — pergi ke beranda
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}