import React, { useState, useEffect } from "react";
import { EyeOff, Eye, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PlanetariumLogo from "../assets/PlanetariumLogo.png";
import { login, googleAuth } from "../services/api";
import { type CredentialResponse, GoogleLogin } from "@react-oauth/google";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [focused, setFocused] = useState({
    usernameOrEmail: false,
    password: false,
  });
  const [errors, setErrors] = useState({ usernameOrEmail: "", password: "" });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setError("");
  };

  const validateForm = () => {
    const newErrors = { usernameOrEmail: "", password: "" };
    if (!formData.usernameOrEmail.trim())
      newErrors.usernameOrEmail = "Username or email is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return !newErrors.usernameOrEmail && !newErrors.password;
  };

  const handleLogin = async () => {
    setError("");
    setSuccess("");
    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await login(formData);
      if (response.success) {
        setSuccess("Login successful! Redirecting...");
        if (response.token) localStorage.setItem("authToken", response.token);
        if (response.user)
          localStorage.setItem("user", JSON.stringify(response.user));
        const role = response.role || (response.user as any)?.role || "";
        setTimeout(
          () =>
            navigate(role === "ADMIN" ? "/admin-home-page" : "/user-home-page"),
          1000,
        );
      } else {
        setError(response.message || "Login failed. Please try again.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      if (!credentialResponse.credential) {
        setError("Google authentication failed");
        return;
      }
      const response = await googleAuth(credentialResponse.credential);
      if (response.success) {
        if (response.token) localStorage.setItem("authToken", response.token);
        if (response.user)
          localStorage.setItem("user", JSON.stringify(response.user));
        setSuccess("Google login successful! Redirecting...");
        const role = response.role || (response.user as any)?.role;
        setTimeout(
          () =>
            navigate(role === "ADMIN" ? "/admin-home-page" : "/user-home-page"),
          1000,
        );
      } else {
        setError(response.message || "Google authentication failed");
      }
    } catch {
      setError("An unexpected error occurred with Google login.");
    } finally {
      setLoading(false);
    }
  };

  const cardStyle: React.CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible
      ? "scale(1) translateY(0)"
      : "scale(0.94) translateY(20px)",
    transition:
      "opacity 0.65s cubic-bezier(.22,1,.36,1), transform 0.65s cubic-bezier(.22,1,.36,1)",
  };

  return (
    <>
      <div
        className="min-h-screen bg-[#0d1d52] flex items-center justify-center p-4 relative overflow-hidden"
        style={{ fontFamily: "'Raleway', sans-serif" }}
      >
        {/* Nebula blobs */}
        <div
          className="nebula-blob"
          style={{
            width: 420,
            height: 360,
            top: "-10%",
            left: "-8%",
            background: "rgba(33,158,188,0.09)",
            animationDelay: "0s",
          }}
        />
        <div
          className="nebula-blob"
          style={{
            width: 360,
            height: 300,
            bottom: "0%",
            right: "-6%",
            background: "rgba(18,103,130,0.1)",
            animationDelay: "-8s",
          }}
        />

        {/* Star dots */}
        {[
          { top: "8%", left: "5%", s: 2, d: "3s", dl: "0s" },
          { top: "18%", left: "92%", s: 1.5, d: "3.8s", dl: "-1s" },
          { top: "75%", left: "4%", s: 2, d: "4s", dl: "-2s" },
          { top: "88%", left: "90%", s: 1.5, d: "2.8s", dl: "-0.5s" },
          { top: "50%", left: "96%", s: 1, d: "3.5s", dl: "-1.5s" },
        ].map((s, i) => (
          <div
            key={i}
            className="star-dot"
            style={
              {
                top: s.top,
                left: s.left,
                width: s.s,
                height: s.s,
                "--dur": s.d,
                "--delay": s.dl,
              } as React.CSSProperties
            }
          />
        ))}

        {/* Card */}
        <div className="auth-card" style={cardStyle}>
          <div className="">
            {/* Logo + back */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <Link to="/">
                <img
                  src={PlanetariumLogo}
                  alt="Planetarium logo"
                  style={{ width: 56, height: 56, objectFit: "cover" }}
                />
              </Link>
              <Link to="/" className="link-subtle">
                ← Home
              </Link>
            </div>

            {/* Header */}
            <div style={{ marginBottom: 24 }}>
              <h1
                style={{
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "1.9rem",
                  fontWeight: 900,
                  color: "#fff",
                  letterSpacing: "0.03em",
                  marginBottom: 6,
                }}
              >
                Welcome <span style={{ color: "#219EBC" }}>Back</span>
              </h1>
              <p
                style={{
                  color: "rgba(182,194,226,0.65)",
                  fontSize: "0.85rem",
                  fontWeight: 300,
                }}
              >
                Log in to continue your cosmic journey.
              </p>
            </div>

            {/* Alerts */}
            {error && (
              <div className="error-msg" style={{ marginBottom: 16 }}>
                <XCircle size={16} />
                {error}
              </div>
            )}
            {success && (
              <div className="success-msg" style={{ marginBottom: 16 }}>
                <CheckCircle size={16} />
                {success}
              </div>
            )}

            {/* Form */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                marginBottom: 20,
              }}
            >
              <div className="field-group">
                <label
                  className={`field-label ${focused.usernameOrEmail ? "focused" : ""}`}
                >
                  Username or Email
                </label>
                <input
                  type="text"
                  name="usernameOrEmail"
                  value={formData.usernameOrEmail}
                  onChange={handleChange}
                  onFocus={() =>
                    setFocused((f) => ({ ...f, usernameOrEmail: true }))
                  }
                  onBlur={() =>
                    setFocused((f) => ({ ...f, usernameOrEmail: false }))
                  }
                  placeholder="example@gmail.com"
                  className={`field-input ${errors.usernameOrEmail ? "error" : ""}`}
                  disabled={loading}
                />
                {errors.usernameOrEmail && (
                  <span className="field-error">{errors.usernameOrEmail}</span>
                )}
              </div>

              <div className="field-group">
                <label
                  className={`field-label ${focused.password ? "focused" : ""}`}
                >
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() =>
                      setFocused((f) => ({ ...f, password: true }))
                    }
                    onBlur={() =>
                      setFocused((f) => ({ ...f, password: false }))
                    }
                    placeholder="••••••••"
                    className={`field-input ${errors.password ? "error" : ""}`}
                    style={{ paddingRight: 44 }}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <span className="field-error">{errors.password}</span>
                )}
              </div>

              {/* Remember + Forgot */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                  />
                  Remember me
                </label>
                <Link
                  to="/forgot-password"
                  className="link-subtle"
                  style={{ fontSize: "0.8rem" }}
                >
                  Forgot password?
                </Link>
              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                className="submit-btn"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={16}
                      style={{ animation: "spin 1s linear infinite" }}
                    />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </div>

            {/* Divider */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 20,
              }}
            >
              <div className="divider-line" style={{ flex: 1 }} />
              <span
                style={{
                  color: "rgba(182,194,226,0.45)",
                  fontSize: "0.75rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                or login with
              </span>
              <div className="divider-line" style={{ flex: 1 }} />
            </div>

            {/* Google */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 24,
              }}
            >
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() =>
                  setError("Google login failed. Please try again.")
                }
                useOneTap
                theme="filled_black"
                size="large"
                shape="circle"
              />
            </div>

            {/* Footer */}
            <p
              style={{
                textAlign: "center",
                color: "rgba(182,194,226,0.55)",
                fontSize: "0.82rem",
              }}
            >
              Don't have an account?{" "}
              <Link to="/sign-up" className="link-teal">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
