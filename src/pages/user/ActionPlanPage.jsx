// src/pages/user/ActionPlanPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo, StarField } from "../../components/Shared";
import api from "../../api/axios";
import toast from "react-hot-toast";

const getStatusConfig = (step) => {
  if (step.isCompleted || step.status === "selesai") {
    return {
      label: "Selesai",
      icon: "✓",
      tone: "done",
      canStart: false,
    };
  }

  if (step.status === "revision") {
    return {
      label: "Perlu Revisi",
      icon: "!",
      tone: "revision",
      canStart: true,
    };
  }

  if (step.status === "berjalan" || !step.isLocked) {
    return {
      label: "Sedang Berjalan",
      icon: "▶",
      tone: "active",
      canStart: true,
    };
  }

  return {
    label: "Terkunci",
    icon: "🔒",
    tone: "locked",
    canStart: false,
  };
};

export default function ActionPlanPage() {
  const navigate = useNavigate();

  const [actionPlan, setActionPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchActionPlan = async () => {
      try {
        const res = await api.get("/action-plans/me");
        const data = res.data.data;

        setActionPlan(data);

        const activeStep =
          data?.steps?.find(
            (step) =>
              step.status === "revision" ||
              step.status === "berjalan" ||
              (!step.isCompleted && !step.isLocked)
          ) ||
          data?.steps?.find((step) => !step.isCompleted) ||
          data?.steps?.[0] ||
          null;

        setExpanded(activeStep?.order || data?.steps?.[0]?.order || null);
      } catch (error) {
        console.log(error.response?.data || error.message);

        toast.error(
          error.response?.data?.message ||
            "Gagal mengambil action plan"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchActionPlan();
  }, []);

  const targetRole = actionPlan?.targetRole || "Belum ditentukan";
  const confidenceScore = actionPlan?.confidenceScore || 0;

  const steps = useMemo(() => {
    return actionPlan?.steps || [];
  }, [actionPlan]);

  const completedSteps = steps.filter(
    (step) => step.isCompleted || step.status === "selesai"
  ).length;

  const totalSteps = steps.length;

  const progressPct =
    totalSteps > 0
      ? Math.round((completedSteps / totalSteps) * 100)
      : 0;

  const activeStep = useMemo(() => {
    return (
      steps.find(
        (step) =>
          step.status === "revision" ||
          step.status === "berjalan" ||
          (!step.isCompleted && !step.isLocked)
      ) ||
      steps.find((step) => !step.isCompleted) ||
      null
    );
  }, [steps]);

  const allCompleted = totalSteps > 0 && completedSteps === totalSteps;

  const handleStartStep = (step) => {
    if (!step) {
      toast.error("Belum ada langkah yang bisa dimulai");
      return;
    }

    if (step.isCompleted || step.status === "selesai") {
      toast.success("Task ini sudah selesai.");
      return;
    }

    if (step.isLocked) {
      toast.error("Selesaikan langkah sebelumnya dulu.");
      return;
    }

    localStorage.setItem("activeTask", JSON.stringify(step));

    toast.success(`Mulai: ${step.title}`);
    navigate("/task-detail");
  };

  const handleStartCurrentStep = () => {
    if (allCompleted) {
      toast.success("Semua langkah sudah selesai. Mantap!");
      navigate("/dashboardUser");
      return;
    }

    handleStartStep(activeStep);
  };

  const handleGoDashboard = () => {
    navigate("/dashboardUser");
  };

  const handleBack = () => {
    navigate("/skill-gap");
  };

  if (loading) {
    return (
      <div className="action-loading">
        <div className="action-loading-card">
          <div>🗺️</div>
          <p>Memuat action plan...</p>
        </div>

        <style>{`
          .action-loading {
            min-height: 100vh;
            min-height: 100svh;
            background: #0a1f12;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'DM Sans', sans-serif;
            padding: 24px;
          }

          .action-loading-card {
            text-align: center;
            background: rgba(255,255,255,0.06);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 20px;
            padding: 26px 28px;
          }

          .action-loading-card div {
            width: 54px;
            height: 54px;
            border-radius: 50%;
            background: rgba(61,186,116,0.14);
            border: 1px solid rgba(61,186,116,0.28);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 14px;
            font-size: 24px;
          }

          .action-loading-card p {
            margin: 0;
            color: rgba(255,255,255,0.72);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="action-page">
      <nav className="action-navbar">
        <div className="action-logo-wrap">
          <Logo />
        </div>

        <div className="action-nav-pill">Action Plan</div>

        <button type="button" onClick={handleBack} className="action-nav-back">
          Skill Gap
        </button>
      </nav>

      <main className="action-main">
        <div className="mesh-bg" />
        <StarField />

        <section className="action-content">
          <header className="action-hero">
            <div className="action-hero-badge">
              <span />
              Personalized Roadmap
            </div>

            <div className="action-hero-icon">🗺️</div>

            <h1>
              Action Plan <span>Kamu</span>
            </h1>

            <p>
              Roadmap belajar personal untuk menjadi{" "}
              <strong>{targetRole}</strong>.
            </p>
          </header>

          <section className="action-progress-card">
            <div className="action-progress-copy">
              <p className="action-small-label">Progress Action Plan</p>
              <h2>{completedSteps}/{totalSteps || 0} langkah</h2>
              <span>Confidence Score: {confidenceScore}%</span>
            </div>

            <div className="action-progress-ring">
              <strong>{progressPct}%</strong>
            </div>

            <div className="action-progress-track">
              <div
                className="action-progress-fill"
                style={{ width: `${Math.min(100, Math.max(0, progressPct))}%` }}
              />
            </div>

            {allCompleted && (
              <p className="action-complete-note">🎉 Semua langkah sudah selesai.</p>
            )}
          </section>

          {steps.length === 0 && (
            <article className="action-empty-card">
              <div>📝</div>
              <h3>Action plan belum tersedia</h3>
              <p>Selesaikan assessment terlebih dahulu untuk membuka roadmap personalmu.</p>
            </article>
          )}

          <div className="action-timeline">
            {steps.map((step, index) => {
              const cfg = getStatusConfig(step);
              const isExpanded = expanded === step.order;

              return (
                <article key={step.order} className={`action-step ${cfg.tone}`}>
                  <div className="action-step-marker">
                    {index < steps.length - 1 && <span />}
                    <div>{cfg.icon}</div>
                  </div>

                  <div
                    className="action-step-card"
                    onClick={() => setExpanded(isExpanded ? null : step.order)}
                  >
                    <div className="action-step-top">
                      <div>
                        <p>Step {step.order}</p>
                        <h3>{step.title}</h3>
                        <span>Estimasi {step.estimatedDays} hari</span>
                      </div>

                      <strong>{cfg.label}</strong>
                    </div>

                    {isExpanded && (
                      <div className="action-step-detail">
                        <p>{step.description}</p>

                        <div className="action-step-footer">
                          <div className="action-step-tags">
                            <span>Step {step.order}</span>
                            <span>{step.estimatedDays} hari</span>
                          </div>

                          {cfg.canStart && (
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleStartStep(step);
                              }}
                            >
                              {step.status === "revision"
                                ? "Submit Ulang →"
                                : "Mulai →"}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="action-cta-card">
            <div>
              <h3>{allCompleted ? "Roadmap selesai 🎉" : "Lanjutkan langkah aktif"}</h3>
              <p>
                {allCompleted
                  ? "Kamu sudah menyelesaikan seluruh langkah. Buka dashboard untuk melihat progress."
                  : "Mulai dari langkah yang sedang aktif agar progress kamu terus berjalan."}
              </p>
            </div>

            <div className="action-cta-buttons">
              <button type="button" onClick={handleStartCurrentStep}>
                {allCompleted ? "Ke Dashboard →" : "Mulai Langkah Aktif →"}
              </button>

              <button type="button" onClick={handleGoDashboard}>
                Dashboard
              </button>
            </div>
          </div>
        </section>
      </main>

      <style>{`
        .action-page {
          min-height: 100vh;
          min-height: 100svh;
          background: #0a1f12;
          color: white;
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
        }

        .action-navbar {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
          align-items: center;
          gap: 14px;
          padding: 14px clamp(18px, 4vw, 40px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          position: relative;
          z-index: 3;
        }

        .action-logo-wrap {
          min-width: 0;
          overflow: hidden;
        }

        .action-nav-pill {
          justify-self: center;
          padding: 7px 17px;
          border-radius: 999px;
          border: 1.5px solid rgba(61,186,116,0.38);
          background: rgba(61,186,116,0.08);
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          color: rgba(255,255,255,0.82);
          font-weight: 900;
          white-space: nowrap;
        }

        .action-nav-back {
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

        .action-nav-back:hover {
          color: white;
        }

        .action-main {
          flex: 1;
          position: relative;
          display: flex;
          justify-content: center;
          padding: clamp(24px, 5vh, 42px) clamp(14px, 4vw, 24px) 54px;
          overflow: hidden;
        }

        .action-content {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 900px;
          animation: actionSlideUp 0.55s ease both;
        }

        .action-hero {
          text-align: center;
          max-width: 720px;
          margin: 0 auto 22px;
        }

        .action-hero-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 7px 16px;
          border-radius: 999px;
          border: 1px solid rgba(61,186,116,0.3);
          background: rgba(61,186,116,0.08);
          color: rgba(255,255,255,0.76);
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 900;
          margin-bottom: 16px;
        }

        .action-hero-badge span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #3dba74;
          box-shadow: 0 0 9px rgba(61,186,116,0.7);
        }

        .action-hero-icon {
          width: 62px;
          height: 62px;
          border-radius: 22px;
          background: linear-gradient(135deg, rgba(45,140,94,0.25), rgba(61,186,116,0.13));
          border: 1px solid rgba(61,186,116,0.32);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 27px;
          margin: 0 auto 16px;
          box-shadow: 0 18px 44px rgba(0,0,0,0.18);
        }

        .action-hero h1 {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: clamp(32px, 5vw, 46px);
          line-height: 1.08;
          margin: 0 0 12px;
          letter-spacing: -0.5px;
        }

        .action-hero h1 span {
          color: #3dba74;
          text-decoration: underline;
          text-decoration-color: rgba(61,186,116,0.38);
          text-underline-offset: 6px;
        }

        .action-hero p {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(13px, 2vw, 15px);
          color: rgba(255,255,255,0.58);
          line-height: 1.75;
          margin: 0 auto;
          max-width: 640px;
        }

        .action-hero p strong {
          color: #3dba74;
        }

        .action-progress-card,
        .action-empty-card,
        .action-step-card,
        .action-cta-card {
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.06);
          border-radius: 24px;
          backdrop-filter: blur(10px);
          box-shadow: 0 22px 76px rgba(0,0,0,0.18);
        }

        .action-progress-card {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 18px;
          padding: clamp(20px, 4vw, 26px);
          margin-bottom: 18px;
          background:
            radial-gradient(circle at top left, rgba(61,186,116,0.16), transparent 34%),
            rgba(255,255,255,0.065);
        }

        .action-small-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.09em;
          color: rgba(126,240,170,0.72);
          font-weight: 900;
          margin: 0 0 8px;
        }

        .action-progress-copy h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(27px, 4vw, 36px);
          line-height: 1.1;
          margin: 0 0 6px;
          color: white;
        }

        .action-progress-copy span {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(255,255,255,0.56);
        }

        .action-progress-ring {
          width: 78px;
          height: 78px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(61,186,116,0.13);
          border: 1px solid rgba(61,186,116,0.32);
          color: #7ef0aa;
          font-family: 'DM Sans', sans-serif;
        }

        .action-progress-ring strong {
          font-size: 18px;
        }

        .action-progress-track {
          grid-column: 1 / -1;
          height: 8px;
          border-radius: 999px;
          background: rgba(255,255,255,0.09);
          overflow: hidden;
        }

        .action-progress-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #2d8c5e, #3dba74);
          transition: width 0.8s ease;
        }

        .action-complete-note {
          grid-column: 1 / -1;
          margin: 0;
          color: #7ef0aa;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 900;
        }

        .action-empty-card {
          padding: 26px;
          text-align: center;
          margin-bottom: 18px;
        }

        .action-empty-card div {
          font-size: 32px;
          margin-bottom: 10px;
        }

        .action-empty-card h3 {
          margin: 0 0 8px;
          font-family: 'DM Sans', sans-serif;
        }

        .action-empty-card p {
          margin: 0;
          color: rgba(255,255,255,0.58);
          line-height: 1.7;
        }

        .action-timeline {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .action-step {
          display: grid;
          grid-template-columns: 46px minmax(0, 1fr);
          gap: 12px;
          position: relative;
        }

        .action-step-marker {
          display: flex;
          justify-content: center;
          position: relative;
        }

        .action-step-marker > span {
          position: absolute;
          top: 42px;
          bottom: -18px;
          width: 2px;
          background: rgba(61,186,116,0.2);
        }

        .action-step.done .action-step-marker > span {
          background: rgba(61,186,116,0.42);
        }

        .action-step-marker > div {
          position: relative;
          z-index: 1;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 900;
          border: 2px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.14);
        }

        .action-step.done .action-step-marker > div,
        .action-step.active .action-step-marker > div {
          background: #3dba74;
          border-color: rgba(61,186,116,0.4);
        }

        .action-step.revision .action-step-marker > div {
          background: #d4a844;
          border-color: rgba(212,168,68,0.4);
        }

        .action-step.locked .action-step-marker > div {
          background: rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.48);
        }

        .action-step-card {
          cursor: pointer;
          padding: 18px;
          transition: border-color 0.2s, background 0.2s, transform 0.2s;
        }

        .action-step-card:hover {
          transform: translateY(-1px);
          background: rgba(255,255,255,0.075);
        }

        .action-step-top {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          align-items: flex-start;
        }

        .action-step-top p {
          margin: 0 0 6px;
          color: rgba(126,240,170,0.66);
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.09em;
          font-weight: 900;
        }

        .action-step-top h3 {
          margin: 0 0 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          line-height: 1.45;
          color: rgba(255,255,255,0.92);
        }

        .action-step-top span {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          color: rgba(255,255,255,0.45);
        }

        .action-step-top strong {
          flex-shrink: 0;
          padding: 5px 11px;
          border-radius: 999px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          color: rgba(255,255,255,0.8);
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
        }

        .action-step.done .action-step-top strong,
        .action-step.active .action-step-top strong {
          color: #7ef0aa;
          background: rgba(61,186,116,0.13);
          border-color: rgba(61,186,116,0.24);
        }

        .action-step.revision .action-step-top strong {
          color: #ffd36b;
          background: rgba(212,168,68,0.12);
          border-color: rgba(212,168,68,0.24);
        }

        .action-step-detail {
          margin-top: 14px;
          padding-top: 14px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }

        .action-step-detail > p {
          margin: 0 0 14px;
          color: rgba(255,255,255,0.58);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          line-height: 1.75;
        }

        .action-step-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }

        .action-step-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .action-step-tags span {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          color: rgba(255,255,255,0.58);
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          padding: 5px 9px;
          border-radius: 8px;
          font-weight: 800;
        }

        .action-step-footer button {
          border: none;
          border-radius: 11px;
          background: #3dba74;
          color: white;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 900;
          cursor: pointer;
          padding: 10px 16px;
          white-space: nowrap;
        }

        .action-step.revision .action-step-footer button {
          background: #d4a844;
        }

        .action-cta-card {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 16px;
          align-items: center;
          margin-top: 18px;
          padding: 18px;
          background:
            linear-gradient(135deg, rgba(45,140,94,0.24), rgba(61,186,116,0.08)),
            rgba(255,255,255,0.06);
        }

        .action-cta-card h3 {
          margin: 0;
          font-family: 'DM Sans', sans-serif;
          font-size: 18px;
          color: white;
        }

        .action-cta-card p {
          margin: 6px 0 0;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(255,255,255,0.62);
          line-height: 1.65;
        }

        .action-cta-buttons {
          display: flex;
          gap: 10px;
        }

        .action-cta-buttons button {
          border-radius: 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 900;
          cursor: pointer;
          padding: 13px 16px;
          min-height: 46px;
          white-space: nowrap;
        }

        .action-cta-buttons button:first-child {
          border: none;
          background: #3dba74;
          color: white;
          box-shadow: 0 14px 34px rgba(45,140,94,0.28);
        }

        .action-cta-buttons button:last-child {
          border: 1px solid rgba(255,255,255,0.13);
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.76);
        }

        @keyframes actionSlideUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 860px) {
          .action-progress-card,
          .action-cta-card {
            grid-template-columns: 1fr;
          }

          .action-progress-ring {
            justify-self: start;
          }

          .action-cta-buttons {
            width: 100%;
          }

          .action-cta-buttons button {
            flex: 1;
          }
        }

        @media (max-width: 560px) {
          .action-navbar {
            grid-template-columns: 1fr auto;
            padding: 12px 16px;
          }

          .action-logo-wrap {
            transform: scale(0.92);
            transform-origin: left center;
          }

          .action-nav-pill {
            display: none;
          }

          .action-nav-back {
            font-size: 12px;
          }

          .action-main {
            padding: 24px 12px 38px;
            overflow-y: auto;
          }

          .action-hero {
            margin-bottom: 18px;
          }

          .action-hero-badge {
            font-size: 11px;
            padding: 7px 13px;
            margin-bottom: 14px;
          }

          .action-hero-icon {
            width: 56px;
            height: 56px;
            border-radius: 18px;
            font-size: 25px;
          }

          .action-hero h1 {
            font-size: 34px;
          }

          .action-hero p {
            font-size: 13px;
          }

          .action-progress-card,
          .action-empty-card,
          .action-step-card,
          .action-cta-card {
            border-radius: 20px;
          }

          .action-step {
            grid-template-columns: 36px minmax(0, 1fr);
            gap: 8px;
          }

          .action-step-marker > div {
            width: 32px;
            height: 32px;
            font-size: 12px;
          }

          .action-step-marker > span {
            top: 36px;
          }

          .action-step-card {
            padding: 15px;
          }

          .action-step-top {
            flex-direction: column;
            gap: 10px;
          }

          .action-step-top strong {
            align-self: flex-start;
          }

          .action-step-footer {
            flex-direction: column;
            align-items: stretch;
          }

          .action-step-footer button {
            width: 100%;
          }

          .action-cta-buttons {
            flex-direction: column;
          }
        }

        @media (max-width: 360px) {
          .action-hero h1 {
            font-size: 31px;
          }

          .action-progress-copy h2 {
            font-size: 27px;
          }
        }
      `}</style>
    </div>
  );
}
