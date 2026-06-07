// src/pages/user/TaskDetailPage.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo, StarField } from "../../components/Shared";
import api from "../../api/axios";
import toast from "react-hot-toast";

const getMainSkillFromTitle = (title = "") => {
  return title.replace("Pelajari", "").trim().split(" ")[0] || "Skill";
};

const getFileSizeText = (size) => {
  if (!size) return "";

  const kb = size / 1024;
  const mb = kb / 1024;

  if (mb >= 1) {
    return `${mb.toFixed(2)} MB`;
  }

  return `${Math.round(kb)} KB`;
};

const buildTaskData = (step, totalSteps) => {
  const skill = getMainSkillFromTitle(step?.title);

  return {
    breadcrumb: ["Action Plan", `Langkah ${step?.order || 1}`],
    phase: "ROADMAP PERSONAL",
    title: step?.title || "Task Belajar",
    tags: [skill, "Practice"],
    duration: `${step?.estimatedDays || 3} hari`,
    xp: 80 + (step?.order || 1) * 20,
    currentStep: step?.order || 1,
    totalSteps: totalSteps || 1,
    sections: {
      deskripsi:
        step?.description ||
        "Pelajari skill ini sebagai bagian dari roadmap personalmu.",
      yangHarusDikerjakan: [
        `Pelajari konsep dasar ${skill} dari dokumentasi atau referensi terpercaya.`,
        `Buat latihan kecil atau mini project sederhana menggunakan ${skill}.`,
        "Upload bukti pengerjaan. Untuk project, upload ZIP source code tanpa node_modules.",
        "Catatan tambahan boleh diisi untuk menjelaskan isi file, kendala, atau hasil pengerjaan.",
      ],
      expectedOutput: [
        {
          icon: "🗂️",
          text: "ZIP project/source code untuk bukti paling kuat.",
        },
        {
          icon: "📄",
          text: "PDF/TXT untuk laporan atau catatan pengerjaan.",
        },
        {
          icon: "🖼️",
          text: "Screenshot/gambar untuk bukti visual hasil latihan.",
        },
      ],
      referensiBelajar: [
        {
          icon: "🤖",
          text: "Tanya Compana AI untuk penjelasan yang lebih mudah.",
          isExternal: false,
        },
        {
          icon: "📘",
          text: `Cari dokumentasi resmi atau tutorial dasar ${skill}.`,
          isExternal: true,
        },
        {
          icon: "▶️",
          text: `Cari video pembelajaran ${skill} untuk pemula.`,
          isExternal: true,
        },
      ],
    },
  };
};

const SectionLabel = ({ children, color = "#3dba74" }) => (
  <div className="task-section-label">
    <span style={{ background: color }} />
    <strong>{children}</strong>
  </div>
);

