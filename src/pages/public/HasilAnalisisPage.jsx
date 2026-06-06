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
  const persona = formatLabel(analysis.personaType || analysis.persona || "Career Explorer");

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

  const cardStyle = {
    background: "rgba(255,255,255,0.94)",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: "16px",
    padding: "18px",
    color: "#1a3a2a",
  };

  const darkCardStyle = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.11)",
    borderRadius: "16px",
    padding: "18px",
  };

  const labelStyle = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "10px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "rgba(40,70,55,0.48)",
    margin: "0 0 6px",
    fontWeight: 800,
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
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 40px",
          flexShrink: 0,
          position: "relative",
          zIndex: 2,
        }}
      >
        <Logo />

        <div
          style={{
            padding: "6px 18px",
            borderRadius: "999px",
            border: "1.5px solid rgba(61,186,116,0.5)",
            background: "rgba(61,186,116,0.08)",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px",
            color: "rgba(255,255,255,0.82)",
            fontWeight: 700,
          }}
        >
          Hasil Analisis
        </div>

        <button
          onClick={handleFinish}
          style={{
            background: "transparent",
            border: "none",
            color: "rgba(255,255,255,0.58)",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Selesai ✓
        </button>
      </nav>

      <main
        style={{
          position: "relative",
          flex: 1,
          display: "flex",
          justifyContent: "center",
          padding: "20px 24px 54px",
        }}
      >
        <div className="mesh-bg" />
        <StarField />

        <section
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: "760px",
            animation: "slideUp 0.6s ease both",
          }}
        >
          <header style={{ textAlign: "center", marginBottom: "24px" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "rgba(45,140,94,0.25)",
                border: "1.5px solid rgba(61,186,116,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
                margin: "0 auto 16px",
              }}
            >
              🧠
            </div>

            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 800,
                fontSize: "clamp(28px, 4vw, 38px)",
                margin: "0 0 10px",
              }}
            >
              <span style={{ color: "#3dba74" }}>Analisismu</span> sudah siap
            </h1>

            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                color: "rgba(255,255,255,0.58)",
                lineHeight: 1.7,
                maxWidth: "560px",
                margin: "0 auto",
              }}
            >
              AI sudah membaca jawabanmu dan menyiapkan skill gap serta langkah
              pertama yang bisa langsung kamu kerjakan.
            </p>
          </header>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "12px",
              marginBottom: "14px",
            }}
            className="hasil-grid"
          >
            <div style={cardStyle}>
              <p style={labelStyle}>Target Role</p>
              <h3 style={{ margin: 0, color: "#2d8c5e", fontSize: "18px" }}>
                {targetRole}
              </h3>
              <p style={{ margin: "6px 0 0", fontSize: "12px", color: "rgba(40,70,55,0.6)" }}>
                Level: {formatLabel(currentLevel)}
              </p>
            </div>

            <div style={cardStyle}>
              <p style={labelStyle}>Problem Category</p>
              <h3 style={{ margin: 0, color: "#c07030", fontSize: "18px" }}>
                {problemCategory}
              </h3>
              <p style={{ margin: "6px 0 0", fontSize: "12px", color: "rgba(40,70,55,0.6)" }}>
                Persona: {persona}
              </p>
            </div>

            <div style={cardStyle}>
              <p style={labelStyle}>Confidence</p>
              <h3 style={{ margin: "0 0 8px", color: "#2d8c5e", fontSize: "28px" }}>
                {confidenceScore}%
              </h3>
              <div
                style={{
                  height: "6px",
                  borderRadius: "999px",
                  background: "rgba(45,140,94,0.15)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${Math.min(100, Math.max(0, confidenceScore))}%`,
                    borderRadius: "999px",
                    background: "linear-gradient(90deg, #2d8c5e, #3dba74)",
                  }}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px",
              marginBottom: "20px",
            }}
            className="hasil-grid-2"
          >
            <div style={darkCardStyle}>
              <h3
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "14px",
                  color: "#3dba74",
                  margin: "0 0 12px",
                }}
              >
                🚀 Skill Gap Prioritas
              </h3>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "9px" }}>
                {skillGap.length ? (
                  skillGap.map((skill) => (
                    <span
                      key={skill}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "999px",
                        background: "rgba(61,186,116,0.14)",
                        border: "1px solid rgba(61,186,116,0.28)",
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "12px",
                      }}
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.58)", fontSize: "13px" }}>
                    Skill gap akan muncul setelah assessment berhasil diproses.
                  </p>
                )}
              </div>
            </div>

            <div style={darkCardStyle}>
              <h3
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "14px",
                  color: "#3dba74",
                  margin: "0 0 12px",
                }}
              >
                🎯 Langkah Pertama
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {steps.slice(0, 3).map((task, index) => (
                  <div
                    key={`${task}-${index}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "11px 12px",
                      borderRadius: "12px",
                      background: "rgba(255,255,255,0.045)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <span
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        background: "rgba(45,140,94,0.28)",
                        color: "#3dba74",
                        fontWeight: 900,
                        fontSize: "12px",
                      }}
                    >
                      {index + 1}
                    </span>
                    <p
                      style={{
                        margin: 0,
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "13px",
                        color: "rgba(255,255,255,0.82)",
                        lineHeight: 1.45,
                      }}
                    >
                      {task}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleNextJourney}
            disabled={saving}
            style={{
              width: "100%",
              padding: "15px 20px",
              borderRadius: "14px",
              border: "none",
              background: saving ? "rgba(61,186,116,0.45)" : "#3dba74",
              color: "white",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "15px",
              fontWeight: 900,
              cursor: saving ? "not-allowed" : "pointer",
              boxShadow: "0 12px 32px rgba(45,140,94,0.25)",
            }}
          >
            {saving ? "Menyimpan hasil..." : "Simpan Hasil & Lanjutkan Journey →"}
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
          .hasil-grid,
          .hasil-grid-2 {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
