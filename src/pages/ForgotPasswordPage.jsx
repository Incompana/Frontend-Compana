// src/pages/ForgotPasswordPage.jsx
import { useState } from "react";
import { Logo, StarField } from "../components/Shared";

export default function ForgotPasswordPage({ onLogin, onSubmit }) {
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isValid = password && rePassword && password === rePassword;

  const handleSubmit = () => {
    if (!isValid) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (onSubmit) onSubmit();
    }, 1000);
  };

  const inputBase = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "10px",
    border: "1.5px solid rgba(45, 140, 94, 0.4)",
    background: "rgba(255,255,255,0.0)",
    color: "#1a3a2a",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s, background 0.2s",
  };

  const onFocus = (e) => {
    e.target.style.borderColor = "rgba(45, 140, 94, 0.8)";
    e.target.style.background = "rgba(45, 140, 94, 0.04)";
  };
  const onBlur = (e) => {
    e.target.style.borderColor = "rgba(45, 140, 94, 0.4)";
    e.target.style.background = "rgba(255,255,255,0.0)";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a1f12",
        color: "white",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
      }}
    >
      <nav style={{ display: "flex", alignItems: "center", padding: "16px 40px" }}>
        <Logo />
      </nav>

      <div
        style={{
          flex: 1,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
        }}
      >
        <div className="mesh-bg" />
        <StarField />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: "520px",
            animation: "slideUp 0.6s ease both",
          }}
        >
          {/* Title */}
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: "clamp(26px, 5vw, 36px)",
                color: "#3dba74",
                marginBottom: "8px",
                letterSpacing: "-0.5px",
              }}
            >
              Lupa Password?
            </h1>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              Silahkan masukkan password baru untuk mereset password.
            </p>
          </div>

          {/* Card */}
          <div
            style={{
              background: "rgba(255,255,255,0.95)",
              borderRadius: "20px",
              padding: "36px 40px 32px",
              boxShadow:
                "0 8px 40px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08)",
            }}
          >
            {/* Password */}
            <div style={{ marginBottom: "14px" }}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputBase}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>

            {/* Re-Password */}
            <div style={{ marginBottom: "14px" }}>
              <input
                type="password"
                placeholder="Re-Password"
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
                style={{
                  ...inputBase,
                  borderColor:
                    rePassword && password !== rePassword
                      ? "rgba(220, 80, 80, 0.6)"
                      : "rgba(45, 140, 94, 0.4)",
                }}
                onFocus={onFocus}
                onBlur={onBlur}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
              {rePassword && password !== rePassword && (
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "12px",
                    color: "rgba(220, 80, 80, 0.85)",
                    marginTop: "6px",
                    paddingLeft: "4px",
                  }}
                >
                  Password tidak cocok
                </p>
              )}
            </div>

            {/* Login link */}
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                color: "rgba(60,80,70,0.75)",
                textAlign: "center",
                marginBottom: "18px",
              }}
            >
              Sudah punya akun?{" "}
              <span
                onClick={onLogin}
                style={{
                  color: "#2d8c5e",
                  cursor: "pointer",
                  fontWeight: 500,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#1a5c3e")}
                onMouseLeave={(e) => (e.target.style.color = "#2d8c5e")}
              >
                Login
              </span>
            </p>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading || !isValid}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "10px",
                border: "none",
                background:
                  loading ? "rgba(45, 140, 94, 0.6)" : "rgba(45, 140, 94, 0.85)",
                color: "white",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "15px",
                fontWeight: 600,
                cursor: loading || !isValid ? "not-allowed" : "pointer",
                transition: "all 0.25s",
                opacity: !isValid ? 0.65 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading && isValid) {
                  e.target.style.background = "rgba(55, 165, 110, 1)";
                  e.target.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(45, 140, 94, 0.85)";
                e.target.style.transform = "translateY(0)";
              }}
            >
              {loading ? "Menyimpan..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
