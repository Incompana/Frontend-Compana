// src/pages/ActionPlanPage.jsx
import { useState } from "react";
import { Logo, StarField } from "../components/Shared";
import { getActionPlanView } from "../lib/aiViewModel";

const PHASES = [
  {
    id: 1,
    label: "PHASE 1 — FONDASI (MINGGU 1–2)",
    steps: [
      {
        id: "s1",
        title: "HTML5 Semantic Structure",
        desc: "Pelajari tag semantik HTML5: header, main, section, article, footer.",
        tags: ["HTML", "Semantik"],
        duration: "3 hari",
        xp: 50,
        status: "selesai",
      },
      {
        id: "s2",
        title: "CSS Box Model & Flexbox",
        desc: "Kuasai box model, margin/padding, serta layout dengan Flexbox.",
        tags: ["CSS", "Flexbox"],
        duration: "4 hari",
        xp: 70,
        status: "selesai",
      },
      {
        id: "s3",
        title: "JavaScript ES6 Dasar",
        desc: "Pelajari variabel (let/const), arrow function, array methods, template literals.",
        tags: ["JavaScript", "ES6"],
        duration: "7 hari",
        xp: 120,
        status: "berjalan",
        cta: "Mulai Hari Ini →",
      },
    ],
  },
  {
    id: 2,
    label: "PHASE 2 — INTERMEDIATE (MINGGU 3–5)",
    locked: true,
    steps: [
      {
        id: "s4",
        title: "DOM Manipulation",
        tags: ["DOM"],
        xp: 100,
        status: "terkunci",
      },
      {
        id: "s5",
        title: "Git & GitHub Dasar",
        tags: ["Git"],
        xp: 90,
        status: "terkunci",
      },
      {
        id: "s6",
        title: "Build Project: Portfolio Website",
        tags: ["Project", "Deploy"],
        xp: 200,
        status: "terkunci",
      },
    ],
  },
];

const statusConfig = {
  selesai: { bg: "rgba(61,186,116,0.15)", border: "rgba(61,186,116,0.4)", icon: "✓", iconBg: "#3dba74", badgeColor: "#3dba74", badgeBg: "rgba(61,186,116,0.15)", badgeText: "✓ Selesai" },
  berjalan: { bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.12)", icon: "▶", iconBg: "#4a9c6a", badgeColor: "#a8d8b8", badgeBg: "rgba(61,186,116,0.1)", badgeText: "▷ Sedang Berjalan" },
  terkunci: { bg: "rgba(255,255,255,0.02)", border: "rgba(255,255,255,0.06)", icon: "🔒", iconBg: "#3a5a4a", badgeColor: "rgba(255,255,255,0.3)", badgeBg: "rgba(255,255,255,0.06)", badgeText: "🔒 Terkunci" },
};

