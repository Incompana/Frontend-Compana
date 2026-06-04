// src/pages/AssessmentPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Logo, StarField } from "../components/Shared";
import { analyzePretext, selectQuestions, submitAssessment } from "../lib/api";

function parseOptions(options) {
  return String(options || "")
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function AssessmentPage({ userInputText, onBack, onNext }) {
  const [pretextAnalysis, setPretextAnalysis] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadAssessment() {
      setLoading(true);
      setError("");
      try {
        const pretext = await analyzePretext(userInputText);
        const questionResult = await selectQuestions(pretext, 3);
        if (cancelled) return;
        setPretextAnalysis(pretext);
        setQuestions(questionResult.questions || []);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (userInputText) loadAssessment();
    else {
      setLoading(false);
      setError("Input belum tersedia. Kembali dan isi ceritamu dulu.");
    }

    return () => {
      cancelled = true;
    };
  }, [userInputText]);

  const q = questions[currentQ];
  const answeredCount = Object.keys(answers).length;
  const progressPercent = questions.length
    ? Math.round((answeredCount / questions.length) * 100)
    : 0;

  const selected = q ? answers[q.question_id] : "";
  const options = useMemo(() => parseOptions(q?.options), [q]);
  const isSingleChoice = String(q?.answer_type || "").toLowerCase() === "single_choice";

  const handleSelect = (option) => {
    if (!q) return;
    setAnswers((prev) => ({ ...prev, [q.question_id]: option }));
  };

  const handleTextAnswer = (value) => {
    if (!q) return;
    setAnswers((prev) => ({ ...prev, [q.question_id]: value }));
  };

  const handleSubmit = async () => {
    if (!pretextAnalysis || questions.length === 0) return;
    setSubmitting(true);
    setError("");
    try {
      const result = await submitAssessment({
        userId: "guest-demo",
        pretextAnalysis,
        questions,
        answers: questions.map((question) => ({
          question_id: question.question_id,
          answer_value: answers[question.question_id] || "",
        })),
      });
      onNext(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) setCurrentQ((i) => i + 1);
    else handleSubmit();
  };

  const handlePrev = () => {
    if (currentQ > 0) setCurrentQ((i) => i - 1);
    else onBack();
  };

  const canContinue = Boolean(selected && String(selected).trim());

  return (
    <div style={{ minHeight: "100vh", background: "#0a1f12", color: "white", display: "flex", flexDirection: "column" }}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 40px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Logo />
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.45)" }}>
          Pertanyaan <span style={{ color: "white", fontWeight: 600 }}>{questions.length ? currentQ + 1 : 0}</span> dari <span style={{ color: "white", fontWeight: 600 }}>{questions.length}</span>
        </div>
        <button onClick={handleSubmit} className="ghost-btn" disabled={!pretextAnalysis || submitting}>Lewati →</button>
      </nav>

      <section style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px 24px", overflow: "hidden" }}>
        <div className="mesh-bg" />
        <StarField />

        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "600px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
              Langkah <span style={{ color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>2</span> dari 3
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>
              {progressPercent}%
            </div>
          </div>

          <div style={{ height: "3px", background: "rgba(255,255,255,0.08)", borderRadius: "2px", marginBottom: "24px" }}>
            <div style={{ width: `${progressPercent}%`, height: "100%", background: "linear-gradient(90deg, #2d8c5e, #3dba74)", borderRadius: "2px", transition: "width 0.4s ease" }} />
          </div>

          <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "28px", backdropFilter: "blur(8px)" }}>
            {loading && (
              <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.7)" }}>Menyiapkan assessment...</p>
            )}

            {!loading && error && (
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#ffb4a8", marginBottom: "16px" }}>{error}</p>
                <button onClick={onBack} className="cta-btn" style={{ animation: "none" }}>Kembali</button>
              </div>
            )}

            {!loading && !error && q && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>Pertanyaan {currentQ + 1}</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(100, 220, 150, 0.8)", background: "rgba(45,140,94,0.15)", border: "1px solid rgba(45,140,94,0.3)", borderRadius: "999px", padding: "3px 10px" }}>
                    {q.skill_label || q.skill_id?.replaceAll("_", " ") || q.domain_interest || "assessment"}
                  </span>
                </div>

                <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(18px, 3vw, 24px)", lineHeight: 1.3, marginBottom: "20px", textDecoration: "underline", textDecorationColor: "rgba(255,255,255,0.2)", textUnderlineOffset: "4px" }}>
                  {q.prompt || q.question || "Pertanyaan assessment"}
                </h2>

                {isSingleChoice && options.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                    {options.map((option) => {
                      const isSelected = selected === option;
                      return (
                        <button
                          key={option}
                          onClick={() => handleSelect(option)}
                          style={{
                            display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", borderRadius: "10px",
                            border: isSelected ? "1px solid rgba(45,140,94,0.5)" : "1px solid rgba(255,255,255,0.08)",
                            background: isSelected ? "rgba(45,140,94,0.15)" : "rgba(255,255,255,0.03)",
                            cursor: "pointer", textAlign: "left", width: "100%",
                          }}
                        >
                          <div style={{ width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0, border: isSelected ? "2px solid #3dba74" : "2px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {isSelected && <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#3dba74" }} />}
                          </div>
                          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: isSelected ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.65)", fontWeight: isSelected ? 500 : 400 }}>
                            {option.replaceAll("_", " ")}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <textarea
                    value={selected || ""}
                    onChange={(event) => handleTextAnswer(event.target.value)}
                    placeholder="Tulis jawabanmu di sini"
                    rows={5}
                    style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", padding: "14px", color: "white", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", resize: "vertical", marginBottom: "20px" }}
                  />
                )}

                <div style={{ height: "1px", background: "rgba(255,255,255,0.07)", marginBottom: "20px" }} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <button onClick={handlePrev} className="ghost-btn">← Sebelumnya</button>
                  <button onClick={handleNext} className="cta-btn" style={{ padding: "10px 24px", fontSize: "13px", animation: "none" }} disabled={!canContinue || submitting}>
                    {currentQ < questions.length - 1 ? "Selanjutnya →" : submitting ? "Menganalisis..." : "Lihat Hasil →"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
