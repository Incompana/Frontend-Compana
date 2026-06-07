// src/pages/user/DashboardUserPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { StarField } from "../../components/Shared";
import { logout } from "../../utils/auth";
import api from "../../api/axios";
import toast from "react-hot-toast";
import LogoutConfirmModal from "../../components/LogoutConfirmModal";

const getStoredUser = () => {
  const savedUser = localStorage.getItem("user");

  if (!savedUser) return null;

  try {
    return JSON.parse(savedUser);
  } catch {
    return null;
  }
};

const getDisplayName = (user) => {
  return (
    user?.username ||
    user?.name ||
    user?.email?.split("@")[0] ||
    "User"
  );
};

const getBackendBaseUrl = () => {
  const baseURL = api.defaults.baseURL || "http://localhost:5000/api";

  return baseURL.replace(/\/api\/?$/, "");
};

const getFileUrl = (path) => {
  if (!path) return "";

  if (path.startsWith("http")) return path;

  return `${getBackendBaseUrl()}${path}`;
};

const NAV_ITEMS = [
  {
    id: "dashboard",
    icon: "📊",
    label: "Dashboard",
    path: "/dashboardUser",
  },
  {
    id: "profile",
    icon: "👤",
    label: "Profil",
    path: "/profile",
  },
  {
    id: "skill-gap",
    icon: "🔍",
    label: "Skill Gap",
    path: "/skill-gap",
  },
  {
    id: "action-plan",
    icon: "🗺️",
    label: "Action Plan",
    path: "/action-plan",
  },
  {
    id: "tasks",
    icon: "📋",
    label: "Task",
    path: "/task-detail",
  },
  {
    id: "feedback",
    icon: "💬",
    label: "Feedback",
    path: "/feedback",
  },
];

const QUICK_ACTIONS = [
  {
    icon: "🔍",
    title: "Skill Gap",
    desc: "Lihat kemampuan yang perlu kamu tingkatkan.",
    path: "/skill-gap",
  },
  {
    icon: "🗺️",
    title: "Action Plan",
    desc: "Ikuti roadmap belajar personalmu.",
    path: "/action-plan",
  },
  {
    icon: "💬",
    title: "Feedback",
    desc: "Lihat hasil evaluasi task terakhir.",
    path: "/feedback",
  },
];

