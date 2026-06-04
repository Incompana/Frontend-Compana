// src/pages/SkillGapPage.jsx
import { Logo, StarField } from "../components/Shared";
import { getSkillGapView } from "../lib/aiViewModel";

const DATA = {
  targetRole: "Frontend Developer",
  missing: [
    { name: "JavaScript ES6+", pct: 8 },
    { name: "React.js", pct: 0 },
    { name: "Git & Version Control", pct: 5 },
    { name: "REST API / Fetch", pct: 0 },
    { name: "Responsive Design", pct: 12 },
  ],
  weak: [
    { name: "CSS Flexbox / Grid", pct: 40 },
    { name: "DOM Manipulation", pct: 30 },
    { name: "Debugging Tools", pct: 25 },
    { name: "Accessibility (a11y)", pct: 20 },
  ],
  owned: ["HTML5 Semantic", "CSS Basic Styling", "Figma (Basic)"],
};

const ProgressBar = ({ pct, color }) => (
  <div
    style={{
      flex: 1,
      height: "4px",
      borderRadius: "999px",
      background: "rgba(255,255,255,0.08)",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        height: "100%",
        width: `${pct}%`,
        borderRadius: "999px",
        background: color,
        transition: "width 0.8s ease",
      }}
    />
  </div>
);

