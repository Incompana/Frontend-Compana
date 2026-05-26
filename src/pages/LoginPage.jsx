// src/pages/LoginPage.jsx
import { useState } from "react";
import { Logo, StarField } from "../components/Shared";

export default function LoginPage({ onLogin, onRegister, onForgotPassword }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!username || !email || !password) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (onLogin) onLogin({ username, email });
    }, 1000);
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "10px",
    border: "1.5px solid rgba(45, 140, 94, 0.3)",
    background: "rgba(255,255,255,0.0)",
    color: "rgba(255,255,255,0.85)",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s, background 0.2s",
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = "rgba(45, 140, 94, 0.7)";
    e.target.style.background = "rgba(45, 140, 94, 0.05)";
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = "rgba(45, 140, 94, 0.3)";
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
      {/* Nav */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 40px",
        }}
      >
        <Logo />
      </nav>

      {/* Main */}
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
          {/* Title above card */}
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
              Login
            </h1>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              Silahkan lakukan login untuk bisa mengakses website ini
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
                style={{
                  ...inputStyle,
                  background: "rgba(255,255,255,0.0)",
                  color: "#1a3a2a",
                  border: "1.5px solid rgba(45, 140, 94, 0.4)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(45, 140, 94, 0.8)";
                  e.target.style.background = "rgba(45, 140, 94, 0.04)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(45, 140, 94, 0.4)";
                  e.target.style.background = "rgba(255,255,255,0.0)";
                }}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: "14px" }}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  ...inputStyle,
                  background: "rgba(255,255,255,0.0)",
                  color: "#1a3a2a",
                  border: "1.5px solid rgba(45, 140, 94, 0.4)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(45, 140, 94, 0.8)";
                  e.target.style.background = "rgba(45, 140, 94, 0.04)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(45, 140, 94, 0.4)";
                  e.target.style.background = "rgba(255,255,255,0.0)";
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "14px" }}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  ...inputStyle,
                  background: "rgba(255,255,255,0.0)",
                  color: "#1a3a2a",
                  border: "1.5px solid rgba(45, 140, 94, 0.4)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(45, 140, 94, 0.8)";
                  e.target.style.background = "rgba(45, 140, 94, 0.04)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(45, 140, 94, 0.4)";
                  e.target.style.background = "rgba(255,255,255,0.0)";
                }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>

            {/* Register link */}
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                color: "rgba(60,80,70,0.75)",
                textAlign: "center",
                marginBottom: "18px",
              }}
            >
              Belum punya akun?{" "}
              <span
                onClick={onRegister}
                style={{
                  color: "#2d8c5e",
                  cursor: "pointer",
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#1a5c3e")}
                onMouseLeave={(e) => (e.target.style.color = "#2d8c5e")}
              >
                Register
              </span>
            </p>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={loading || !username || !email || !password}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "10px",
                border: "none",
                background: loading
                  ? "rgba(45, 140, 94, 0.6)"
                  : "rgba(45, 140, 94, 0.85)",
                color: "white",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "15px",
                fontWeight: 600,
                cursor:
                  loading || !username || !email || !password
                    ? "not-allowed"
                    : "pointer",
                transition: "all 0.25s",
                marginBottom: "20px",
                opacity: !username || !email || !password ? 0.65 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading && username && email && password) {
                  e.target.style.background = "rgba(55, 165, 110, 1)";
                  e.target.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(45, 140, 94, 0.85)";
                e.target.style.transform = "translateY(0)";
              }}
            >
              {loading ? "Masuk..." : "Login"}
            </button>

            {/* Social login */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "24px",
                marginBottom: "20px",
              }}
            >
              {/* Google */}
              <button
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "6px",
                  borderRadius: "50%",
                  transition: "transform 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
                title="Login dengan Google"
              >
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="18" cy="18" r="18" fill="white" />
                  <path
                    d="M27.36 18.2c0-.63-.06-1.25-.16-1.84H18v3.48h5.24a4.48 4.48 0 01-1.94 2.94v2.44h3.14c1.84-1.69 2.92-4.19 2.92-7.02z"
                    fill="#4285F4"
                  />
                  <path
                    d="M18 28c2.63 0 4.84-.87 6.44-2.38l-3.14-2.44c-.87.58-1.98.93-3.3.93-2.54 0-4.69-1.71-5.46-4.02H9.3v2.52A9.99 9.99 0 0018 28z"
                    fill="#34A853"
                  />
                  <path
                    d="M12.54 20.09A5.97 5.97 0 0112.22 18c0-.73.13-1.44.32-2.09v-2.52H9.3A9.99 9.99 0 008 18c0 1.61.39 3.13 1.3 4.61l3.24-2.52z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M18 12.88c1.43 0 2.71.49 3.72 1.46l2.78-2.78C22.84 9.99 20.63 9 18 9a9.99 9.99 0 00-8.7 5.09l3.24 2.52c.77-2.31 2.92-4.73 5.46-4.73z"
                    fill="#EA4335"
                  />
                </svg>
              </button>

              {/* Facebook */}
              <button
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "6px",
                  borderRadius: "50%",
                  transition: "transform 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
                title="Login dengan Facebook"
              >
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="18" cy="18" r="18" fill="white" />
                  <path
                    d="M22.5 8H20c-2.76 0-4.5 1.74-4.5 4.5V15H13v3.5h2.5V28h4v-9.5H22l.5-3.5h-3V13c0-.97.53-1.5 1.5-1.5H22.5V8z"
                    fill="#2d8c5e"
                  />
                </svg>
              </button>
            </div>

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