export default function DashboardUserPage() {
  const routerNavigate = useNavigate();
  const location = useLocation();

  const [actionPlan, setActionPlan] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const user = useMemo(() => getStoredUser(), []);
  const displayName = getDisplayName(user);

  const avatarUrl = useMemo(() => {
    return getFileUrl(user?.avatarUrl || user?.avatar_url);
  }, [user]);

  const activeNav = useMemo(() => {
    return (
      NAV_ITEMS.find((item) => item.path === location.pathname)?.id ||
      "dashboard"
    );
  }, [location.pathname]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [actionPlanResult, progressResult] = await Promise.allSettled([
          api.get("/action-plans/me"),
          api.get("/progress/me"),
        ]);

        if (actionPlanResult.status === "fulfilled") {
          setActionPlan(actionPlanResult.value.data.data);
        }

        if (progressResult.status === "fulfilled") {
          setProgressData(progressResult.value.data.data);
        }

        if (
          actionPlanResult.status === "rejected" &&
          progressResult.status === "rejected"
        ) {
          toast.error("Gagal mengambil data dashboard");
        }
      } catch (error) {
        console.log(error.response?.data || error.message);
        toast.error("Gagal mengambil data dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const steps = useMemo(() => {
    return actionPlan?.steps || [];
  }, [actionPlan]);

  const completedSteps = steps.filter(
    (step) => step.isCompleted || step.status === "selesai"
  ).length;

  const totalSteps = steps.length;

  const overallPct =
    totalSteps > 0
      ? Math.round((completedSteps / totalSteps) * 100)
      : progressData?.progressPercentage || 0;

  const totalXp = completedSteps * 120;
  const allCompleted = totalSteps > 0 && completedSteps === totalSteps;

  const activeTask = useMemo(() => {
    if (allCompleted) return null;

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
  }, [allCompleted, steps]);

  const handleNavigate = (item) => {
    routerNavigate(item.path);
  };

  const handleOpenLogoutModal = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    routerNavigate("/", { replace: true });
  };

  const handleContinueTask = () => {
    if (allCompleted) {
      toast.success("Semua task sudah selesai. Keren!");
      return;
    }

    if (!activeTask) {
      toast.error("Belum ada task aktif.");
      return;
    }

    localStorage.setItem("activeTask", JSON.stringify(activeTask));

    routerNavigate("/task-detail");
  };

  const renderAvatar = (size = "normal") => (
    <div className={`dashboard-avatar ${size === "small" ? "small" : ""}`}>
      {avatarUrl ? (
        <img src={avatarUrl} alt="Avatar" />
      ) : (
        displayName.charAt(0).toUpperCase()
      )}
    </div>
  );

  const stats = [
    {
      icon: "🏆",
      value: `${overallPct}%`,
      label: "Overall Progress",
    },
    {
      icon: "✓",
      value: `${completedSteps}/${totalSteps || 0}`,
      label: "Task Selesai",
    },
    {
      icon: "⚡",
      value: `${totalXp} XP`,
      label: "Total XP",
    },
  ];

  return (
    <div className="dashboard-page">
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">
          <span>⌘</span>
          <strong>Compana</strong>
        </div>

        <nav className="dashboard-side-nav">
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item)}
                className={`dashboard-nav-item ${isActive ? "active" : ""}`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="dashboard-sidebar-user">
          <div className="dashboard-user-mini">
            {renderAvatar()}

            <div>
              <p>{displayName}</p>
              <span>{user?.role || "user"}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenLogoutModal}
            className="dashboard-logout-button"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <div className="mesh-bg" />
        <StarField />

        <header className="dashboard-mobile-header">
          <div className="dashboard-brand compact">
            <span>⌘</span>
            <strong>Compana</strong>
          </div>

          <button
            type="button"
            onClick={handleOpenLogoutModal}
            className="dashboard-mobile-logout"
          >
            🚪
          </button>
        </header>

        <section className="dashboard-content">
          <div className="dashboard-hero">
            <div className="dashboard-hero-copy">
              <div className="dashboard-mobile-user">
                {renderAvatar("small")}
                <div>
                  <span>Selamat datang</span>
                  <strong>{displayName}</strong>
                </div>
              </div>

              <p className="dashboard-kicker">Dashboard Belajar</p>

              <h1>Hi, {displayName}</h1>

              <p>
                Lanjutkan perjalanan kariermu dari skill gap, action plan,
                sampai task aktif.
              </p>
            </div>

            <button
              type="button"
              onClick={handleContinueTask}
              disabled={allCompleted}
              className="dashboard-main-cta"
            >
              {allCompleted ? "Selesai Semua ✓" : "Lanjut Task →"}
            </button>
          </div>

          <div className="dashboard-stats-grid">
            {stats.map((stat) => (
              <article key={stat.label} className="dashboard-stat-card">
                <span className="dashboard-stat-icon">{stat.icon}</span>
                <p>{loading ? "..." : stat.value}</p>
                <span>{stat.label}</span>
              </article>
            ))}
          </div>

          <article className="dashboard-progress-card">
            <div className="dashboard-progress-head">
              <div>
                <p>🚀 Perjalanan Karier</p>
                <span>
                  {allCompleted
                    ? "Semua task selesai. Mantap!"
                    : totalSteps > 0
                    ? `${completedSteps} dari ${totalSteps} task sudah selesai.`
                    : "Mulai action plan untuk membuka task pertamamu."}
                </span>
              </div>

              <strong>{loading ? "..." : `${overallPct}%`}</strong>
            </div>

            <div className="dashboard-progress-track">
              <div
                className="dashboard-progress-fill"
                style={{ width: `${Math.min(100, Math.max(0, overallPct))}%` }}
              />
            </div>
          </article>

          <div className="dashboard-grid">
            <article className="dashboard-active-task-card">
              <div
                className={`dashboard-status-pill ${
                  allCompleted
                    ? "done"
                    : activeTask?.status === "revision"
                    ? "revision"
                    : ""
                }`}
              >
                <span>{allCompleted ? "✓" : "▷"}</span>
                <span>
                  {allCompleted
                    ? "Selesai Semua"
                    : activeTask?.status === "revision"
                    ? "Need Revision"
                    : "Progress Sekarang"}
                </span>
              </div>

              <h2>{activeTask?.title || "Semua task selesai 🎉"}</h2>

              <p>
                {activeTask?.description ||
                  "Kamu sudah menyelesaikan semua task di action plan ini. Mantap!"}
              </p>

              {activeTask && (
                <div className="dashboard-task-meta">
                  <span>Step {activeTask.order || "-"}</span>
                  <span>⏱ {activeTask.estimatedDays || "-"} hari</span>
                </div>
              )}

              <div className="dashboard-task-actions">
                <button
                  type="button"
                  onClick={handleContinueTask}
                  disabled={allCompleted}
                >
                  {allCompleted ? "Selesai Semua ✓" : "Lanjutkan →"}
                </button>

                <button
                  type="button"
                  onClick={() => routerNavigate("/action-plan")}
                >
                  Roadmap
                </button>
              </div>
            </article>

            <section className="dashboard-quick-actions">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.title}
                  type="button"
                  onClick={() => routerNavigate(action.path)}
                  className="dashboard-quick-card"
                >
                  <span>{action.icon}</span>

                  <div>
                    <p>{action.title}</p>
                    <small>{action.desc}</small>
                  </div>
                </button>
              ))}
            </section>
          </div>
        </section>

        <nav className="dashboard-bottom-nav">
          {NAV_ITEMS.slice(0, 5).map((item) => {
            const isActive = activeNav === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item)}
                className={isActive ? "active" : ""}
              >
                <span>{item.icon}</span>
                <small>{item.label}</small>
              </button>
            );
          })}
        </nav>
      </main>

      <LogoutConfirmModal
        open={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
      />

      <style>{`
        .dashboard-page {
          min-height: 100vh;
          min-height: 100svh;
          background: #0a1f12;
          display: flex;
          overflow-x: hidden;
          font-family: 'DM Sans', sans-serif;
          color: white;
        }

        .dashboard-sidebar {
          width: 220px;
          min-width: 220px;
          height: 100vh;
          position: sticky;
          top: 0;
          z-index: 5;
          display: flex;
          flex-direction: column;
          padding: 20px 12px;
          background: rgba(255,255,255,0.045);
          border-right: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(10px);
          box-sizing: border-box;
        }

        .dashboard-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 8px;
          margin-bottom: 28px;
          color: #3dba74;
        }

        .dashboard-brand span {
          font-size: 16px;
        }

        .dashboard-brand strong {
          font-family: 'Playfair Display', serif;
          font-weight: 800;
          font-size: 17px;
          text-decoration: underline;
          text-decoration-color: rgba(61,186,116,0.35);
          text-underline-offset: 3px;
        }

        .dashboard-brand.compact {
          margin: 0;
          padding: 0;
        }

        .dashboard-side-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .dashboard-nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 10px;
          border: none;
          border-left: 2px solid transparent;
          background: transparent;
          color: rgba(255,255,255,0.56);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          text-align: left;
          transition: all 0.18s;
        }

        .dashboard-nav-item:hover {
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.82);
        }

        .dashboard-nav-item.active {
          background: rgba(61,186,116,0.15);
          color: #3dba74;
          border-left-color: #3dba74;
        }

        .dashboard-sidebar-user {
          border-top: 1px solid rgba(255,255,255,0.08);
          padding-top: 16px;
        }

        .dashboard-user-mini {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          margin-bottom: 10px;
          min-width: 0;
        }

        .dashboard-user-mini p {
          font-size: 13px;
          font-weight: 800;
          color: rgba(255,255,255,0.86);
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 126px;
        }

        .dashboard-user-mini span {
          font-size: 11px;
          color: rgba(255,255,255,0.36);
          text-transform: capitalize;
        }

        .dashboard-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(61,186,116,0.2);
          border: 1.5px solid rgba(61,186,116,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 13px;
          color: #3dba74;
          flex-shrink: 0;
          overflow: hidden;
        }

        .dashboard-avatar.small {
          width: 34px;
          height: 34px;
          font-size: 12px;
        }

        .dashboard-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .dashboard-logout-button {
          width: 100%;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid rgba(224,90,90,0.25);
          background: rgba(224,90,90,0.08);
          color: #ff8a8a;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          text-align: left;
        }

        .dashboard-main {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        .dashboard-mobile-header {
          display: none;
        }

        .dashboard-content {
          position: relative;
          z-index: 1;
          padding: 28px clamp(20px, 4vw, 36px) 44px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .dashboard-hero {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
        }

        .dashboard-mobile-user {
          display: none;
        }

        .dashboard-kicker {
          color: rgba(126,240,170,0.7);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin: 0 0 8px;
        }

        .dashboard-hero h1 {
          font-family: 'Playfair Display', serif;
          font-weight: 800;
          font-size: clamp(27px, 3vw, 36px);
          color: #3dba74;
          margin: 0 0 6px;
          text-decoration: underline;
          text-decoration-color: rgba(61,186,116,0.3);
          text-underline-offset: 4px;
        }

        .dashboard-hero p:not(.dashboard-kicker) {
          font-size: 13px;
          color: rgba(255,255,255,0.5);
          margin: 0;
          line-height: 1.7;
          max-width: 560px;
        }

        .dashboard-main-cta {
          border: none;
          border-radius: 13px;
          background: #3dba74;
          color: white;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 900;
          cursor: pointer;
          padding: 12px 22px;
          white-space: nowrap;
          box-shadow: 0 14px 34px rgba(45,140,94,0.22);
        }

        .dashboard-main-cta:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .dashboard-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .dashboard-stat-card,
        .dashboard-progress-card,
        .dashboard-active-task-card,
        .dashboard-quick-card {
          background: rgba(255,255,255,0.94);
          border: 1px solid rgba(255,255,255,0.16);
          border-radius: 18px;
          color: #1a3a2a;
          box-shadow: 0 20px 70px rgba(0,0,0,0.14);
        }

        .dashboard-stat-card {
          padding: 17px 18px;
        }

        .dashboard-stat-icon {
          font-size: 21px;
        }

        .dashboard-stat-card p {
          font-family: 'Playfair Display', serif;
          font-weight: 800;
          font-size: 25px;
          color: #1a3a2a;
          margin: 8px 0 3px;
        }

        .dashboard-stat-card span:last-child {
          font-size: 12px;
          color: rgba(40,70,55,0.58);
        }

        .dashboard-progress-card {
          padding: 18px 20px;
        }

        .dashboard-progress-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 12px;
        }

        .dashboard-progress-head p {
          font-size: 14px;
          font-weight: 900;
          color: #1a3a2a;
          margin: 0 0 4px;
        }

        .dashboard-progress-head span {
          display: block;
          font-size: 12px;
          color: rgba(40,70,55,0.58);
          line-height: 1.55;
        }

        .dashboard-progress-head strong {
          font-family: 'Playfair Display', serif;
          font-weight: 800;
          font-size: 18px;
          color: #2d8c5e;
          white-space: nowrap;
        }

        .dashboard-progress-track {
          height: 9px;
          border-radius: 999px;
          background: rgba(45,140,94,0.12);
          overflow: hidden;
        }

        .dashboard-progress-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg,#2d8c5e,#3dba74);
          transition: width 0.5s ease;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.45fr) minmax(280px, 0.85fr);
          gap: 14px;
          align-items: start;
        }

        .dashboard-active-task-card {
          padding: clamp(20px, 3vw, 24px);
        }

        .dashboard-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 5px 12px;
          border-radius: 999px;
          background: rgba(61,186,116,0.1);
          border: 1px solid rgba(61,186,116,0.3);
          margin-bottom: 14px;
          color: #2d8c5e;
          font-size: 11px;
          font-weight: 900;
        }

        .dashboard-status-pill.revision {
          background: rgba(212,168,68,0.13);
          border-color: rgba(212,168,68,0.35);
          color: #b87a00;
        }

        .dashboard-status-pill.done {
          background: rgba(61,186,116,0.13);
          border-color: rgba(61,186,116,0.35);
          color: #2d8c5e;
        }

        .dashboard-active-task-card h2 {
          font-family: 'Playfair Display', serif;
          font-weight: 800;
          font-size: clamp(22px, 3vw, 28px);
          color: #1a3a2a;
          margin: 0 0 10px;
          text-decoration: underline;
          text-decoration-color: rgba(45,140,94,0.3);
          text-underline-offset: 3px;
        }

        .dashboard-active-task-card > p {
          font-size: 13px;
          color: rgba(40,70,55,0.68);
          margin: 0 0 16px;
          line-height: 1.75;
        }

        .dashboard-task-meta {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 17px;
        }

        .dashboard-task-meta span {
          font-size: 11px;
          color: rgba(40,70,55,0.68);
          background: rgba(45,140,94,0.1);
          border: 1px solid rgba(45,140,94,0.2);
          padding: 5px 10px;
          border-radius: 8px;
          font-weight: 800;
        }

        .dashboard-task-actions {
          display: flex;
          gap: 10px;
        }

        .dashboard-task-actions button {
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 900;
          cursor: pointer;
          min-height: 45px;
        }

        .dashboard-task-actions button:first-child {
          flex: 1;
          border: none;
          background: #2d8c5e;
          color: white;
        }

        .dashboard-task-actions button:first-child:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .dashboard-task-actions button:last-child {
          border: 1px solid rgba(45,140,94,0.3);
          background: transparent;
          color: #2d8c5e;
          padding: 0 18px;
        }

        .dashboard-quick-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .dashboard-quick-card {
          width: 100%;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          text-align: left;
          border: none;
          padding: 17px 18px;
          cursor: pointer;
        }

        .dashboard-quick-card > span {
          font-size: 20px;
          flex-shrink: 0;
        }

        .dashboard-quick-card p {
          font-size: 14px;
          font-weight: 900;
          color: #1a3a2a;
          margin: 0 0 6px;
        }

        .dashboard-quick-card small {
          display: block;
          font-size: 12px;
          color: rgba(40,70,55,0.58);
          line-height: 1.55;
        }

        .dashboard-bottom-nav {
          display: none;
        }

        @media (max-width: 1024px) {
          .dashboard-sidebar {
            display: none;
          }

          .dashboard-main {
            min-height: 100vh;
            min-height: 100svh;
          }

          .dashboard-mobile-header {
            position: sticky;
            top: 0;
            z-index: 5;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 14px;
            padding: 13px 18px;
            background: rgba(10,31,18,0.9);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid rgba(255,255,255,0.07);
          }

          .dashboard-mobile-logout {
            width: 38px;
            height: 38px;
            border-radius: 12px;
            border: 1px solid rgba(224,90,90,0.22);
            background: rgba(224,90,90,0.08);
            color: #ff8a8a;
            cursor: pointer;
          }

          .dashboard-content {
            padding: 22px 18px 96px;
          }

          .dashboard-stats-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-quick-actions {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .dashboard-bottom-nav {
            position: fixed;
            left: 12px;
            right: 12px;
            bottom: 12px;
            z-index: 8;
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 4px;
            padding: 8px;
            background: rgba(10,31,18,0.92);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 20px;
            backdrop-filter: blur(14px);
            box-shadow: 0 20px 70px rgba(0,0,0,0.38);
          }

          .dashboard-bottom-nav button {
            min-width: 0;
            border: none;
            border-radius: 14px;
            background: transparent;
            color: rgba(255,255,255,0.55);
            font-family: 'DM Sans', sans-serif;
            cursor: pointer;
            padding: 7px 4px;
          }

          .dashboard-bottom-nav button span {
            display: block;
            font-size: 17px;
            line-height: 1;
            margin-bottom: 4px;
          }

          .dashboard-bottom-nav button small {
            display: block;
            font-size: 10px;
            line-height: 1.15;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .dashboard-bottom-nav button.active {
            background: rgba(61,186,116,0.16);
            color: #3dba74;
          }
        }

        @media (max-width: 760px) {
          .dashboard-content {
            padding: 20px 14px 98px;
          }

          .dashboard-hero {
            flex-direction: column;
            gap: 14px;
          }

          .dashboard-mobile-user {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 14px;
          }

          .dashboard-mobile-user span {
            display: block;
            color: rgba(255,255,255,0.42);
            font-size: 11px;
            margin-bottom: 2px;
          }

          .dashboard-mobile-user strong {
            display: block;
            color: white;
            font-size: 13px;
            max-width: 220px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .dashboard-main-cta {
            width: 100%;
          }

          .dashboard-stats-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-stat-card {
            display: grid;
            grid-template-columns: auto 1fr;
            column-gap: 14px;
            align-items: center;
          }

          .dashboard-stat-icon {
            grid-row: span 2;
          }

          .dashboard-stat-card p {
            margin: 0;
          }

          .dashboard-progress-head {
            flex-direction: column;
            gap: 8px;
          }

          .dashboard-task-actions {
            flex-direction: column;
          }

          .dashboard-task-actions button:last-child {
            padding: 0;
          }

          .dashboard-quick-actions {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 430px) {
          .dashboard-content {
            padding-left: 12px;
            padding-right: 12px;
          }

          .dashboard-mobile-header {
            padding-left: 14px;
            padding-right: 14px;
          }

          .dashboard-brand.compact {
            transform: scale(0.92);
            transform-origin: left center;
          }

          .dashboard-hero h1 {
            font-size: 28px;
          }

          .dashboard-active-task-card,
          .dashboard-progress-card,
          .dashboard-stat-card,
          .dashboard-quick-card {
            border-radius: 16px;
          }

          .dashboard-bottom-nav {
            left: 8px;
            right: 8px;
            bottom: 8px;
          }

          .dashboard-bottom-nav button small {
            font-size: 9px;
          }
        }
      `}</style>
    </div>
  );
}
