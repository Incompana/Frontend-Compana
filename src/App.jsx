// src/App.jsx
import { useState } from "react";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordEmailPage from "./pages/ForgotPasswordEmailPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import InputPage from "./pages/InputPage";
import AssessmentPage from "./pages/AssessmentPage";
import LoadingScreen from "./pages/LoadingScreen";
import HasilAnalisisPage from "./pages/HasilAnalisisPage";
import SkillGapPage from "./pages/SkillGapPage";
import ActionPlanPage from "./pages/ActionPlanPage";
import TaskDetailPage from "./pages/TaskDetailPage";
import FeedbackPage from "./pages/FeedbackPage";
import DashboardPage from "./pages/DashboardPage";
import DashboardAdminPage from "./pages/DashboardAdminPage";
import GuestPromptPage from "./pages/GuestPromptPage";

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes twinkle {
    0%, 100% { opacity: 0.2; transform: scale(1); }
    50% { opacity: 0.9; transform: scale(1.3); }
  }
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .nav-link {
    color: rgba(255,255,255,0.6);
    text-decoration: none;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    transition: color 0.2s;
  }
  .nav-link:hover { color: rgba(255,255,255,0.9); }

  .hero-title {
    font-family: 'Playfair Display', serif;
    font-weight: 900;
    font-size: clamp(40px, 7vw, 72px);
    line-height: 1.1;
    letter-spacing: -1px;
    animation: slideUp 0.8s ease both;
  }

  .hero-subtitle {
    font-family: 'DM Sans', sans-serif;
    font-size: 16px;
    color: rgba(255,255,255,0.55);
    line-height: 1.7;
    max-width: 420px;
    margin: 0 auto;
    animation: slideUp 0.8s 0.15s ease both;
  }

  .cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(45, 140, 94, 0.9);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 13px 28px;
    font-size: 14px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.25s;
    animation: slideUp 0.8s 0.25s ease both;
    letter-spacing: 0.2px;
  }
  .cta-btn:hover:not(:disabled) {
    background: rgba(55, 165, 110, 1);
    transform: translateY(-2px);
  }
  .cta-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .cta-btn-nav {
    display: inline-flex;
    align-items: center;
    background: rgba(45, 140, 94, 0.85);
    color: white;
    border: none;
    border-radius: 7px;
    padding: 8px 18px;
    font-size: 13px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.2s;
  }
  .cta-btn-nav:hover { background: rgba(55, 165, 110, 1); }

  .feature-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    padding: 24px 20px;
    flex: 1;
    min-width: 200px;
    transition: border-color 0.3s, background 0.3s;
  }
  .feature-card:hover {
    border-color: rgba(45, 140, 94, 0.4);
    background: rgba(45, 140, 94, 0.06);
  }

  .badge-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(45, 140, 94, 0.15);
    border: 1px solid rgba(45, 140, 94, 0.35);
    border-radius: 999px;
    padding: 5px 14px;
    font-size: 12px;
    color: rgba(100, 220, 150, 0.9);
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    animation: slideUp 0.8s ease both;
    margin-bottom: 24px;
  }

  .mesh-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 50% 0%, rgba(20, 100, 60, 0.45) 0%, transparent 70%),
      radial-gradient(ellipse 60% 40% at 20% 80%, rgba(10, 60, 30, 0.3) 0%, transparent 60%),
      radial-gradient(ellipse 50% 40% at 80% 60%, rgba(15, 80, 45, 0.2) 0%, transparent 60%);
    pointer-events: none;
  }

  .topic-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 999px;
    padding: 8px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: rgba(255,255,255,0.7);
    cursor: pointer;
    transition: all 0.2s;
  }
  .topic-chip:hover {
    background: rgba(45, 140, 94, 0.15);
    border-color: rgba(45, 140, 94, 0.4);
    color: rgba(255,255,255,0.95);
  }

  .ghost-btn {
    background: transparent;
    border: none;
    color: rgba(255,255,255,0.45);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    cursor: pointer;
    padding: 6px 0;
    transition: color 0.2s;
  }
  .ghost-btn:hover { color: rgba(255,255,255,0.8); }

  textarea::placeholder { color: rgba(255,255,255,0.25); }
  textarea::-webkit-scrollbar { width: 4px; }
  textarea::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
`;

export default function App() {
  const [page, setPage] = useState("landing");

  return (
 <>
      <style>{GLOBAL_STYLES}</style>
      {page === "landing"             && <LandingPage             onNext={() => setPage("login")} />}
      {page === "login"               && <LoginPage               onLogin={() => setPage("dashboard")} onRegister={() => setPage("register")} onForgotPassword={() => setPage("forgot-email")} />}
      {page === "register"            && <RegisterPage            onLogin={() => setPage("login")} onForgotPassword={() => setPage("forgot-email")} />}
      {page === "forgot-email"        && <ForgotPasswordEmailPage onLogin={() => setPage("login")} onSubmit={() => setPage("forgot-password")} />}
      {page === "forgot-password"     && <ForgotPasswordPage      onLogin={() => setPage("login")} onSubmit={() => setPage("login")} />}
      {page === "dashboard"           && <DashboardPage           onNavigate={(p) => setPage(p)} />}
      {page === "input"               && <InputPage               onBack={() => setPage("login")} onNext={() => setPage("assessment")} />}
      {page === "assessment"          && <AssessmentPage          onBack={() => setPage("input")} onNext={() => setPage("loading")} />}
      {page === "loading"             && <LoadingScreen            onSkip={() => setPage("hasil-analisis")} onDone={() => setPage("hasil-analisis")} />}
      {page === "hasil-analisis"      && <HasilAnalisisPage        onLihatRoadmap={() => setPage("skill-gap")} onSimpan={() => setPage("skill-gap")} onSelesai={() => setPage("landing")} />}
      {page === "skill-gap"           && <SkillGapPage             onBuatLearningPath={() => setPage("action-plan")} onExportPDF={() => {}} onBack={() => setPage("hasil-analisis")} />}
      {page === "action-plan"         && <ActionPlanPage           onLanjutkan={() => setPage("task-detail")} onMulai={() => setPage("task-detail")} onLihatSemua={() => {}} onBack={() => setPage("skill-gap")} />}
      {page === "task-detail"         && <TaskDetailPage           onBack={() => setPage("action-plan")} onSubmit={() => setPage("feedback")} />}
      {page === "feedback"            && <FeedbackPage             onBack={() => setPage("action-plan")} onPerbaikiAI={() => setPage("task-detail")} onSubmitUlang={() => setPage("task-detail")} onDone={() => setPage("dashboard-admin")} />}
      {page === "dashboard-admin"     && <DashboardAdminPage       onNavigate={(p) => setPage(p)} />}
      {page === "guest-prompt"        && <GuestPromptPage           onLogin={() => setPage("login")} onRegister={() => setPage("register")} onGoogle={() => setPage("dashboard-admin")} onSkip={() => setPage("landing")} />}
    </>
  );
}