export default function TaskDetailPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [actionPlan, setActionPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState(null);

  useEffect(() => {
    const fetchActionPlan = async () => {
      try {
        const res = await api.get("/action-plans/me");
        setActionPlan(res.data.data);
      } catch (error) {
        console.log(error.response?.data || error.message);

        toast.error(
          error.response?.data?.message || "Gagal mengambil detail task"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchActionPlan();
  }, []);

  const steps = useMemo(() => {
    return actionPlan?.steps || [];
  }, [actionPlan]);

  const activeStep = useMemo(() => {
    const savedActiveTask = localStorage.getItem("activeTask");

    if (savedActiveTask) {
      try {
        return JSON.parse(savedActiveTask);
      } catch {
        localStorage.removeItem("activeTask");
      }
    }

    return (
      steps.find(
        (step) =>
          step.status === "revision" ||
          step.status === "berjalan" ||
          (!step.isCompleted && !step.isLocked)
      ) ||
      steps.find((step) => !step.isCompleted) ||
      steps[0] ||
      null
    );
  }, [steps]);

  const data = useMemo(() => {
    return buildTaskData(activeStep, steps.length);
  }, [activeStep, steps.length]);

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
      "text/plain",
      "application/zip",
      "application/x-zip-compressed",
    ];

    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".pdf", ".txt", ".zip"];

    const lowerName = selectedFile.name.toLowerCase();

    const isAllowedByType = allowedTypes.includes(selectedFile.type);
    const isAllowedByExtension = allowedExtensions.some((ext) =>
      lowerName.endsWith(ext)
    );

    if (!isAllowedByType && !isAllowedByExtension) {
      toast.error("File harus berupa gambar, PDF, TXT, atau ZIP");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 10MB");
      return;
    }

    setFile(selectedFile);
  };

  const handleFileDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const selectedFile =
      event.dataTransfer?.files?.[0] || event.target?.files?.[0];

    validateAndSetFile(selectedFile);
  };

  const handleBack = () => {
    navigate("/action-plan");
  };

  const handleSubmit = async () => {
    if (!file && !notes.trim()) {
      toast.error("Tambahkan file atau catatan terlebih dahulu.");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();

      formData.append("taskTitle", data.title);
      formData.append("taskDescription", data.sections.deskripsi);
      formData.append("targetRole", actionPlan?.targetRole || "");
      formData.append("content", notes.trim());

      if (file) {
        formData.append("file", file);
      }

      const res = await api.post("/submissions/submit", formData);
      const result = res.data.data;
      const submittedStatus = result?.submission?.status;

      localStorage.setItem("lastSubmissionResult", JSON.stringify(result));
      localStorage.removeItem("activeTask");

      setSubmittedResult(result);

      setActionPlan((prev) => {
        if (!prev?.steps) return prev;

        return {
          ...prev,
          steps: prev.steps.map((step) => {
            const isSubmittedStep =
              step.taskId === activeStep?.taskId ||
              step.id === activeStep?.id ||
              step.title === activeStep?.title;

            if (!isSubmittedStep) return step;

            return {
              ...step,
              isCompleted: submittedStatus === "passed",
              status:
                submittedStatus === "passed"
                  ? "selesai"
                  : submittedStatus === "revision"
                  ? "revision"
                  : step.status,
              isLocked: false,
            };
          }),
        };
      });

      setFile(null);
      setNotes("");

      toast.success(
        submittedStatus === "passed"
          ? "Task selesai dan berhasil dinilai AI."
          : "Task berhasil disubmit. Silakan cek feedback revisi."
      );
    } catch (error) {
      console.log(error.response?.data || error.message);

      toast.error(error.response?.data?.message || "Gagal submit task");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="task-loading">
        <div className="task-loading-card">
          <div>📋</div>
          <p>Memuat detail task...</p>
        </div>

        <style>{`
          .task-loading {
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

          .task-loading-card {
            text-align: center;
            background: rgba(255,255,255,0.06);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 20px;
            padding: 26px 28px;
          }

          .task-loading-card div {
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

          .task-loading-card p {
            margin: 0;
            color: rgba(255,255,255,0.72);
          }
        `}</style>
      </div>
    );
  }

  if (!activeStep) {
    return (
      <div className="task-empty-page">
        <div className="task-empty-card">
          <div>📋</div>
          <h1>Belum ada task aktif</h1>
          <p>Buka action plan untuk memilih langkah yang ingin kamu kerjakan.</p>
          <button type="button" onClick={() => navigate("/action-plan")}>
            Kembali ke Action Plan
          </button>
        </div>

        <style>{`
          .task-empty-page {
            min-height: 100vh;
            min-height: 100svh;
            background: #0a1f12;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            font-family: 'DM Sans', sans-serif;
          }

          .task-empty-card {
            max-width: 460px;
            width: 100%;
            text-align: center;
            background: rgba(255,255,255,0.06);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 22px;
            padding: 28px;
          }

          .task-empty-card div {
            font-size: 34px;
            margin-bottom: 12px;
          }

          .task-empty-card h1 {
            font-family: 'Playfair Display', serif;
            margin: 0 0 10px;
          }

          .task-empty-card p {
            color: rgba(255,255,255,0.58);
            line-height: 1.7;
            margin: 0 0 18px;
          }

          .task-empty-card button {
            border: none;
            background: #3dba74;
            color: white;
            border-radius: 13px;
            padding: 12px 18px;
            font-weight: 900;
            cursor: pointer;
          }
        `}</style>
      </div>
    );
  }

  if (submittedResult) {
    const submissionStatus = submittedResult?.submission?.status;
    const feedbackScore = submittedResult?.feedback?.score ?? 0;
    const isPassed = submissionStatus === "passed";

    return (
      <div className="task-page">
        <nav className="task-navbar">
          <div className="task-logo-wrap">
            <Logo />
          </div>

          <div className="task-nav-pill">
            {isPassed ? "Task Passed" : "Task Submitted"}
          </div>

          <button type="button" onClick={() => navigate("/action-plan")} className="task-nav-back">
            Action Plan
          </button>
        </nav>

        <main className="task-main center">
          <div className="mesh-bg" />
          <StarField />

          <section className={`task-result-card ${isPassed ? "passed" : "revision"}`}>
            <div className="task-result-icon">{isPassed ? "✅" : "📝"}</div>

            <h1>{isPassed ? "Task Selesai Disubmit" : "Task Berhasil Disubmit"}</h1>

            <p>
              {isPassed
                ? "Submission kamu sudah dinilai passed. Status task akan berubah menjadi selesai di Action Plan, Dashboard, dan Profil."
                : "Submission kamu sudah diterima, tetapi masih butuh revisi. Buka Feedback untuk melihat bagian yang perlu diperbaiki."}
            </p>

            <div className="task-result-stats">
              <div>
                <span>Status</span>
                <strong>{submissionStatus}</strong>
              </div>

              <div>
                <span>Score</span>
                <strong>{feedbackScore}</strong>
              </div>
            </div>

            <div className="task-result-actions">
              <button type="button" onClick={() => navigate("/feedback")}>
                Lihat Feedback
              </button>

              <button type="button" onClick={() => navigate("/action-plan")}>
                Buka Action Plan
              </button>
            </div>
          </section>
        </main>

        <TaskStyle />
      </div>
    );
  }

  return (
    <div className="task-page">
      <nav className="task-navbar">
        <div className="task-logo-wrap">
          <Logo />
        </div>

        <div className="task-nav-pill">
          Langkah {data.currentStep} dari {data.totalSteps}
        </div>

        <button type="button" onClick={handleBack} className="task-nav-back">
          Action Plan
        </button>
      </nav>

      <main className="task-main">
        <div className="mesh-bg" />
        <StarField />

        <section className="task-content">
          <div className="task-breadcrumb">
            {data.breadcrumb.map((crumb, index) => (
              <span key={crumb}>
                {index > 0 && <small>→</small>}
                <button
                  type="button"
                  onClick={() => index < data.breadcrumb.length - 1 && handleBack()}
                  disabled={index === data.breadcrumb.length - 1}
                >
                  {crumb}
                </button>
              </span>
            ))}
          </div>

          <header className="task-hero-card">
            <div className="task-phase">{data.phase}</div>

            <div className="task-title-row">
              <div className="task-title-icon">📝</div>

              <div>
                <h1>{data.title}</h1>
                <p>Durasi estimasi: {data.duration}</p>
              </div>
            </div>

            <div className="task-tags">
              {data.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
              <span className="xp">+{data.xp} XP</span>
            </div>
          </header>

          <div className="task-grid">
            <div className="task-left">
              <article className="task-card">
                <SectionLabel>Deskripsi</SectionLabel>
                <p className="task-paragraph">{data.sections.deskripsi}</p>
              </article>

              <article className="task-card">
                <SectionLabel>Yang Harus Dikerjakan</SectionLabel>

                <div className="task-check-list">
                  {data.sections.yangHarusDikerjakan.map((item, index) => (
                    <div key={index}>
                      <span>{index + 1}</span>
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="task-card">
                <SectionLabel>Expected Output</SectionLabel>

                <div className="task-output-list">
                  {data.sections.expectedOutput.map((item, index) => (
                    <div key={index}>
                      <span>{item.icon}</span>
                      <p>{item.text}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="task-card">
                <SectionLabel>Referensi Belajar</SectionLabel>

                <div className="task-output-list">
                  {data.sections.referensiBelajar.map((item, index) => (
                    <div key={index}>
                      <span>{item.icon}</span>
                      <p>{item.text}</p>
                    </div>
                  ))}
                </div>
              </article>
            </div>

            <aside className="task-submit-card">
              <SectionLabel>Submit Task</SectionLabel>

              <div
                className={`task-dropzone ${isDragging ? "dragging" : ""}`}
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.pdf,.txt,.zip"
                  onChange={handleFileDrop}
                />

                <span>📁</span>

                <p>
                  {file
                    ? `✓ ${file.name} (${getFileSizeText(file.size)})`
                    : "Upload file kamu di sini"}
                </p>

                <small>
                  Gambar, PDF, TXT, atau ZIP. Maksimal 10MB.
                  <br />
                  Untuk project, upload ZIP source code tanpa node_modules.
                </small>
              </div>

              {file && (
                <div className="task-file-ready">
                  <p>File siap dikirim.</p>
                  <button type="button" onClick={() => setFile(null)}>
                    Hapus
                  </button>
                </div>
              )}

              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Tambahkan catatan pengerjaan, link demo, kendala, atau penjelasan isi file..."
                rows={7}
              />

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="task-submit-button"
              >
                {submitting ? "Mengirim..." : "Submit Task →"}
              </button>

              <button
                type="button"
                onClick={handleBack}
                className="task-secondary-button"
              >
                Kembali ke Action Plan
              </button>
            </aside>
          </div>
        </section>
      </main>

      <TaskStyle />
    </div>
  );
}

function TaskStyle() {
  return (
    <style>{`
      .task-page {
        min-height: 100vh;
        min-height: 100svh;
        background: #0a1f12;
        color: white;
        display: flex;
        flex-direction: column;
        overflow-x: hidden;
      }

      .task-navbar {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
        align-items: center;
        gap: 14px;
        padding: 14px clamp(18px, 4vw, 40px);
        border-bottom: 1px solid rgba(255,255,255,0.06);
        position: relative;
        z-index: 3;
      }

      .task-logo-wrap {
        min-width: 0;
        overflow: hidden;
      }

      .task-nav-pill {
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

      .task-nav-back {
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

      .task-main {
        flex: 1;
        position: relative;
        display: flex;
        justify-content: center;
        padding: clamp(24px, 5vh, 42px) clamp(14px, 4vw, 24px) 54px;
        overflow: hidden;
      }

      .task-main.center {
        align-items: center;
      }

      .task-content {
        position: relative;
        z-index: 1;
        width: 100%;
        max-width: 1040px;
        animation: taskSlideUp 0.55s ease both;
      }

      .task-breadcrumb {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
        margin-bottom: 14px;
      }

      .task-breadcrumb span {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }

      .task-breadcrumb small {
        color: rgba(255,255,255,0.25);
      }

      .task-breadcrumb button {
        border: none;
        background: transparent;
        padding: 0;
        color: rgba(255,255,255,0.46);
        font-family: 'DM Sans', sans-serif;
        font-size: 12px;
        cursor: pointer;
      }

      .task-breadcrumb button:disabled {
        color: rgba(255,255,255,0.86);
        cursor: default;
      }

      .task-hero-card,
      .task-card,
      .task-submit-card,
      .task-result-card {
        border: 1px solid rgba(255,255,255,0.1);
        background: rgba(255,255,255,0.06);
        border-radius: 24px;
        backdrop-filter: blur(10px);
        box-shadow: 0 22px 76px rgba(0,0,0,0.18);
      }

      .task-hero-card {
        padding: clamp(18px, 3vw, 24px);
        margin-bottom: 14px;
        background:
          radial-gradient(circle at top left, rgba(61,186,116,0.16), transparent 34%),
          rgba(255,255,255,0.065);
      }

      .task-phase {
        font-family: 'DM Sans', sans-serif;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.09em;
        color: rgba(126,240,170,0.72);
        font-weight: 900;
        margin-bottom: 12px;
      }

      .task-title-row {
        display: flex;
        align-items: flex-start;
        gap: 13px;
      }

      .task-title-icon {
        width: 44px;
        height: 44px;
        border-radius: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(61,186,116,0.12);
        border: 1px solid rgba(61,186,116,0.18);
        font-size: 21px;
        flex-shrink: 0;
      }

      .task-title-row h1 {
        margin: 0;
        font-family: 'Playfair Display', serif;
        font-size: clamp(25px, 4vw, 36px);
        line-height: 1.16;
        color: white;
      }

      .task-title-row p {
        margin: 7px 0 0;
        font-family: 'DM Sans', sans-serif;
        font-size: 13px;
        color: rgba(255,255,255,0.55);
      }

      .task-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 15px;
      }

      .task-tags span {
        padding: 7px 10px;
        border-radius: 999px;
        background: rgba(255,255,255,0.075);
        border: 1px solid rgba(255,255,255,0.11);
        font-family: 'DM Sans', sans-serif;
        font-size: 11px;
        color: rgba(255,255,255,0.72);
        font-weight: 800;
      }

      .task-tags span.xp {
        background: rgba(61,186,116,0.13);
        border-color: rgba(61,186,116,0.24);
        color: #7ef0aa;
      }

      .task-grid {
        display: grid;
        grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
        gap: 14px;
        align-items: start;
      }

      .task-left {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .task-card,
      .task-submit-card {
        padding: clamp(17px, 3vw, 20px);
      }

      .task-section-label {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
      }

      .task-section-label span {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        display: inline-block;
        flex-shrink: 0;
        margin-right: 8px;
      }

      .task-section-label strong {
        font-family: 'DM Sans', sans-serif;
        font-size: 10px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.46);
        font-weight: 900;
      }

      .task-paragraph {
        font-family: 'DM Sans', sans-serif;
        font-size: 13px;
        color: rgba(255,255,255,0.7);
        line-height: 1.75;
        margin: 0;
      }

      .task-check-list,
      .task-output-list {
        display: flex;
        flex-direction: column;
        gap: 9px;
      }

      .task-check-list div {
        display: flex;
        align-items: flex-start;
        gap: 10px;
      }

      .task-check-list span {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: rgba(45,140,94,0.25);
        border: 1.5px solid rgba(61,186,116,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
        font-size: 11px;
        color: #3dba74;
        flex-shrink: 0;
        margin-top: 1px;
      }

      .task-check-list p,
      .task-output-list p {
        font-family: 'DM Sans', sans-serif;
        font-size: 13px;
        color: rgba(255,255,255,0.74);
        margin: 0;
        line-height: 1.65;
      }

      .task-output-list div {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 10px 12px;
        background: rgba(255,255,255,0.035);
        border: 1px solid rgba(255,255,255,0.07);
        border-radius: 12px;
      }

      .task-output-list span {
        font-size: 16px;
        flex-shrink: 0;
      }

      .task-submit-card {
        position: sticky;
        top: 18px;
      }

      .task-dropzone {
        border: 2px dashed rgba(255,255,255,0.15);
        border-radius: 16px;
        padding: 28px 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 7px;
        cursor: pointer;
        background: rgba(255,255,255,0.025);
        transition: all 0.2s;
        margin-bottom: 12px;
        text-align: center;
      }

      .task-dropzone.dragging {
        border-color: rgba(61,186,116,0.6);
        background: rgba(61,186,116,0.05);
      }

      .task-dropzone input {
        display: none;
      }

      .task-dropzone > span {
        font-size: 28px;
      }

      .task-dropzone p {
        font-family: 'DM Sans', sans-serif;
        font-size: 13px;
        color: rgba(255,255,255,0.65);
        margin: 0;
        line-height: 1.45;
        word-break: break-word;
      }

      .task-dropzone small {
        font-family: 'DM Sans', sans-serif;
        font-size: 11px;
        color: rgba(255,255,255,0.34);
        line-height: 1.55;
      }

      .task-file-ready {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border-radius: 12px;
        background: rgba(61,186,116,0.08);
        border: 1px solid rgba(61,186,116,0.18);
        margin-bottom: 12px;
      }

      .task-file-ready p {
        margin: 0;
        font-size: 12px;
        color: rgba(255,255,255,0.68);
      }

      .task-file-ready button {
        border: none;
        background: transparent;
        color: #ff8a8a;
        font-weight: 800;
        cursor: pointer;
      }

      .task-submit-card textarea {
        width: 100%;
        box-sizing: border-box;
        resize: vertical;
        min-height: 130px;
        border-radius: 14px;
        border: 1px solid rgba(255,255,255,0.1);
        background: rgba(255,255,255,0.04);
        color: rgba(255,255,255,0.84);
        outline: none;
        padding: 13px 14px;
        font-family: 'DM Sans', sans-serif;
        font-size: 13px;
        line-height: 1.65;
        margin-bottom: 12px;
      }

      .task-submit-card textarea::placeholder {
        color: rgba(255,255,255,0.28);
      }

      .task-submit-button,
      .task-secondary-button {
        width: 100%;
        border-radius: 14px;
        font-family: 'DM Sans', sans-serif;
        font-size: 14px;
        font-weight: 900;
        cursor: pointer;
        padding: 13px 16px;
        min-height: 46px;
      }

      .task-submit-button {
        border: none;
        background: #3dba74;
        color: white;
        box-shadow: 0 14px 34px rgba(45,140,94,0.24);
        margin-bottom: 10px;
      }

      .task-submit-button:disabled {
        opacity: 0.58;
        cursor: not-allowed;
      }

      .task-secondary-button {
        border: 1px solid rgba(255,255,255,0.12);
        background: rgba(255,255,255,0.055);
        color: rgba(255,255,255,0.72);
      }

      .task-result-card {
        position: relative;
        z-index: 1;
        width: 100%;
        max-width: 600px;
        padding: clamp(22px, 4vw, 30px);
        text-align: center;
      }

      .task-result-card.passed {
        border-color: rgba(61,186,116,0.35);
      }

      .task-result-card.revision {
        border-color: rgba(212,168,68,0.35);
      }

      .task-result-icon {
        width: 66px;
        height: 66px;
        border-radius: 50%;
        background: rgba(61,186,116,0.16);
        border: 1px solid rgba(61,186,116,0.32);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 31px;
        margin: 0 auto 16px;
      }

      .task-result-card.revision .task-result-icon {
        background: rgba(212,168,68,0.16);
        border-color: rgba(212,168,68,0.32);
      }

      .task-result-card h1 {
        font-family: 'Playfair Display', serif;
        font-size: clamp(26px, 4vw, 34px);
        margin: 0 0 10px;
        color: #3dba74;
      }

      .task-result-card.revision h1 {
        color: #d4a844;
      }

      .task-result-card > p {
        margin: 0 0 18px;
        color: rgba(255,255,255,0.68);
        font-size: 14px;
        line-height: 1.75;
      }

      .task-result-stats {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        margin-bottom: 18px;
      }

      .task-result-stats div {
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 14px;
        padding: 14px;
      }

      .task-result-stats span {
        display: block;
        margin-bottom: 5px;
        color: rgba(255,255,255,0.42);
        font-size: 11px;
      }

      .task-result-stats strong {
        color: #3dba74;
        font-weight: 900;
        text-transform: capitalize;
      }

      .task-result-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }

      .task-result-actions button {
        border-radius: 13px;
        padding: 13px 16px;
        font-weight: 900;
        cursor: pointer;
      }

      .task-result-actions button:first-child {
        border: none;
        background: #2d8c5e;
        color: white;
      }

      .task-result-actions button:last-child {
        border: 1px solid rgba(255,255,255,0.14);
        background: rgba(255,255,255,0.06);
        color: rgba(255,255,255,0.76);
      }

      @keyframes taskSlideUp {
        from {
          opacity: 0;
          transform: translateY(18px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @media (max-width: 900px) {
        .task-grid {
          grid-template-columns: 1fr;
        }

        .task-submit-card {
          position: relative;
          top: 0;
        }
      }

      @media (max-width: 560px) {
        .task-navbar {
          grid-template-columns: 1fr auto;
          padding: 12px 16px;
        }

        .task-logo-wrap {
          transform: scale(0.92);
          transform-origin: left center;
        }

        .task-nav-pill {
          display: none;
        }

        .task-nav-back {
          font-size: 12px;
        }

        .task-main {
          padding: 24px 12px 38px;
          overflow-y: auto;
        }

        .task-title-row {
          flex-direction: column;
        }

        .task-hero-card,
        .task-card,
        .task-submit-card,
        .task-result-card {
          border-radius: 20px;
        }

        .task-title-row h1 {
          font-size: 27px;
        }

        .task-dropzone {
          padding: 24px 16px;
        }

        .task-result-stats,
        .task-result-actions {
          grid-template-columns: 1fr;
        }
      }
    `}</style>
  );
}
