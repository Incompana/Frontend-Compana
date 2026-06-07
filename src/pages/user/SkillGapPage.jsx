// src/pages/user/SkillGapPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo, StarField } from "../../components/Shared";
import api from "../../api/axios";
import toast from "react-hot-toast";

const parseLocalAssessmentResult = () => {
  try {
    const saved = localStorage.getItem("lastAssessmentResult");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const getSkillName = (skill) => {
  if (typeof skill === "string") return skill;

  return (
    skill?.skill_name ||
    skill?.name ||
    skill?.skillId ||
    skill?.skill_id ||
    "Skill"
  );
};

const getSkillProgress = (skill, fallback = 0) => {
  if (typeof skill === "string") return fallback;

  if (typeof skill?.progress === "number") return skill.progress;
  if (typeof skill?.score === "number") return skill.score;
  if (typeof skill?.level === "number") return skill.level * 50;

  return fallback;
};

const normalizeSkillItem = (skill, fallbackPct = 0) => ({
  name: getSkillName(skill),
  pct: getSkillProgress(skill, fallbackPct),
  priority: typeof skill === "object" ? skill?.priority : undefined,
  reason: typeof skill === "object" ? skill?.reason : undefined,
  evidence: typeof skill === "object" ? skill?.evidence || [] : [],
  nextTaskId: typeof skill === "object" ? skill?.next_task_id : undefined,
});

const normalizeSkillGapData = (apiData, localData) => {
  const source = apiData || localData || {};

  const ai =
    source.ai ||
    source.rawAi ||
    source.assessmentAi ||
    localData?.ai ||
    {};

  const aiSkillGap = ai.skill_gap || source.skill_gap || {};
  const aiAnalysis =
    ai.validated_context?.validated_analysis ||
    source.analysis ||
    {};

  const targetRole =
    source.targetRole ||
    source.target_role ||
    source.analysis?.role ||
    aiAnalysis.target_role ||
    aiSkillGap.target_role ||
    "Belum ditentukan";

  const confidenceScore =
    source.confidenceScore ||
    source.confidence_score ||
    source.analysis?.confidence ||
    aiAnalysis.confidence_score ||
    0;

  const missingRaw =
    aiSkillGap.missing_skills ||
    source.missingSkills ||
    source.missing_skills ||
    source.skillGap ||
    source.skill_gap ||
    localData?.skillGap ||
    [];

  const weakRaw =
    aiSkillGap.weak_skills ||
    source.weakSkills ||
    source.weak_skills ||
    [];

  const ownedRaw =
    aiSkillGap.owned_skills ||
    source.ownedSkills ||
    source.owned_skills ||
    [];

  const missingSkills = Array.isArray(missingRaw)
    ? missingRaw.map((skill) => normalizeSkillItem(skill, 0))
    : [];

  const weakSkills = Array.isArray(weakRaw)
    ? weakRaw.map((skill) => normalizeSkillItem(skill, 50))
    : [];

  const ownedSkills = Array.isArray(ownedRaw)
    ? ownedRaw.map((skill) => normalizeSkillItem(skill, 100))
    : [];

  return {
    targetRole,
    confidenceScore,
    problemCategory:
      aiSkillGap.problem_category ||
      source.problemCategory ||
      source.problem_category ||
      source.analysis?.problemCategory ||
      "Skill Gap",
    blockerType:
      aiSkillGap.blocker_type ||
      source.analysis?.blockerType ||
      null,
    readinessScore:
      aiSkillGap.readiness_score ??
      source.readinessScore ??
      0,
    priorityGap:
      aiSkillGap.priority_gap ||
      source.priorityGap ||
      null,
    summary:
      source.analysis?.summary ||
      aiAnalysis.summary ||
      "",
    missingSkills,
    weakSkills,
    ownedSkills,
    raw: source,
  };
};

const clampPercent = (value) => Math.min(Math.max(Number(value) || 0, 0), 100);

const ProgressBar = ({ pct, color }) => (
  <div className="skill-progress-track">
    <div
      className="skill-progress-fill"
      style={{
        width: `${clampPercent(pct)}%`,
        background: color,
      }}
    />
  </div>
);

const SkillItem = ({ skill, color, emptyColor = "rgba(255,255,255,0.42)" }) => (
  <div className="skill-item">
    <div className="skill-item-top">
      <span>{skill.name}</span>
      <strong style={{ color }}>{clampPercent(skill.pct)}%</strong>
    </div>

    <ProgressBar pct={skill.pct} color={color} />

    {(skill.priority || skill.nextTaskId) && (
      <div className="skill-mini-tags">
        {skill.priority && (
          <span style={{ color }}>
            {skill.priority}
          </span>
        )}

        {skill.nextTaskId && <span>Next: {skill.nextTaskId}</span>}
      </div>
    )}

    {skill.reason && (
      <p className="skill-reason" style={{ color: emptyColor }}>
        {skill.reason}
      </p>
    )}
  </div>
);

const EmptyState = ({ children }) => (
  <p className="skill-empty">{children}</p>
);

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

        const localResult = parseLocalAssessmentResult();

        if (localResult) {
          setSkillGapData(localResult);
          toast("Menampilkan skill gap dari hasil assessment terakhir.");
        } else {
          toast.error(
            error.response?.data?.message ||
              "Gagal mengambil data skill gap"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSkillGap();
  }, []);

  const localAssessmentResult = useMemo(() => {
    return parseLocalAssessmentResult();
  }, []);

  const normalized = useMemo(() => {
    return normalizeSkillGapData(skillGapData, localAssessmentResult);
  }, [skillGapData, localAssessmentResult]);

  const {
    targetRole,
    confidenceScore,
    problemCategory,
    blockerType,
    readinessScore,
    priorityGap,
    summary,
    missingSkills,
    weakSkills,
    ownedSkills,
  } = normalized;

  const totalGap = missingSkills.length + weakSkills.length;
  const readiness = clampPercent(readinessScore);
  const confidence = clampPercent(confidenceScore);

  const handleCreateLearningPath = () => {
    navigate("/action-plan");
  };

  const handleBack = () => {
    navigate("/dashboardUser");
  };

  if (loading) {
    return (
      <div className="skill-loading">
        <div className="skill-loader-card">
          <div className="skill-loader-icon">🔍</div>
          <p>Memuat skill gap...</p>
        </div>

        <style>{`
          .skill-loading {
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

          .skill-loader-card {
            text-align: center;
            background: rgba(255,255,255,0.06);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 20px;
            padding: 26px 28px;
          }

          .skill-loader-icon {
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

          .skill-loader-card p {
            margin: 0;
            color: rgba(255,255,255,0.72);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="skill-page">
      <nav className="skill-navbar">
        <div className="skill-logo-wrap">
          <Logo />
        </div>

        <div className="skill-nav-pill">Skill Gap Analysis</div>

        <button type="button" onClick={handleBack} className="skill-nav-back">
          Kembali
        </button>
      </nav>

      <main className="skill-main">
        <div className="mesh-bg" />
        <StarField />

        <section className="skill-content">
          <header className="skill-hero">
            <div className="skill-hero-badge">
              <span />
              AI Gap Mapping
            </div>

            <div className="skill-hero-icon">🔍</div>

            <h1>
              Skill Gap <span>Kamu</span>
            </h1>

            <p>
              Ini adalah peta kemampuan yang perlu kamu perkuat untuk menuju{" "}
              <strong>{targetRole}</strong>.
            </p>
          </header>

          <section className="skill-overview-card">
            <div className="skill-overview-copy">
              <p className="skill-small-label">Target Role</p>
              <h2>{targetRole}</h2>

              <div className="skill-pill-row">
                <span>Confidence {confidence}%</span>
                <span>Readiness {readiness}%</span>
                <span>{problemCategory}</span>
              </div>
            </div>

            <div className="skill-score-grid">
              <div className="skill-score-card danger">
                <span>✕</span>
                <p>{missingSkills.length}</p>
                <small>Missing</small>
              </div>

              <div className="skill-score-card warning">
                <span>=</span>
                <p>{weakSkills.length}</p>
                <small>Weak</small>
              </div>

              <div className="skill-score-card success">
                <span>✓</span>
                <p>{ownedSkills.length}</p>
                <small>Owned</small>
              </div>
            </div>
          </section>

          <article className="skill-summary-card">
            <div className="skill-card-heading">
              <span>🧠</span>
              <div>
                <p className="skill-small-label">Ringkasan AI</p>
                <h3>{totalGap > 0 ? `${totalGap} gap ditemukan` : "Belum ada gap utama"}</h3>
              </div>
            </div>

            <div className="skill-summary-tags">
              <span>Problem: {problemCategory}</span>
              {blockerType && <span>Blocker: {blockerType}</span>}
              {priorityGap && <span>Prioritas: {priorityGap}</span>}
            </div>

            {summary ? (
              <p>{summary}</p>
            ) : (
              <p>
                AI akan memperbarui ringkasan ini setelah data assessment dan
                task kamu semakin lengkap.
              </p>
            )}
          </article>

          <div className="skill-grid">
            <article className="skill-section-card danger">
              <div className="skill-section-head">
                <span>✕</span>
                <div>
                  <p className="skill-small-label">Missing Skills</p>
                  <h3>Skill yang perlu kamu mulai</h3>
                </div>
              </div>

              {missingSkills.length > 0 ? (
                <div className="skill-list">
                  {missingSkills.map((skill) => (
                    <SkillItem
                      key={skill.name}
                      skill={skill}
                      color="#e05a5a"
                    />
                  ))}
                </div>
              ) : (
                <EmptyState>Tidak ada missing skill dari hasil AI.</EmptyState>
              )}
            </article>

            <article className="skill-section-card warning">
              <div className="skill-section-head">
                <span>=</span>
                <div>
                  <p className="skill-small-label">Weak Skills</p>
                  <h3>Skill yang perlu diperkuat</h3>
                </div>
              </div>

              {weakSkills.length > 0 ? (
                <div className="skill-list">
                  {weakSkills.map((skill) => (
                    <SkillItem
                      key={skill.name}
                      skill={skill}
                      color="#d4a844"
                    />
                  ))}
                </div>
              ) : (
                <EmptyState>
                  Belum ada weak skill dari hasil AI. Untuk assessment awal, AI
                  biasanya menandai skill sebagai missing sampai task pertama
                  berhasil divalidasi.
                </EmptyState>
              )}
            </article>
          </div>

          <article className="skill-section-card success owned-card">
            <div className="skill-section-head">
              <span>✓</span>
              <div>
                <p className="skill-small-label">Owned Skills</p>
                <h3>Skill yang sudah tervalidasi</h3>
              </div>
            </div>

            {ownedSkills.length > 0 ? (
              <div className="owned-list">
                {ownedSkills.map((skill) => (
                  <span key={skill.name}>✓ {skill.name}</span>
                ))}
              </div>
            ) : (
              <EmptyState>
                Belum ada owned skill yang tervalidasi. Skill akan masuk ke
                bagian ini setelah task dinilai passed oleh AI.
              </EmptyState>
            )}
          </article>

          <div className="skill-cta-card">
            <div>
              <h3>Siap lanjut ke learning path?</h3>
              <p>
                Setelah tahu gap-mu, lanjutkan ke action plan agar task belajarmu
                tersusun lebih jelas.
              </p>
            </div>

            <button type="button" onClick={handleCreateLearningPath}>
              Buka Learning Path →
            </button>
          </div>
        </section>
      </main>

      <style>{`
        .skill-page {
          min-height: 100vh;
          min-height: 100svh;
          background: #0a1f12;
          color: white;
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
        }

        .skill-navbar {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
          align-items: center;
          gap: 14px;
          padding: 14px clamp(18px, 4vw, 40px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          position: relative;
          z-index: 3;
        }

        .skill-logo-wrap {
          min-width: 0;
          overflow: hidden;
        }

        .skill-nav-pill {
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

        .skill-nav-back {
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

        .skill-nav-back:hover {
          color: white;
        }

        .skill-main {
          flex: 1;
          position: relative;
          display: flex;
          justify-content: center;
          padding: clamp(24px, 5vh, 42px) clamp(14px, 4vw, 24px) 54px;
          overflow: hidden;
        }

        .skill-content {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 980px;
          animation: skillSlideUp 0.55s ease both;
        }

        .skill-hero {
          text-align: center;
          max-width: 720px;
          margin: 0 auto 22px;
        }

        .skill-hero-badge {
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

        .skill-hero-badge span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #3dba74;
          box-shadow: 0 0 9px rgba(61,186,116,0.7);
        }

        .skill-hero-icon {
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

        .skill-hero h1 {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: clamp(32px, 5vw, 46px);
          line-height: 1.08;
          margin: 0 0 12px;
          letter-spacing: -0.5px;
        }

        .skill-hero h1 span {
          color: #3dba74;
          text-decoration: underline;
          text-decoration-color: rgba(61,186,116,0.38);
          text-underline-offset: 6px;
        }

        .skill-hero p {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(13px, 2vw, 15px);
          color: rgba(255,255,255,0.58);
          line-height: 1.75;
          margin: 0 auto;
          max-width: 640px;
        }

        .skill-hero p strong {
          color: #3dba74;
        }

        .skill-overview-card,
        .skill-summary-card,
        .skill-section-card,
        .skill-cta-card {
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.06);
          border-radius: 24px;
          backdrop-filter: blur(10px);
          box-shadow: 0 22px 76px rgba(0,0,0,0.18);
        }

        .skill-overview-card {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(280px, 0.85fr);
          gap: 18px;
          padding: clamp(20px, 4vw, 28px);
          margin-bottom: 14px;
          background:
            radial-gradient(circle at top left, rgba(61,186,116,0.16), transparent 34%),
            rgba(255,255,255,0.065);
        }

        .skill-small-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.09em;
          color: rgba(126,240,170,0.72);
          font-weight: 900;
          margin: 0 0 8px;
        }

        .skill-overview-copy h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 5vw, 42px);
          line-height: 1.1;
          margin: 0;
          color: white;
        }

        .skill-pill-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 16px;
        }

        .skill-pill-row span,
        .skill-summary-tags span {
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(61,186,116,0.13);
          border: 1px solid rgba(61,186,116,0.22);
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          color: rgba(255,255,255,0.84);
          font-weight: 800;
        }

        .skill-score-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }

        .skill-score-card {
          min-width: 0;
          border-radius: 18px;
          padding: 15px;
          background: rgba(255,255,255,0.055);
          border: 1px solid rgba(255,255,255,0.09);
          text-align: center;
        }

        .skill-score-card > span {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 900;
          margin-bottom: 8px;
        }

        .skill-score-card.danger > span {
          background: #e05a5a;
        }

        .skill-score-card.warning > span {
          background: #d4a844;
        }

        .skill-score-card.success > span {
          background: #3dba74;
        }

        .skill-score-card p {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 900;
          margin: 0;
          color: white;
        }

        .skill-score-card small {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 900;
        }

        .skill-summary-card,
        .skill-section-card {
          padding: clamp(18px, 3vw, 22px);
        }

        .skill-summary-card {
          margin-bottom: 14px;
        }

        .skill-card-heading,
        .skill-section-head {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 14px;
        }

        .skill-card-heading > span,
        .skill-section-head > span {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(61,186,116,0.12);
          border: 1px solid rgba(61,186,116,0.18);
          font-size: 20px;
          flex-shrink: 0;
        }

        .skill-section-card.danger .skill-section-head > span {
          background: rgba(224,90,90,0.12);
          border-color: rgba(224,90,90,0.2);
          color: #e05a5a;
        }

        .skill-section-card.warning .skill-section-head > span {
          background: rgba(212,168,68,0.12);
          border-color: rgba(212,168,68,0.22);
          color: #d4a844;
        }

        .skill-section-card.success .skill-section-head > span {
          background: rgba(61,186,116,0.12);
          border-color: rgba(61,186,116,0.2);
          color: #3dba74;
        }

        .skill-card-heading h3,
        .skill-section-head h3,
        .skill-cta-card h3 {
          margin: 0;
          font-family: 'DM Sans', sans-serif;
          font-size: 18px;
          line-height: 1.35;
          color: white;
        }

        .skill-summary-card > p,
        .skill-empty,
        .skill-cta-card p {
          font-family: 'DM Sans', sans-serif;
          margin: 0;
          color: rgba(255,255,255,0.62);
          font-size: 13px;
          line-height: 1.75;
        }

        .skill-summary-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 0 0 12px;
        }

        .skill-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 14px;
        }

        .skill-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .skill-item {
          border-radius: 16px;
          background: rgba(255,255,255,0.045);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 14px;
        }

        .skill-item-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          margin-bottom: 8px;
        }

        .skill-item-top span {
          color: rgba(255,255,255,0.84);
          line-height: 1.45;
        }

        .skill-item-top strong {
          flex-shrink: 0;
        }

        .skill-progress-track {
          height: 5px;
          border-radius: 999px;
          background: rgba(255,255,255,0.08);
          overflow: hidden;
        }

        .skill-progress-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 0.8s ease;
        }

        .skill-mini-tags {
          display: flex;
          gap: 7px;
          flex-wrap: wrap;
          margin-top: 9px;
        }

        .skill-mini-tags span {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          color: rgba(255,255,255,0.58);
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          padding: 4px 8px;
          border-radius: 999px;
          font-weight: 800;
        }

        .skill-reason {
          margin: 9px 0 0;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          line-height: 1.55;
        }

        .owned-card {
          margin-bottom: 14px;
        }

        .owned-list {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
        }

        .owned-list span {
          padding: 9px 12px;
          border-radius: 999px;
          background: rgba(61,186,116,0.14);
          border: 1px solid rgba(61,186,116,0.26);
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          color: rgba(255,255,255,0.86);
          font-weight: 800;
        }

        .skill-cta-card {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: center;
          gap: 16px;
          padding: 18px;
          background:
            linear-gradient(135deg, rgba(45,140,94,0.24), rgba(61,186,116,0.08)),
            rgba(255,255,255,0.06);
        }

        .skill-cta-card p {
          margin-top: 6px;
        }

        .skill-cta-card button {
          border: none;
          border-radius: 16px;
          background: #3dba74;
          color: white;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 900;
          cursor: pointer;
          padding: 14px 20px;
          min-height: 48px;
          box-shadow: 0 14px 34px rgba(45,140,94,0.28);
          white-space: nowrap;
          transition: transform 0.2s, background 0.2s;
        }

        .skill-cta-card button:hover {
          background: #45c77f;
          transform: translateY(-1px);
        }

        @keyframes skillSlideUp {
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
          .skill-overview-card,
          .skill-grid,
          .skill-cta-card {
            grid-template-columns: 1fr;
          }

          .skill-cta-card button {
            width: 100%;
          }
        }

        @media (max-width: 560px) {
          .skill-navbar {
            grid-template-columns: 1fr auto;
            padding: 12px 16px;
          }

          .skill-logo-wrap {
            transform: scale(0.92);
            transform-origin: left center;
          }

          .skill-nav-pill {
            display: none;
          }

          .skill-nav-back {
            font-size: 12px;
          }

          .skill-main {
            padding: 24px 12px 38px;
            overflow-y: auto;
          }

          .skill-hero {
            margin-bottom: 18px;
          }

          .skill-hero-badge {
            font-size: 11px;
            padding: 7px 13px;
            margin-bottom: 14px;
          }

          .skill-hero-icon {
            width: 56px;
            height: 56px;
            border-radius: 18px;
            font-size: 25px;
          }

          .skill-hero h1 {
            font-size: 34px;
          }

          .skill-hero p {
            font-size: 13px;
          }

          .skill-overview-card,
          .skill-summary-card,
          .skill-section-card,
          .skill-cta-card {
            border-radius: 20px;
          }

          .skill-score-grid {
            grid-template-columns: 1fr;
          }

          .skill-score-card {
            display: grid;
            grid-template-columns: auto 1fr auto;
            align-items: center;
            text-align: left;
            gap: 12px;
          }

          .skill-score-card > span {
            margin: 0;
          }

          .skill-score-card p {
            font-size: 24px;
          }

          .skill-card-heading > span,
          .skill-section-head > span {
            width: 38px;
            height: 38px;
            border-radius: 13px;
            font-size: 18px;
          }

          .skill-card-heading h3,
          .skill-section-head h3,
          .skill-cta-card h3 {
            font-size: 16px;
          }

          .skill-pill-row span,
          .skill-summary-tags span {
            font-size: 11px;
          }
        }

        @media (max-width: 360px) {
          .skill-hero h1 {
            font-size: 31px;
          }

          .skill-overview-copy h2 {
            font-size: 28px;
          }
        }
      `}</style>
    </div>
  );
}
