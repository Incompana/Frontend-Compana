// src/pages/RegisterPage.jsx
import { useState } from "react";
import { Logo, StarField } from "../components/Shared";

export default function RegisterPage({ onLogin, onForgotPassword }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isValid =
    username && email && password && rePassword && password === rePassword;

  const handleRegister = () => {
    if (!isValid) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (onLogin) onLogin();
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
            maxWidth: "540px",
            animation: "slideUp 0.6s ease both",
          }}
        >
          {/* Title */}
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: "clamp(28px, 5vw, 38px)",
                color: "#3dba74",
                marginBottom: "8px",
                letterSpacing: "-0.5px",
              }}
            >
              Register
            </h1>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              Silahkan lakukan Register untuk bisa mengakses website ini
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
            {/* Username */}
            <div style={{ marginBottom: "14px" }}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={inputBase}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: "14px" }}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputBase}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>

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
                onKeyDown={(e) => e.key === "Enter" && handleRegister()}
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

            {/* Register Button */}
            <button
              onClick={handleRegister}
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
                marginBottom: "20px",
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
              {loading ? "Mendaftar..." : "Register"}
            </button>

            {/* Forgot password */}
            <div style={{ textAlign: "center" }}>
              <button
                onClick={onForgotPassword}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(45, 140, 94, 0.4)",
                  borderRadius: "8px",
                  padding: "10px 28px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  color: "#2d8c5e",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontWeight: 500,
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(45, 140, 94, 0.07)";
                  e.target.style.borderColor = "rgba(45, 140, 94, 0.7)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.borderColor = "rgba(45, 140, 94, 0.4)";
                }}
              >
                Lupa Password?
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
