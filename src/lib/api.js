const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001"
).replace(/\/$/, "");

async function postJson(path, payload) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`API ${response.status}: ${body}`);
  }

  return response.json();
}

export function analyzePretext(userInputText) {
  return postJson("/api/ai/analyze-pretext", {
    user_input_text: userInputText,
  });
}

export function selectQuestions(pretextAnalysis, maxQuestions = 3) {
  return postJson("/api/ai/select-questions", {
    pretext_analysis: pretextAnalysis,
    max_questions: maxQuestions,
  });
}

export function submitAssessment({ userId, pretextAnalysis, questions, answers }) {
  return postJson("/api/ai/submit-assessment", {
    user_id: userId,
    pretext_analysis: pretextAnalysis,
    questions,
    answers,
  });
}

export function evaluateTask({ taskId, submissionText, submissionFiles }) {
  return postJson("/api/ai/evaluate-task", {
    task_id: taskId,
    submission_text: submissionText,
    submission_files: submissionFiles,
  });
}

export async function getEndToEndDemo() {
  const response = await fetch(`${API_BASE_URL}/api/ai/demo/end-to-end`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`API ${response.status}: ${body}`);
  }

  return response.json();
}