export default function ActionPlanPage({ analysis, onLanjutkan, onMulai, onLihatSemua, onBack }) {
  const plan = getActionPlanView(analysis);
  const phases = plan.tasks.length
    ? [
        {
          id: "dynamic",
          label: "PHASE 1 — LANGKAH PRIORITAS",
          steps: plan.tasks,
        },
      ]
    : PHASES;
  const totalSteps = phases.flatMap((p) => p.steps).length;
  const doneSteps = phases.flatMap((p) => p.steps).filter((step) => step.status === "selesai").length;
  const activeStep = phases.flatMap((p) => p.steps).find((step) => step.status === "berjalan");
  const [expanded, setExpanded] = useState(activeStep?.id || "s3");

  const pct = totalSteps ? Math.round((doneSteps / totalSteps) * 100) : 0;

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
            border: "1.5px solid rgba(255,255,255,0.25)",
            background: "rgba(255,255,255,0.08)",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px",
            color: "rgba(255,255,255,0.85)",
            fontWeight: 500,
          }}
        >
          Action Plan
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
          {plan.targetRole}
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
          <div style={{ textAlign: "center", marginBottom: "22px" }}>
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
                fontSize: "22px",
                margin: "0 auto 14px",
              }}
            >
              🗺️
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
                Action Plan
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
              Selesaikan langkah-langkah ini secara berurutan. Langkah berikutnya terbuka setelah yang sebelumnya selesai.
            </p>
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.45)",
                }}
              >
                {doneSteps} dari {totalSteps} langkah selesai
              </span>
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.45)",
                }}
              >
                ~{pct}%
              </span>
            </div>
            <div
              style={{
                height: "5px",
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
                  background: "linear-gradient(90deg, #2d8c5e, #3dba74)",
                  transition: "width 0.8s ease",
                }}
              />
            </div>
          </div>

          {/* Phases */}
          {phases.map((phase) => (
            <div key={phase.id} style={{ marginBottom: "16px" }}>
              {/* Phase label */}
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "11px",
                  letterSpacing: "0.1em",
                  color: "rgba(255,255,255,0.35)",
                  textTransform: "uppercase",
                  marginBottom: "10px",
                  paddingLeft: "42px",
                }}
              >
                {phase.label}
              </p>

              {/* Steps with timeline */}
              <div style={{ position: "relative" }}>
                {/* Vertical line */}
                <div
                  style={{
                    position: "absolute",
                    left: "17px",
                    top: "20px",
                    bottom: "20px",
                    width: "2px",
                    background: phase.locked
                      ? "rgba(255,255,255,0.07)"
                      : "rgba(61,186,116,0.3)",
                  }}
                />

                {phase.steps.map((step, si) => {
                  const cfg = statusConfig[step.status];
                  const isExpanded = expanded === step.id;

                  return (
                    <div
                      key={step.id}
                      style={{
                        display: "flex",
                        gap: "12px",
                        marginBottom: si < phase.steps.length - 1 ? "8px" : 0,
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      {/* Timeline dot */}
                      <div
                        style={{
                          width: "34px",
                          height: "34px",
                          borderRadius: "50%",
                          background: cfg.iconBg,
                          border: `2px solid ${cfg.border}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "14px",
                          flexShrink: 0,
                          marginTop: "2px",
                          color: "white",
                          fontWeight: 700,
                        }}
                      >
                        {step.status === "terkunci" ? "🔒" : step.status === "selesai" ? "✓" : "▶"}
                      </div>

                      {/* Card */}
                      <div
                        onClick={() =>
                          step.status !== "terkunci" &&
                          setExpanded(isExpanded ? null : step.id)
                        }
                        style={{
                          flex: 1,
                          background: cfg.bg,
                          border: `1px solid ${cfg.border}`,
                          borderRadius: "12px",
                          padding: "12px 16px",
                          cursor: step.status !== "terkunci" ? "pointer" : "default",
                          transition: "border-color 0.2s",
                          opacity: step.status === "terkunci" ? 0.55 : 1,
                        }}
                      >
                        {/* Header row */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: isExpanded && step.desc ? "8px" : 0,
                          }}
                        >
                          <p
                            style={{
                              fontFamily: "'DM Sans', sans-serif",
                              fontWeight: 600,
                              fontSize: "14px",
                              color:
                                step.status === "terkunci"
                                  ? "rgba(255,255,255,0.4)"
                                  : "rgba(255,255,255,0.9)",
                              margin: 0,
                              textDecoration:
                                step.status !== "terkunci" ? "underline" : "none",
                              textDecorationColor: "rgba(255,255,255,0.2)",
                              textUnderlineOffset: "3px",
                            }}
                          >
                            {step.title}
                          </p>
                          <span
                            style={{
                              fontFamily: "'DM Sans', sans-serif",
                              fontSize: "11px",
                              color: cfg.badgeColor,
                              background: cfg.badgeBg,
                              padding: "3px 10px",
                              borderRadius: "999px",
                              border: `1px solid ${cfg.border}`,
                              flexShrink: 0,
                            }}
                          >
                            {cfg.badgeText}
                          </span>
                        </div>

                        {/* Expanded content */}
                        {isExpanded && step.desc && (
                          <>
                            <p
                              style={{
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: "12px",
                                color: "rgba(255,255,255,0.5)",
                                margin: "0 0 10px",
                                textDecoration: "underline",
                                textDecorationColor: "rgba(255,255,255,0.15)",
                                textUnderlineOffset: "3px",
                              }}
                            >
                              {step.desc}
                            </p>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                {step.tags?.map((t) => (
                                  <span
                                    key={t}
                                    style={{
                                      fontFamily: "'DM Sans', sans-serif",
                                      fontSize: "11px",
                                      color: "rgba(255,255,255,0.6)",
                                      background: "rgba(255,255,255,0.07)",
                                      border: "1px solid rgba(255,255,255,0.12)",
                                      padding: "2px 8px",
                                      borderRadius: "6px",
                                    }}
                                  >
                                    {t}
                                  </span>
                                ))}
                                {step.duration && (
                                  <span
                                    style={{
                                      fontFamily: "'DM Sans', sans-serif",
                                      fontSize: "11px",
                                      color: "rgba(255,255,255,0.4)",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "4px",
                                    }}
                                  >
                                    ⏱ {step.duration}
                                  </span>
                                )}
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span
                                  style={{
                                    fontFamily: "'DM Sans', sans-serif",
                                    fontSize: "12px",
                                    color: "#3dba74",
                                    fontWeight: 600,
                                  }}
                                >
                                  +{step.xp} XP
                                </span>
                                {step.cta && step.status === "berjalan" && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                  if (onMulai) onMulai(step);
                                    }}
                                    style={{
                                      padding: "6px 14px",
                                      borderRadius: "8px",
                                      border: "none",
                                      background: "#3dba74",
                                      color: "white",
                                      fontFamily: "'DM Sans', sans-serif",
                                      fontSize: "12px",
                                      fontWeight: 600,
                                      cursor: "pointer",
                                      transition: "all 0.2s",
                                    }}
                                    onMouseEnter={(e) =>
                                      (e.target.style.background = "#4dcf85")
                                    }
                                    onMouseLeave={(e) =>
                                      (e.target.style.background = "#3dba74")
                                    }
                                  >
                                    {step.cta}
                                  </button>
                                )}
                              </div>
                            </div>
                          </>
                        )}

                        {/* Collapsed XP (locked cards) */}
                        {step.status === "terkunci" && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginTop: "6px",
                            }}
                          >
                            <div style={{ display: "flex", gap: "6px" }}>
                              {step.tags?.map((t) => (
                                <span
                                  key={t}
                                  style={{
                                    fontFamily: "'DM Sans', sans-serif",
                                    fontSize: "11px",
                                    color: "rgba(255,255,255,0.25)",
                                    background: "rgba(255,255,255,0.04)",
                                    border: "1px solid rgba(255,255,255,0.07)",
                                    padding: "2px 8px",
                                    borderRadius: "6px",
                                  }}
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                            <span
                              style={{
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: "12px",
                                color: "rgba(255,255,255,0.25)",
                                fontWeight: 600,
                              }}
                            >
                              +{step.xp} XP
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Bottom buttons */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "12px", marginTop: "8px" }}>
            <button
              onClick={onLanjutkan}
              style={{
                padding: "14px",
                borderRadius: "12px",
                border: "none",
                background: "rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.7)",
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
                e.target.style.background = "rgba(255,255,255,0.16)";
                e.target.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255,255,255,0.1)";
                e.target.style.color = "rgba(255,255,255,0.7)";
              }}
            >
              Lanjutkan Langkah Aktif →
            </button>
            <button
              onClick={onLihatSemua}
              style={{
                padding: "14px 28px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.07)",
                color: "rgba(255,255,255,0.75)",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.13)";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                e.currentTarget.style.color = "rgba(255,255,255,0.75)";
              }}
            >
              Lihat Semua
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
