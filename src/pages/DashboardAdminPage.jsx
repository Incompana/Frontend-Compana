// src/pages/DashboardAdminPage.jsx
import { useState } from "react";
import { StarField } from "../components/Shared";

const USER = {
  name: "Reza",
  role: "Frontend Dev",
  avatar: "R",
  greeting: "Hi, Reza",
  date: "Kamis, 8 Mei 2025 · Tetap semangat!",
};

const STATS = [
  { icon: "🏆", value: "33%", label: "Overall Progress", badge: "↑ 5%", badgeColor: "#3dba74", badgeBg: "rgba(61,186,116,0.12)" },
  { icon: "✓", value: "2", label: "Task Selesai", badge: "+2", badgeColor: "#3dba74", badgeBg: "rgba(61,186,116,0.12)" },
  { icon: "⚡", value: "240 XP", label: "Total XP", badge: "+120", badgeColor: "#d4a844", badgeBg: "rgba(212,168,68,0.12)" },
  { icon: "🔥", value: "3", label: "Day Streak", badge: "3 hari", badgeColor: "#d4a844", badgeBg: "rgba(212,168,68,0.12)" },
];

const NAV_ITEMS = [
  { id: "dashboard", icon: "📊", label: "Dashboard" },
  { id: "action-plan", icon: "🗺️", label: "Action Plan" },
  { id: "skill-gap", icon: "🔍", label: "Skill Gap" },
  { id: "tasks", icon: "📋", label: "Tasks" },
  { id: "analisis", icon: "🧠", label: "Analisis" },
  { id: "pengaturan", icon: "⚙️", label: "Pengaturan" },
];

const PHASES = [
  { label: "Phase 1 — Fondasi", pct: 100 },
  { label: "Phase 2 — Intermediate", pct: 0 },
  { label: "Phase 3 — Project", pct: 0 },
];

