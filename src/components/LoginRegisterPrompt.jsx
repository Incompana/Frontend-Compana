// src/components/LoginRegisterPrompt.jsx
// Modal ringkas untuk guest setelah hasil assessment siap.

export default function LoginRegisterPrompt({
  open = true,
  onLogin,
  onRegister,
  onGoogle,
  onSkip,
  onCancel,
  isLoading = false,
}) {
  if (!open) return null;

  const closeModal = onCancel || onSkip;

  return (
    <div
      onClick={closeModal}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.62)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        backdropFilter: "blur(8px)",
      }}
    >
      <section
        onClick={(event) => event.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "460px",
          background: "rgba(255,255,255,0.97)",
          borderRadius: "22px",
          padding: "26px",
          color: "#1a3a2a",
          boxShadow: "0 28px 90px rgba(0,0,0,0.38)",
          animation: "journeyModalUp 0.24s ease both",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div
          style={{
            width: "58px",
            height: "58px",
            borderRadius: "50%",
            background: "rgba(61,186,116,0.14)",
            border: "1.5px solid rgba(61,186,116,0.28)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "26px",
            marginBottom: "16px",
          }}
        >
          🗺️
        </div>

        <p
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "5px 12px",
            borderRadius: "999px",
            background: "rgba(45,140,94,0.08)",
            border: "1px solid rgba(45,140,94,0.18)",
            color: "#2d8c5e",
            fontSize: "12px",
            fontWeight: 800,
            margin: "0 0 12px",
          }}
        >
          ✨ Journey kamu sudah siap
        </p>

        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "28px",
            fontWeight: 800,
            margin: "0 0 10px",
            color: "#1a3a2a",
            lineHeight: 1.18,
          }}
        >
          Simpan hasil dan lanjutkan action plan
        </h2>

        <p
          style={{
            fontSize: "14px",
            lineHeight: 1.7,
            color: "rgba(40,70,55,0.68)",
            margin: "0 0 18px",
          }}
        >
          Login atau daftar agar hasil assessment, skill gap, action plan, dan
          progress belajarmu tersimpan.
        </p>

        <div
          style={{
            display: "grid",
            gap: "9px",
            marginBottom: "20px",
          }}
        >
          {[
            ["💾", "Simpan hasil assessment AI"],
            ["🧭", "Buka action plan step-by-step"],
            ["📊", "Pantau progress dari dashboard"],
          ].map(([icon, text]) => (
            <div
              key={text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 12px",
                borderRadius: "12px",
                background: "rgba(45,140,94,0.055)",
                border: "1px solid rgba(45,140,94,0.12)",
              }}
            >
              <span>{icon}</span>
              <span
                style={{
                  fontSize: "13px",
                  color: "#2a4a38",
                  fontWeight: 700,
                }}
              >
                {text}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            marginBottom: onGoogle ? "10px" : "16px",
          }}
          className="journey-modal-actions"
        >
          <button
            onClick={isLoading ? undefined : onLogin}
            disabled={isLoading}
            style={{
              padding: "13px 14px",
              borderRadius: "13px",
              border: "1.5px solid rgba(45,140,94,0.28)",
              background: "white",
              color: "#2d8c5e",
              fontSize: "14px",
              fontWeight: 900,
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            Login
          </button>

          <button
            onClick={isLoading ? undefined : onRegister}
            disabled={isLoading}
            style={{
              padding: "13px 14px",
              borderRadius: "13px",
              border: "none",
              background: "#2d8c5e",
              color: "white",
              fontSize: "14px",
              fontWeight: 900,
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            Daftar Gratis
          </button>
        </div>

        {onGoogle && (
          <button
            onClick={isLoading ? undefined : onGoogle}
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: "13px",
              border: "1.5px solid rgba(0,0,0,0.1)",
              background: "white",
              color: "#1a3a2a",
              fontSize: "14px",
              fontWeight: 800,
              cursor: isLoading ? "not-allowed" : "pointer",
              marginBottom: "16px",
            }}
          >
            {isLoading ? "Memproses..." : "Lanjut dengan Google"}
          </button>
        )}

        <button
          onClick={closeModal}
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            color: "rgba(40,70,55,0.55)",
            fontSize: "12px",
            fontWeight: 800,
            cursor: "pointer",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
          }}
        >
          Nanti dulu, tetap lihat hasil analisis
        </button>
      </section>

      <style>{`
        @keyframes journeyModalUp {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 520px) {
          .journey-modal-actions {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
