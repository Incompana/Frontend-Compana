const ROLE_LABELS = {
  frontend_developer: "Frontend Developer",
  backend_developer: "Backend Developer",
  data_analyst: "Data Analyst",
  uiux_designer: "UI/UX Designer",
  cybersecurity: "Cybersecurity",
  frontend: "Frontend Developer",
  backend: "Backend Developer",
  uiux: "UI/UX Designer",
  unclear: "Belum Jelas",
};

const LEVEL_LABELS = {
  zero: "Pemula",
  basic: "Basic",
  beginner: "Beginner",
  intermediate: "Intermediate",
  unclear: "Belum Jelas",
};

const PROBLEM_LABELS = {
  beginner_lost: "Bingung Mulai",
  direction_confused: "Bingung Arah",
  skill_gap: "Skill Gap",
  overwhelmed: "Terlalu Banyak Pilihan",
  confidence_issue: "Kurang Percaya Diri",
  no_portfolio: "Belum Ada Portfolio",
  none: "Belum Ada Blocker Spesifik",
  unclear: "Belum Jelas",
};

const FALLBACK_TASK_IDS = {
  html_basic: "T1",
  css_basic: "T2",
  javascript_basic: "T3",
};

function titleize(value) {
  return String(value || "")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function readableText(value) {
  return String(value || "").replaceAll("_", " ");
}

function splitList(value) {
  return String(value || "")
    .split("|")
    .map((item) => readableText(item).trim())
    .filter(Boolean);
}

function outputItems(outputFormat) {
  const items = String(outputFormat || "")
    .split("/")
    .map((item) => readableText(item).trim())
    .filter(Boolean);

  if (!items.length) {
    return [{ icon: "📄", text: "Catatan belajar atau file hasil latihan" }];
  }

  return items.map((item) => ({
    icon: item.includes("screenshot") ? "📷" : item.includes("link") ? "🔗" : "📄",
    text: item,
  }));
}

function pctFromScore(score, fallback = 0) {
  const numeric = Number(score);
  if (!Number.isFinite(numeric)) return fallback;
  if (numeric <= 1) return Math.round(numeric * 100);
  return Math.round(numeric);
}

function pretextFromAnalysis(analysis) {
  return analysis?.validated_context?.validated_analysis
    || analysis?.input?.pretext_analysis
    || analysis?.pretext_analysis
    || {};
}

function skillProfileFromAnalysis(analysis) {
  return analysis?.skill_profile || {};
}

export function getPretextView(analysis) {
  const pretext = pretextFromAnalysis(analysis);
  const profile = skillProfileFromAnalysis(analysis);
  const confidence = pretext.confidence_score ?? pretext.confidence ?? profile.assessment_validation_score;

  return {
    raw: pretext,
    targetRole: ROLE_LABELS[pretext.target_role] || titleize(pretext.target_role) || "Belum Jelas",
    currentLevel: LEVEL_LABELS[profile.validated_level] || LEVEL_LABELS[pretext.current_level] || titleize(pretext.current_level) || "Belum Jelas",
    problemCategory: PROBLEM_LABELS[pretext.problem_category] || titleize(pretext.problem_category) || "Belum Jelas",
    blockerType: PROBLEM_LABELS[pretext.blocker_type] || titleize(pretext.blocker_type) || "Belum Ada Blocker Spesifik",
    personaType: titleize(pretext.persona_type) || "Learner",
    confidenceScore: pctFromScore(confidence, 0),
    confidenceLabel: pretext._meta?.ml_used ? "Dianalisis dengan model AI/ML aktif" : "Dianalisis dengan baseline rule-based",
  };
}

export function getSkillGapView(analysis) {
  const gap = analysis?.skill_gap || {};
  const summary = gap.skill_gap_summary || {};
  const profile = skillProfileFromAnalysis(analysis);
  const ownedFromProfile = Object.entries(profile.user_skill_profile || {})
    .filter(([, level]) => Number(level) > 0)
    .map(([skillId, level]) => ({
      skill_id: skillId,
      skill_name: titleize(skillId),
      progress: Math.min(100, Number(level) * 50),
    }));

  return {
    targetRole: ROLE_LABELS[gap.target_role] || titleize(gap.target_role) || getPretextView(analysis).targetRole,
    readinessScore: pctFromScore(gap.readiness_score, 0),
    missing: (gap.missing_skills || []).map((skill) => ({
      id: skill.skill_id || skill.skill || skill.skill_name,
      name: skill.skill_name || titleize(skill.skill_id || skill.skill),
      pct: pctFromScore(skill.progress, 0),
      priority: skill.priority || "medium",
      reason: skill.reason || skill.why_missing || "",
    })),
    weak: (gap.weak_skills || []).map((skill) => ({
      id: skill.skill_id || skill.skill || skill.skill_name,
      name: skill.skill_name || titleize(skill.skill_id || skill.skill),
      pct: pctFromScore(skill.progress, 35),
      priority: skill.priority || "medium",
      reason: skill.reason || "",
    })),
    owned: (gap.owned_skills || ownedFromProfile).map((skill) => ({
      id: skill.skill_id || skill.skill || skill.skill_name || skill,
      name: skill.skill_name || titleize(skill.skill_id || skill.skill || skill),
      pct: pctFromScore(skill.progress, 100),
    })),
    summary,
  };
}

function tasksFromGap(analysis) {
  const gap = getSkillGapView(analysis);
  return [...gap.missing, ...gap.weak].slice(0, 4).map((skill, index) => ({
    task_id: FALLBACK_TASK_IDS[skill.id] || `gap_${skill.id || index + 1}`,
    task_title: `Latihan ${skill.name}`,
    target_skill: skill.id || skill.name,
    difficulty: index === 0 ? "basic" : "practice",
    duration_estimate: index === 0 ? "Hari ini" : "2-3 hari",
    reason: skill.reason || `Skill ini menjadi prioritas untuk role ${gap.targetRole}.`,
    output_format: "Catatan belajar, screenshot, atau link hasil latihan",
  }));
}

export function getActionPlanView(analysis) {
  const aiTasks = analysis?.action_plan?.recommended_tasks || [];
  const tasks = aiTasks.length ? aiTasks : tasksFromGap(analysis);
  const pretext = getPretextView(analysis);

  return {
    targetRole: pretext.targetRole,
    tasks: tasks.map((task, index) => ({
      id: task.task_id || `task_${index + 1}`,
      title: task.task_title || task.title || titleize(task.target_skill) || `Langkah ${index + 1}`,
      desc: readableText(task.task_description || task.description || task.reason || "Kerjakan task ini sebagai bukti progres terdekat."),
      reason: readableText(task.reason || ""),
      tags: [task.target_skill, task.difficulty].filter(Boolean).map(titleize),
      duration: task.duration_estimate || "2-3 hari",
      xp: 60 + index * 20,
      status: index === 0 ? "berjalan" : "terkunci",
      cta: index === 0 ? "Mulai Hari Ini ->" : undefined,
      raw: task,
    })),
  };
}

export function getActiveTaskView(analysis, selectedTask) {
  const plan = getActionPlanView(analysis);
  const task = selectedTask || plan.tasks[0];

  if (!task) {
    return null;
  }

  const raw = task.raw || {};
  const explicitSteps = splitList(raw.task_steps);
  const checklist = splitList(raw.assessment_checklist);
  const references = splitList(raw.reference_keywords);
  const learningFocus = readableText(raw.learning_focus);

  return {
    breadcrumb: ["Action Plan", task.id],
    phase: "RECOMMENDED TASK",
    title: task.title,
    tags: task.tags?.length ? task.tags : ["Practice"],
    duration: task.duration || "2-3 hari",
    xp: task.xp || 80,
    currentStep: 1,
    totalSteps: Math.max(plan.tasks.length, 1),
    taskId: task.raw?.task_id || task.id,
    sections: {
      deskripsi: learningFocus ? `${task.desc} Fokus belajar: ${learningFocus}.` : task.desc,
      yangHarusDikerjakan: explicitSteps.length
        ? explicitSteps
        : [
            `Pelajari konsep inti ${task.tags?.[0] || task.title} dari satu referensi utama.`,
            `Buat contoh kecil yang memakai ${task.tags?.[0] || task.title} dan bisa dijalankan.`,
            "Lampirkan bukti hasil serta catatan bagian yang masih membingungkan.",
          ],
      expectedOutput: [
        ...outputItems(raw.output_format),
        { icon: "🔗", text: "Lampirkan link, file, screenshot, atau penjelasan proses" },
      ],
      assessmentChecklist: checklist.length
        ? checklist
        : [
            "Output bisa dibuka atau dicek reviewer.",
            "Proses pengerjaan dijelaskan singkat.",
            "Ada bukti hasil berupa link, file, atau screenshot.",
          ],
      referensiBelajar: [
        { icon: "🤖", text: "Minta feedback terarah dari Compana AI", isExternal: false },
        ...(references.length
          ? references.map((item) => ({ icon: "📘", text: item, isExternal: true }))
          : [{ icon: "📘", text: `Cari referensi resmi untuk ${task.tags?.[0] || task.title}`, isExternal: true }]),
      ],
    },
  };
}