export default function DashboardAdminPage({ onNavigate }) {
  const [activeNav, setActiveNav] = useState("dashboard");

  const navigate = (page) => {
    setActiveNav(page);
    if (onNavigate) onNavigate(page);
  };

  const overallPct = 33;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a1f12",
        display: "flex",
        overflowX: "hidden",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* ── Sidebar ───────────────────────────────────── */}
      <aside
        style={{
          width: "185px",
          minWidth: "185px",
          background: "rgba(255,255,255,0.04)",
          borderRight: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          flexDirection: "column",
          padding: "20px 12px",
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "0 8px",
            marginBottom: "28px",
          }}
        >
          <span style={{ fontSize: "16px" }}>⌘</span>
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: "16px",
              color: "#3dba74",
              textDecoration: "underline",
              textDecorationColor: "rgba(61,186,116,0.35)",
              textUnderlineOffset: "3px",
            }}
          >
            Compana
          </span>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "9px 12px",
                  borderRadius: "9px",
                  border: "none",
                  background: isActive ? "rgba(61,186,116,0.15)" : "transparent",
                  color: isActive ? "#3dba74" : "rgba(255,255,255,0.5)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  fontWeight: isActive ? 600 : 400,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.18s",
                  borderLeft: isActive
                    ? "2px solid #3dba74"
                    : "2px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                  }
                }}
              >
                <span style={{ fontSize: "15px" }}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User profile at bottom */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 10px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            marginTop: "auto",
            paddingTop: "16px",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "rgba(61,186,116,0.2)",
              border: "1.5px solid rgba(61,186,116,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "13px",
              color: "#3dba74",
              flexShrink: 0,
            }}
          >
            {USER.avatar}
          </div>
          <div style={{ minWidth: 0 }}>
            <p
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "rgba(255,255,255,0.8)",
                margin: 0,
                textDecoration: "underline",
                textDecorationColor: "rgba(255,255,255,0.2)",
                textUnderlineOffset: "2px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {USER.name}
            </p>
            <p
              style={{
                fontSize: "11px",
                color: "rgba(255,255,255,0.35)",
                margin: 0,
              }}
            >
              {USER.role}
            </p>
          </div>
        </div>
      </aside>

      {/* ── Main content ───────────────────────────────── */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
        <div className="mesh-bg" />
        <StarField />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: "24px 28px 40px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {/* Header row */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h1
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: "clamp(22px, 3vw, 28px)",
                  color: "#3dba74",
                  margin: "0 0 4px",
                  textDecoration: "underline",
                  textDecorationColor: "rgba(61,186,116,0.3)",
                  textUnderlineOffset: "4px",
                }}
              >
                {USER.greeting}
              </h1>
              <p
                style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.45)",
                  margin: 0,
                }}
              >
                {USER.date}
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                🔔
              </button>
              <button
                onClick={() => navigate("task-detail")}
                style={{
                  padding: "9px 22px",
                  borderRadius: "9px",
                  border: "none",
                  background: "#3dba74",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "background 0.2s, transform 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#4dcf85";
                  e.target.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#3dba74";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                Lanjut
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "12px",
            }}
          >
            {STATS.map((s) => (
              <div
                key={s.label}
                style={{
                  background: "rgba(255,255,255,0.93)",
                  borderRadius: "14px",
                  padding: "14px 16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "4px",
                  }}
                >
                  <span style={{ fontSize: "18px" }}>{s.icon}</span>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: s.badgeColor,
                      background: s.badgeBg,
                      padding: "2px 8px",
                      borderRadius: "999px",
                    }}
                  >
                    {s.badge}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 700,
                    fontSize: "22px",
                    color: "#1a3a2a",
                    margin: 0,
                  }}
                >
                  {s.value}
                </p>
                <p
                  style={{
                    fontSize: "11px",
                    color: "rgba(40,70,55,0.55)",
                    margin: 0,
                  }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Career journey bar */}
          <div
            style={{
              background: "rgba(255,255,255,0.93)",
              borderRadius: "14px",
              padding: "16px 20px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#1a3a2a",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                🚀{" "}
                <span
                  style={{
                    textDecoration: "underline",
                    textDecorationColor: "rgba(45,140,94,0.3)",
                    textUnderlineOffset: "3px",
                  }}
                >
                  Perjalanan Karir · Frontend Developer
                </span>
              </p>
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: "16px",
                  color: "#2d8c5e",
                }}
              >
                {overallPct}%
              </span>
            </div>
            {/* Segmented bar */}
            <div
              style={{
                display: "flex",
                gap: "4px",
                marginBottom: "8px",
              }}
            >
              {PHASES.map((ph, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: "8px",
                    borderRadius: "999px",
                    background: ph.pct > 0 ? "rgba(45,140,94,0.15)" : "rgba(180,200,210,0.2)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: i === 0 ? `${overallPct}%` : "0%",
                      borderRadius: "999px",
                      background:
                        i === 0
                          ? "linear-gradient(90deg,#2d8c5e,#3dba74)"
                          : i === 1
                          ? "linear-gradient(90deg,#7c6fe0,#a89cf0)"
                          : "linear-gradient(90deg,#d4a844,#f0c85c)",
                    }}
                  />
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {PHASES.map((ph) => (
                <span
                  key={ph.label}
                  style={{
                    fontSize: "10px",
                    color: "rgba(40,70,55,0.45)",
                  }}
                >
                  {ph.label}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom grid: active task (left) + right panels */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 320px",
              gap: "14px",
              alignItems: "start",
            }}
          >
            {/* Active task card */}
            <div
              style={{
                background: "rgba(255,255,255,0.93)",
                borderRadius: "14px",
                padding: "20px 22px",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 12px",
                  borderRadius: "999px",
                  background: "rgba(61,186,116,0.1)",
                  border: "1px solid rgba(61,186,116,0.3)",
                  marginBottom: "12px",
                }}
              >
                <span style={{ fontSize: "11px" }}>▷</span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#2d8c5e",
                  }}
                >
                  Sedang Berjalan
                </span>
              </div>

              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: "20px",
                  color: "#1a3a2a",
                  margin: "0 0 8px",
                  textDecoration: "underline",
                  textDecorationColor: "rgba(45,140,94,0.3)",
                  textUnderlineOffset: "3px",
                }}
              >
                JavaScript ES6 Dasar
              </p>

              <p
                style={{
                  fontSize: "13px",
                  color: "rgba(40,70,55,0.65)",
                  margin: "0 0 12px",
                  lineHeight: 1.6,
                  textDecoration: "underline",
                  textDecorationColor: "rgba(40,70,55,0.2)",
                  textUnderlineOffset: "3px",
                }}
              >
                Pelajari let/const, arrow function, array methods, dan template literals untuk pondasi sebelum masuk React.
              </p>

              {/* Tags */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  marginBottom: "14px",
                  alignItems: "center",
                }}
              >
                {["JavaScript", "ES6"].map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: "11px",
                      color: "rgba(40,70,55,0.65)",
                      background: "rgba(45,140,94,0.1)",
                      border: "1px solid rgba(45,140,94,0.2)",
                      padding: "3px 10px",
                      borderRadius: "6px",
                    }}
                  >
                    {t}
                  </span>
                ))}
                <span
                  style={{
                    fontSize: "11px",
                    color: "rgba(40,70,55,0.55)",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  ⏱ 7 hari
                </span>
              </div>

              {/* Progress bar */}
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "5px",
                  }}
                >
                  <span style={{ fontSize: "11px", color: "rgba(40,70,55,0.5)" }}>
                    Progres hari ini
                  </span>
                  <span style={{ fontSize: "11px", color: "rgba(40,70,55,0.5)" }}>
                    Hari 3 dari 7
                  </span>
                </div>
                <div
                  style={{
                    height: "6px",
                    borderRadius: "999px",
                    background: "rgba(45,140,94,0.12)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: "43%",
                      borderRadius: "999px",
                      background: "linear-gradient(90deg,#2d8c5e,#3dba74)",
                    }}
                  />
                </div>
              </div>

              {/* CTAs */}
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => navigate("task-detail")}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "10px",
                    border: "none",
                    background: "#2d8c5e",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "background 0.2s, transform 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#3dba74";
                    e.target.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "#2d8c5e";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  Lanjutkan →
                </button>
                <button
                  style={{
                    padding: "12px 18px",
                    borderRadius: "10px",
                    border: "1px solid rgba(45,140,94,0.3)",
                    background: "transparent",
                    color: "#2d8c5e",
                    fontSize: "13px",
                    fontWeight: 500,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(45,140,94,0.07)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  Tanya AI 🤖
                </button>
              </div>
            </div>

            {/* Right panels */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {/* Langkah Berikutnya */}
              <div
                style={{
                  background: "rgba(255,255,255,0.93)",
                  borderRadius: "14px",
                  padding: "14px 16px",
                }}
              >
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#1a3a2a",
                    margin: "0 0 10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
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
                  Langkah Berikutnya
                </p>
                <button
                  onClick={() => navigate("action-plan")}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    borderRadius: "9px",
                    border: "1px solid rgba(45,140,94,0.2)",
                    background: "rgba(45,140,94,0.05)",
                    cursor: "pointer",
                    marginBottom: "6px",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(45,140,94,0.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "rgba(45,140,94,0.05)")
                  }
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "14px" }}>🔒</span>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#2d8c5e",
                        textDecoration: "underline",
                        textDecorationColor: "rgba(45,140,94,0.3)",
                        textUnderlineOffset: "3px",
                      }}
                    >
                      DOM Manipulation
                    </span>
                  </div>
                  <span style={{ fontSize: "13px", color: "rgba(40,70,55,0.4)" }}>›</span>
                </button>
                <p
                  style={{
                    fontSize: "11px",
                    color: "rgba(40,70,55,0.45)",
                    margin: 0,
                  }}
                >
                  Terbuka setelah JS ES6 selesai
                </p>
              </div>

              {/* Feedback Terakhir */}
              <div
                style={{
                  background: "rgba(255,255,255,0.93)",
                  borderRadius: "14px",
                  padding: "14px 16px",
                }}
              >
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#1a3a2a",
                    margin: "0 0 10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
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
                  Feedback Terakhir
                </p>
                <p
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 700,
                    fontSize: "13px",
                    color: "#2d8c5e",
                    margin: "0 0 8px",
                    lineHeight: 1.55,
                    textDecoration: "underline",
                    textDecorationColor: "rgba(45,140,94,0.3)",
                    textUnderlineOffset: "3px",
                  }}
                >
                  "Tambahkan &lt;header&gt;, &lt;main&gt;, &lt;footer&gt; untuk struktur semantic HTML yang benar."
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      color: "rgba(40,70,55,0.45)",
                      textDecoration: "underline",
                      textDecorationColor: "rgba(40,70,55,0.2)",
                      textUnderlineOffset: "2px",
                    }}
                  >
                    Langkah 2 — CSS Box Model
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#b87a00",
                      background: "rgba(212,168,68,0.15)",
                      padding: "3px 9px",
                      borderRadius: "999px",
                    }}
                  >
                    Need Revision
                  </span>
                </div>
              </div>

              {/* Total XP panel */}
              <div
                style={{
                  background: "rgba(61,186,116,0.12)",
                  border: "1.5px solid rgba(61,186,116,0.25)",
                  borderRadius: "14px",
                  padding: "16px 18px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "11px",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.45)",
                      margin: 0,
                    }}
                  >
                    Total XP
                  </p>
                  <span style={{ fontSize: "18px" }}>⚡</span>
                </div>
                <p
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 700,
                    fontSize: "28px",
                    color: "#3dba74",
                    margin: "0 0 10px",
                  }}
                >
                  240 XP
                </p>
                <div
                  style={{
                    height: "5px",
                    borderRadius: "999px",
                    background: "rgba(255,255,255,0.1)",
                    overflow: "hidden",
                    marginBottom: "8px",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: "62%",
                      borderRadius: "999px",
                      background: "linear-gradient(90deg,#2d8c5e,#3dba74)",
                    }}
                  />
                </div>
                <p
                  style={{
                    fontSize: "11px",
                    color: "rgba(255,255,255,0.4)",
                    margin: 0,
                  }}
                >
                  62% menuju Level 2 · butuh 360 XP lagi
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}