export default function SkillGapPage({ analysis, onBuatLearningPath, onExportPDF, onBack }) {
  const dynamicData = getSkillGapView(analysis);
  const data = {
    targetRole: dynamicData.targetRole || DATA.targetRole,
    missing: dynamicData.missing.length ? dynamicData.missing : DATA.missing,
    weak: dynamicData.weak.length ? dynamicData.weak : DATA.weak,
    owned: dynamicData.owned.length ? dynamicData.owned.map((skill) => skill.name) : DATA.owned,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a1f12",
        color: "white",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
      }}
    >
      {/* Nav */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 40px",
        }}
      >
        <Logo />
        <div
          style={{
            padding: "6px 20px",
            borderRadius: "999px",
            border: "1.5px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.07)",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px",
            color: "rgba(255,255,255,0.8)",
            fontWeight: 500,
          }}
        >
          Gap Skill Analysis
        </div>
        <button
          onClick={onBack}
          style={{
            background: "transparent",
            border: "none",
            color: "rgba(255,255,255,0.55)",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px",
            cursor: "pointer",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.color = "rgba(255,255,255,0.95)")}
          onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,0.55)")}
        >
          {data.targetRole}
        </button>
      </nav>

      {/* Body */}
      <div
        style={{
          position: "relative",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0 24px 48px",
        }}
      >
        <div className="mesh-bg" />
        <StarField />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: "680px",
            animation: "slideUp 0.6s ease both",
          }}
        >
          {/* Icon + Title */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "rgba(45,140,94,0.2)",
                border: "1.5px solid rgba(61,186,116,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                margin: "0 auto 14px",
              }}
            >
              🔍
            </div>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: "clamp(24px, 4vw, 32px)",
                margin: "0 0 10px",
              }}
            >
              <span
                style={{
                  color: "white",
                  textDecoration: "underline",
                  textDecorationColor: "rgba(255,255,255,0.2)",
                  textUnderlineOffset: "4px",
                }}
              >
                Skill Gap
              </span>{" "}
              <span style={{ color: "#3dba74" }}>Kamu</span>
            </h1>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                color: "rgba(255,255,255,0.5)",
                textDecoration: "underline",
                textDecorationColor: "rgba(255,255,255,0.15)",
              }}
            >
              Ini adalah skill yang perlu diperkuat untuk menjadi {data.targetRole}. Fokus pada yang merah dulu.
            </p>
          </div>

          {/* Summary counts */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            {[
              { icon: "✕", label: "MISSING", count: data.missing.length, color: "#e05a5a", bg: "rgba(220,80,80,0.1)", border: "rgba(220,80,80,0.3)" },
              { icon: "=", label: "WEAK", count: data.weak.length, color: "#d4a844", bg: "rgba(212,168,68,0.1)", border: "rgba(212,168,68,0.3)" },
              { icon: "✓", label: "OWNED", count: data.owned.length, color: "#3dba74", bg: "rgba(61,186,116,0.1)", border: "rgba(61,186,116,0.3)" },
            ].map(({ icon, label, count, color, bg, border }) => (
              <div
                key={label}
                style={{
                  background: bg,
                  border: `1px solid ${border}`,
                  borderRadius: "12px",
                  padding: "14px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "13px",
                    flexShrink: 0,
                  }}
                >
                  {icon}
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "10px",
                      color: "rgba(255,255,255,0.4)",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      margin: "0 0 2px",
                    }}
                  >
                    {label}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 700,
                      fontSize: "22px",
                      color,
                      margin: 0,
                    }}
                  >
                    {count}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Missing + Weak side by side */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            {/* Missing Skills */}
            <div
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "14px",
                padding: "16px 18px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "14px",
                }}
              >
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#e05a5a",
                    textDecoration: "underline",
                    textDecorationColor: "rgba(220,80,80,0.3)",
                    textUnderlineOffset: "3px",
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
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
                  Missing Skills
                </p>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "11px",
                    color: "#e05a5a",
                    background: "rgba(220,80,80,0.15)",
                    padding: "2px 8px",
                    borderRadius: "999px",
                  }}
                >
                  {data.missing.length} skill
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {data.missing.map((s) => (
                  <div key={s.name}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "4px",
                      }}
                    >
                      <div
                        style={{
                          width: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          background: "#e05a5a",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <span style={{ color: "white", fontSize: "10px", fontWeight: 700 }}>✕</span>
                      </div>
                      <span
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "12px",
                          color: "rgba(255,255,255,0.75)",
                          flex: 1,
                        }}
                      >
                        {s.name}
                      </span>
                      <span
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "11px",
                          color: "rgba(255,255,255,0.4)",
                        }}
                      >
                        {s.pct}%
                      </span>
                    </div>
                    <ProgressBar pct={s.pct} color="#e05a5a" />
                  </div>
                ))}
              </div>
            </div>

            {/* Weak Skills */}
            <div
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "14px",
                padding: "16px 18px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "14px",
                }}
              >
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#d4a844",
                    textDecoration: "underline",
                    textDecorationColor: "rgba(212,168,68,0.3)",
                    textUnderlineOffset: "3px",
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
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
                  Weak Skills
                </p>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "11px",
                    color: "#d4a844",
                    background: "rgba(212,168,68,0.15)",
                    padding: "2px 8px",
                    borderRadius: "999px",
                  }}
                >
                  {data.weak.length} skill
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {data.weak.map((s) => (
                  <div key={s.name}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "4px",
                      }}
                    >
                      <div
                        style={{
                          width: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          background: "#d4a844",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <span style={{ color: "white", fontSize: "10px", fontWeight: 700 }}>=</span>
                      </div>
                      <span
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "12px",
                          color: "rgba(255,255,255,0.75)",
                          flex: 1,
                          textDecoration: "underline",
                          textDecorationColor: "rgba(255,255,255,0.2)",
                          textUnderlineOffset: "2px",
                        }}
                      >
                        {s.name}
                      </span>
                      <span
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "11px",
                          color: "rgba(255,255,255,0.4)",
                        }}
                      >
                        {s.pct}%
                      </span>
                    </div>
                    <ProgressBar pct={s.pct} color="#d4a844" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Owned skills */}
          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(61,186,116,0.2)",
              borderRadius: "14px",
              padding: "16px 18px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#3dba74",
                  textDecoration: "underline",
                  textDecorationColor: "rgba(61,186,116,0.3)",
                  textUnderlineOffset: "3px",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#3dba74",
                    display: "inline-block",
                  }}
                />
                Skill yang Sudah Kamu Miliki
              </p>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "11px",
                  color: "#3dba74",
                  background: "rgba(61,186,116,0.15)",
                  padding: "2px 8px",
                  borderRadius: "999px",
                }}
              >
                {data.owned.length} skill
              </span>
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {data.owned.map((s) => (
                <div
                  key={s}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 14px",
                    borderRadius: "999px",
                    background: "rgba(61,186,116,0.1)",
                    border: "1px solid rgba(61,186,116,0.3)",
                  }}
                >
                  <span style={{ color: "#3dba74", fontSize: "12px" }}>✓</span>
                  <span
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "12px",
                      color: "rgba(255,255,255,0.8)",
                    }}
                  >
                    {s}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom buttons */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "12px" }}>
            <button
              onClick={onBuatLearningPath}
              style={{
                padding: "14px",
                borderRadius: "12px",
                border: "none",
                background: "rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.75)",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s",
                textDecoration: "underline",
                textDecorationColor: "rgba(255,255,255,0.2)",
                textUnderlineOffset: "3px",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255,255,255,0.18)";
                e.target.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255,255,255,0.12)";
                e.target.style.color = "rgba(255,255,255,0.75)";
              }}
            >
              Buat Learning Path →
            </button>
            <button
              onClick={onExportPDF}
              style={{
                padding: "14px 28px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.07)",
                color: "rgba(255,255,255,0.7)",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                e.currentTarget.style.color = "rgba(255,255,255,0.7)";
              }}
            >
              Export PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
