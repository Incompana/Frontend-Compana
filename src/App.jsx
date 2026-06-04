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
import { evaluateTask, getEndToEndDemo } from "./lib/api";
import { getActiveTaskView } from "./lib/aiViewModel";

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInputText, setUserInputText] = useState("");
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [taskEvaluation, setTaskEvaluation] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  
  const handleLogin = () => {
    setIsLoggedIn(true);
    setPage("dashboard");
  };

  const handleInputDone = (text) => {
    setUserInputText(text);
    setAssessmentResult(null);
    setTaskEvaluation(null);
    setSelectedTask(null);
    setPage("assessment");
  };

  const handleAssessmentDone = (result) => {
    setAssessmentResult(result);
    setSelectedTask(null);
    setPage("hasil-analisis");
  }

  const formatFeedback = (evaluation, task) => {
    const score = Number(evaluation.score || 0);
    const passedCriteria = evaluation.criteria_results
      ?.filter((item) => item.passed)
      .map((item) => `Kriteria terpenuhi: ${item.criteria}`) || [];
    const failedCriteria = evaluation.criteria_results
      ?.filter((item) => !item.passed) || [];
    const revisionFeedback = evaluation.revision_feedback?.length
      ? evaluation.revision_feedback
      : failedCriteria.map((item) => item.feedback_if_missing || item.criteria);
    const dimensionScores = evaluation.dimension_scores?.length
      ? evaluation.dimension_scores.map((item) => ({
          label: item.label,
          pct: Number(item.score || 0),
          weight: Number(item.weight || 0),
        }))
      : [];
    const fallbackScore = dimensionScores[0]?.pct ?? score;

    return {
      ...evaluation,
      status: evaluation.status === "passed" ? "passed" : "need-revision",
      breadcrumb: ["Action Plan", task?.taskId || task?.task_id || "Task", "Feedback"],
      needRevision: {
        title: "Need Revision",
        desc: "Ada beberapa kriteria yang belum terpenuhi.",
        xp: Math.max(20, Math.round(score * 0.8)),
      },
      contohPassed: {
        title: "Passed!",
        desc: "Semua kriteria utama terpenuhi. Langkah berikutnya sudah terbuka.",
        xp: Math.max(80, Math.round(score)),
      },
      strengths: evaluation.positive_feedback?.length ? evaluation.positive_feedback : passedCriteria,
      weaknesses: failedCriteria.map((item) => item.criteria),
      saranPerbaikan: revisionFeedback,
      dimensionScores,
      skor: {
        ketepatan: dimensionScores[0]?.pct ?? fallbackScore,
        kelengkapan: dimensionScores[1]?.pct ?? fallbackScore,
        kualitasKode: dimensionScores[2]?.pct ?? fallbackScore,
      },
    };
  };

  const handleRunDemo = async () => {
    setIsDemoLoading(true);
    try {
      const demo = await getEndToEndDemo();
      const firstTask = demo.action_plan?.recommended_tasks?.[0] || null;
      const taskView = firstTask ? { taskId: firstTask.task_id, task_id: firstTask.task_id } : null;

      setUserInputText(demo.use_case?.user_input_text || demo.input?.user_input_text || "");
      setAssessmentResult(demo);
      setSelectedTask(null);
      setTaskEvaluation(formatFeedback(demo.demo_evaluation || {}, taskView));
      setPage("action-plan");
    } catch (error) {
      setAssessmentResult({
        pretext_analysis: { target_role: "backend_developer", problem_category: "direction_confused" },
        action_plan: { recommended_tasks: [] },
        _demo_error: error.message,
      });
      setPage("input");
    } finally {
      setIsDemoLoading(false);
    }
  };

  const handleStartTask = (task) => {
    setSelectedTask(task || null);
    setPage("task-detail");
  };

  const handleTaskSubmit = async ({ notes, file }) => {
    const task = getActiveTaskView(assessmentResult, selectedTask);
    const evaluation = await evaluateTask({
      taskId: task?.taskId || "T3",
      submissionText: notes || "",
      submissionFiles: file ? [file.name] : [],
    });
    setTaskEvaluation(formatFeedback(evaluation, task));
    setPage("feedback");
  };

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
 
      {/* ── Alur utama (guest & logged-in sama) ──────────────────────── */}
      {page === "landing"         && <LandingPage    onNext={() => setPage("input")} />}
      {page === "input"           && <InputPage      onBack={() => setPage("landing")} onNext={handleInputDone} onRunDemo={handleRunDemo} isDemoLoading={isDemoLoading} />}
      {page === "assessment"      && <AssessmentPage userInputText={userInputText} onBack={() => setPage("input")} onNext={handleAssessmentDone} />}
      {page === "loading"         && <LoadingScreen  onSkip={() => setPage("hasil-analisis")} onDone={() => setPage("hasil-analisis")} />}
 
      {/* ── Guest: hasil analisis → skill-gap → login-register prompt ── */}
      {page === "guest-prompt"    && <GuestPromptPage onLogin={() => setPage("login")} onRegister={() => setPage("register")} onGoogle={handleLogin} onSkip={() => setPage("landing")} />}
 
      {/* ── Auth ─────────────────────────────────────────────────────── */}
      {page === "login"           && <LoginPage               onLogin={handleLogin} onRegister={() => setPage("register")} onForgotPassword={() => setPage("forgot-email")} />}
      {page === "register"        && <RegisterPage            onLogin={() => setPage("login")} onForgotPassword={() => setPage("forgot-email")} />}
      {page === "forgot-email"    && <ForgotPasswordEmailPage onLogin={() => setPage("login")} onSubmit={() => setPage("forgot-password")} />}
      {page === "forgot-password" && <ForgotPasswordPage      onLogin={() => setPage("login")} onSubmit={() => setPage("login")} />}
 
      {/* ── Logged-in: dashboard & fitur lanjutan ────────────────────── */}
      {page === "dashboard"       && <DashboardPage      onNavigate={(p) => setPage(p)} />}
      {page === "dashboard-admin" && <DashboardAdminPage onNavigate={(p) => setPage(p)} />}
      {page === "hasil-analisis"  && <HasilAnalisisPage analysis={assessmentResult} onLihatRoadmap={() => setPage("skill-gap")} onSimpan={() => setPage("skill-gap")} onSelesai={() => setPage("landing")} />}
      {page === "skill-gap"       && <SkillGapPage analysis={assessmentResult} onBuatLearningPath={() => setPage("action-plan")} onExportPDF={() => {}} onBack={() => setPage("hasil-analisis")} />}
      {page === "action-plan"     && <ActionPlanPage analysis={assessmentResult} onLanjutkan={() => handleStartTask(selectedTask)} onMulai={handleStartTask} onLihatSemua={() => {}} onBack={() => setPage("skill-gap")} />}
      {page === "task-detail"     && <TaskDetailPage analysis={assessmentResult} task={selectedTask} onBack={() => setPage("action-plan")} onSubmit={handleTaskSubmit} />}
      {page === "feedback"        && <FeedbackPage feedback={taskEvaluation} onBack={() => setPage("action-plan")} onPerbaikiAI={() => setPage("task-detail")} onSubmitUlang={() => setPage("task-detail")} />}
    </>
  );
}
