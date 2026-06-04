// src/pages/user/SkillGapPage.jsx

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo, StarField } from "../../components/Shared";
import api from "../../api/axios";
import toast from "react-hot-toast";

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

const buildMissingSkills = (skillGap) => {
  return skillGap.map((skill, index) => ({
    name: skill,
    pct: index === 0 ? 10 : index === 1 ? 5 : 0,
  }));
};

const DEFAULT_WEAK_SKILLS = [
  { name: "Problem Solving", pct: 35 },
  { name: "Debugging", pct: 25 },
];

const DEFAULT_OWNED_SKILLS = ["HTML Basic", "CSS Basic"];

export default function SkillGapPage() {
  const navigate = useNavigate();

  const [skillGapData, setSkillGapData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkillGap = async () => {
      try {
        const res = await api.get("/skill-gap/me");

        setSkillGapData(res.data.data);
      } catch (error) {
        console.log(error.response?.data || error.message);

        toast.error(
          error.response?.data?.message ||
            "Gagal mengambil data skill gap"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSkillGap();
  }, []);

  const targetRole =
    skillGapData?.targetRole || "Belum ditentukan";

  const confidenceScore =
    skillGapData?.confidenceScore || 0;

  const skillGap = useMemo(() => {
    return skillGapData?.skillGap || [];
  }, [skillGapData]);

  const missingSkills = useMemo(() => {
    return buildMissingSkills(skillGap);
  }, [skillGap]);

  const weakSkills = DEFAULT_WEAK_SKILLS;
  const ownedSkills = DEFAULT_OWNED_SKILLS;

  const handleCreateLearningPath = () => {
    navigate("/action-plan");
  };

  const handleExportPDF = () => {
    toast("Fitur export PDF akan dibuat nanti.");
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0a1f12",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        Memuat skill gap...
      </div>
    );
  }

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
          onClick={handleBack}
          style={{
            background: "transparent",
            border: "none",
            color: "rgba(255,255,255,0.55)",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          Kembali
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
              Ini adalah skill yang perlu diperkuat untuk menjadi{" "}
              <span style={{ color: "#3dba74", fontWeight: 600 }}>
                {targetRole}
              </span>
              .
            </p>

            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "12px",
                color: "rgba(255,255,255,0.35)",
                marginTop: "8px",
              }}
            >
              Confidence Score: {confidenceScore}%
            </p>
          </div>

          {/* Summary */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            {[
              {
                icon: "✕",
                label: "MISSING",
                count: missingSkills.length,
                color: "#e05a5a",
              },
              {
                icon: "=",
                label: "WEAK",
                count: weakSkills.length,
                color: "#d4a844",
              },
              {
                icon: "✓",
                label: "OWNED",
                count: ownedSkills.length,
                color: "#3dba74",
              },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
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
                    background: item.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: 700,
                  }}
                >
                  {item.icon}
                </div>

                <div>
                  <p
                    style={{
                      fontSize: "10px",
                      opacity: 0.5,
                      margin: 0,
                    }}
                  >
                    {item.label}
                  </p>

                  <p
                    style={{
                      margin: 0,
                      color: item.color,
                      fontSize: "22px",
                    }}
                  >
                    {item.count}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Missing + Weak */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            {/* Missing */}
            <div
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "14px",
                padding: "16px 18px",
              }}
            >
              <p style={{ color: "#e05a5a", marginBottom: "10px" }}>
                Missing Skills
              </p>

              {missingSkills.length > 0 ? (
                missingSkills.map((skill) => (
                  <div key={skill.name} style={{ marginBottom: "10px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "13px",
                      }}
                    >
                      <span>{skill.name}</span>
                      <span>{skill.pct}%</span>
                    </div>

                    <ProgressBar pct={skill.pct} color="#e05a5a" />
                  </div>
                ))
              ) : (
                <p
                  style={{
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.45)",
                    lineHeight: 1.6,
                  }}
                >
                  Belum ada skill gap. Selesaikan assessment untuk melihat
                  hasilnya.
                </p>
              )}
            </div>

            {/* Weak */}
            <div
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "14px",
                padding: "16px 18px",
              }}
            >
              <p style={{ color: "#d4a844", marginBottom: "10px" }}>
                Weak Skills
              </p>

              {weakSkills.map((skill) => (
                <div key={skill.name} style={{ marginBottom: "10px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "13px",
                    }}
                  >
                    <span>{skill.name}</span>
                    <span>{skill.pct}%</span>
                  </div>

                  <ProgressBar pct={skill.pct} color="#d4a844" />
                </div>
              ))}
            </div>
          </div>

          {/* Owned */}
          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(61,186,116,0.2)",
              borderRadius: "14px",
              padding: "16px 18px",
              marginBottom: "24px",
            }}
          >
            <p style={{ color: "#3dba74", marginBottom: "10px" }}>
              Skill yang Sudah Kamu Miliki
            </p>

            {ownedSkills.map((skill) => (
              <div
                key={skill}
                style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.75)",
                  marginBottom: "6px",
                }}
              >
                ✓ {skill}
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: "12px",
            }}
          >
            <button
              onClick={handleCreateLearningPath}
              style={{
                padding: "14px 16px",
                borderRadius: "12px",
                border: "1px solid rgba(61,186,116,0.25)",
                background:
                  "linear-gradient(135deg, rgba(61,186,116,0.25), rgba(61,186,116,0.08))",
                color: "#3dba74",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.25s ease",
                letterSpacing: "0.2px",
                textDecoration: "underline",
                textDecorationColor: "rgba(61,186,116,0.25)",
                textUnderlineOffset: "3px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.background =
                  "linear-gradient(135deg, rgba(61,186,116,0.35), rgba(61,186,116,0.12))";
                e.currentTarget.style.boxShadow =
                  "0 12px 30px rgba(0,0,0,0.25)";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background =
                  "linear-gradient(135deg, rgba(61,186,116,0.25), rgba(61,186,116,0.08))";
                e.currentTarget.style.boxShadow =
                  "0 8px 20px rgba(0,0,0,0.15)";
                e.currentTarget.style.color = "#3dba74";
              }}
            >
              Buat Learning Path →
            </button>

            <button
              onClick={handleExportPDF}
              style={{
                padding: "14px 22px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.75)",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.25s ease",
                letterSpacing: "0.2px",
                backdropFilter: "blur(8px)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "rgba(255,255,255,0.12)";
                e.currentTarget.style.color = "white";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 25px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  "rgba(255,255,255,0.05)";
                e.currentTarget.style.color = "rgba(255,255,255,0.75)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Export PDF
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 760px) {
          div[style*="grid-template-columns: 1fr 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }

          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }

          div[style*="grid-template-columns: 1fr auto"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}