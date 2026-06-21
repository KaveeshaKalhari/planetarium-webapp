import React, { useState, useEffect } from 'react';
import { EyeOff, Eye, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import PlanetariumLogo from "../assets/PlanetariumLogo.png";
import { login, googleAuth } from "../services/api";
import { type CredentialResponse, GoogleLogin } from "@react-oauth/google";

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ usernameOrEmail: '', password: '' });
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [focused, setFocused] = useState({ usernameOrEmail: false, password: false });
    const [errors, setErrors] = useState({ usernameOrEmail: '', password: '' });
    const [visible, setVisible] = useState(false);

    useEffect(() => { requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true))); }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
        setError('');
    };

    const validateForm = () => {
        const newErrors = { usernameOrEmail: '', password: '' };
        if (!formData.usernameOrEmail.trim()) newErrors.usernameOrEmail = 'Username or email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        setErrors(newErrors);
        return !newErrors.usernameOrEmail && !newErrors.password;
    };

    const handleLogin = async () => {
        setError(''); setSuccess('');
        if (!validateForm()) return;
        setLoading(true);
        try {
            const response = await login(formData);
            if (response.success) {
                setSuccess('Login successful! Redirecting...');
                if (response.token) localStorage.setItem('authToken', response.token);
                if (response.user) localStorage.setItem('user', JSON.stringify(response.user));
                const role = response.role || response.user?.role;
                setTimeout(() => navigate(role === 'ADMIN' ? '/admin-home-page' : '/user-home-page'), 1000);
            } else {
                setError(response.message || 'Login failed. Please try again.');
            }
        } catch { setError('An unexpected error occurred. Please try again.'); }
        finally { setLoading(false); }
    };

    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        setLoading(true); setError(''); setSuccess('');
        try {
            if (!credentialResponse.credential) { setError('Google authentication failed'); return; }
            const response = await googleAuth(credentialResponse.credential);
            if (response.success) {
                if (response.token) localStorage.setItem('authToken', response.token);
                if (response.user) localStorage.setItem('user', JSON.stringify(response.user));
                setSuccess('Google login successful! Redirecting...');
                const role = response.role || response.user?.role;
                setTimeout(() => navigate(role === 'ADMIN' ? '/admin-home-page' : '/user-home-page'), 1000);
            } else { setError(response.message || 'Google authentication failed'); }
        } catch { setError('An unexpected error occurred with Google login.'); }
        finally { setLoading(false); }
    };


    const cardStyle: React.CSSProperties = {
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1) translateY(0)' : 'scale(0.94) translateY(20px)',
        transition: 'opacity 0.65s cubic-bezier(.22,1,.36,1), transform 0.65s cubic-bezier(.22,1,.36,1)',
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Raleway:wght@300;400;600&display=swap');

                @keyframes fadeSlideUp   { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
                @keyframes scaleFadeIn   { from{opacity:0;transform:scale(0.92)}      to{opacity:1;transform:scale(1)} }
                @keyframes nebulaDrift   { 0%{transform:translate(0,0) scale(1)} 33%{transform:translate(22px,-16px) scale(1.04)} 66%{transform:translate(-16px,12px) scale(0.97)} 100%{transform:translate(0,0) scale(1)} }
                @keyframes twinkle       { 0%,100%{opacity:0.25} 50%{opacity:0.9} }
                @keyframes cardGlow      { 0%,100%{box-shadow:0 0 0 1px rgba(33,158,188,0.15),0 24px 64px rgba(0,0,0,0.5)} 50%{box-shadow:0 0 0 1px rgba(33,158,188,0.35),0 24px 64px rgba(0,0,0,0.5),0 0 40px rgba(33,158,188,0.08)} }
                @keyframes btnGlow       { 0%,100%{box-shadow:0 0 14px rgba(33,158,188,0.4)} 50%{box-shadow:0 0 28px rgba(33,158,188,0.75),0 4px 20px rgba(33,158,188,0.3)} }
                @keyframes orbitSpin     { from{transform:rotate(0deg) translateX(110px) rotate(0deg)} to{transform:rotate(360deg) translateX(110px) rotate(-360deg)} }
                @keyframes shootAcross   { 0%{transform:translate(0,0) scaleX(1);opacity:1} 100%{transform:translate(300px,150px) scaleX(0);opacity:0} }

                .nebula-blob { position:fixed;border-radius:50%;filter:blur(80px);pointer-events:none;z-index:0;animation:nebulaDrift 20s ease-in-out infinite; }
                .star-dot    { position:fixed;border-radius:50%;background:rgba(200,230,255,0.9);pointer-events:none;z-index:0;animation:twinkle var(--dur,3s) ease-in-out infinite;animation-delay:var(--delay,0s); }     
                .mounted-content { animation:fadeSlideUp 0.75s cubic-bezier(.22,1,.36,1) 0.25s forwards; }

                .auth-card {
                    background: rgba(12,20,46,0.88);
                    border: 1px solid rgba(33,158,188,0.2);
                    border-radius: 28px; padding: 36px 32px;
                    width: 100%; max-width: 420px;
                    backdrop-filter: blur(20px);
                    animation: cardGlow 5s ease-in-out infinite;
                    position: relative; overflow: hidden;
                }
                .auth-card::before {
                    content:'';position:absolute;top:0;left:0;right:0;height:1px;
                    background:linear-gradient(90deg,transparent,rgba(33,158,188,0.5),transparent);
                }

                .orbit-ring { position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:220px;height:220px;border-radius:50%;border:1px solid rgba(33,158,188,0.08);pointer-events:none; }
                .orbit-dot  { position:absolute;width:6px;height:6px;background:#219EBC;border-radius:50%;box-shadow:0 0 8px #219EBC;animation:orbitSpin 14s linear infinite;top:50%;left:50%;margin:-3px; }

                .field-group { display:flex;flex-direction:column;gap:7px; }
                .field-label { font-family:'Raleway',sans-serif;font-size:0.78rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:rgba(182,194,226,0.75);transition:color 0.2s; }
                .field-label.focused { color:#219EBC; }
                .field-input {
                    width:100%;padding:12px 16px;box-sizing:border-box;
                    background:rgba(255,255,255,0.05);
                    border:1px solid rgba(255,255,255,0.1);
                    border-radius:10px;color:#fff;
                    font-family:'Raleway',sans-serif;font-size:0.9rem;
                    outline:none;transition:border-color 0.25s,box-shadow 0.25s,background 0.25s;
                }
                .field-input::placeholder { color:rgba(182,194,226,0.3); }
                .field-input:focus { border-color:rgba(33,158,188,0.65);box-shadow:0 0 0 3px rgba(33,158,188,0.1);background:rgba(33,158,188,0.05); }
                .field-input:hover:not(:focus) { border-color:rgba(33,158,188,0.3); }
                .field-input.error { border-color:rgba(239,68,68,0.6); }
                .field-input:disabled { opacity:0.55; }
                .field-error { color:#f87171;font-size:0.72rem;padding-left:4px; }

                .submit-btn {
                    width:100%;padding:13px;border:none;border-radius:40px;
                    background:linear-gradient(135deg,#219EBC,#126782);
                    color:#fff;font-family:'Raleway',sans-serif;font-weight:600;
                    font-size:0.85rem;letter-spacing:0.14em;text-transform:uppercase;
                    cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;
                    transition:transform 0.22s cubic-bezier(.22,1,.36,1),box-shadow 0.22s,background 0.3s;
                    animation:btnGlow 3.5s ease-in-out infinite;
                }
                .submit-btn:hover:not(:disabled) { transform:translateY(-2px) scale(1.02);box-shadow:0 8px 28px rgba(33,158,188,0.5);background:linear-gradient(135deg,#27b8dc,#1a88a8);animation:none; }
                .submit-btn:active:not(:disabled) { transform:scale(0.98); }
                .submit-btn:disabled { opacity:0.6;cursor:not-allowed;animation:none; }

                .divider-line { height:1px;background:linear-gradient(90deg,transparent,rgba(33,158,188,0.3),transparent); }

                .link-teal { color:rgba(33,158,188,0.85);text-decoration:none;font-weight:600;transition:color 0.2s; }
                .link-teal:hover { color:#27b8dc; }
                .link-subtle { color:rgba(182,194,226,0.65);text-decoration:none;font-size:0.82rem;transition:color 0.2s; }
                .link-subtle:hover { color:#219EBC; }

                .eye-btn { background:none;border:none;cursor:pointer;color:rgba(182,194,226,0.5);padding:0;display:flex;transition:color 0.2s; }
                .eye-btn:hover { color:#219EBC; }

                .checkbox-label { display:flex;align-items:center;gap:8px;cursor:pointer;font-size:0.82rem;color:rgba(182,194,226,0.7); }
                input[type="checkbox"] { accent-color:#219EBC;width:15px;height:15px; }

                .success-msg { background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.35);border-radius:10px;padding:12px 14px;display:flex;align-items:center;gap:10px;color:#6ee7b7;font-size:0.83rem; }
                .error-msg   { background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.35); border-radius:10px;padding:12px 14px;display:flex;align-items:center;gap:10px;color:#f87171;font-size:0.83rem; }
            `}</style>

            <div className="min-h-screen bg-[#0A1128] flex items-center justify-center p-4 relative overflow-hidden" style={{ fontFamily: "'Raleway', sans-serif" }}>

                {/* Nebula blobs */}
                <div className="nebula-blob" style={{ width: 420, height: 360, top: "-10%", left: "-8%", background: "rgba(33,158,188,0.09)", animationDelay: "0s" }} />
                <div className="nebula-blob" style={{ width: 360, height: 300, bottom: "0%", right: "-6%", background: "rgba(18,103,130,0.1)", animationDelay: "-8s" }} />

                {/* Star dots */}
                {[{ top: "8%", left: "5%", s: 2, d: "3s", dl: "0s" }, { top: "18%", left: "92%", s: 1.5, d: "3.8s", dl: "-1s" }, { top: "75%", left: "4%", s: 2, d: "4s", dl: "-2s" }, { top: "88%", left: "90%", s: 1.5, d: "2.8s", dl: "-0.5s" }, { top: "50%", left: "96%", s: 1, d: "3.5s", dl: "-1.5s" }].map((s, i) => (
                    <div key={i} className="star-dot" style={{ top: s.top, left: s.left, width: s.s, height: s.s, "--dur": s.d, "--delay": s.dl } as React.CSSProperties} />
                ))}

                {/* Card */}
                <div className="auth-card" style={cardStyle}>
                    <div className="">
                        {/* Logo + back */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                            <Link to="/">
                                <img src={PlanetariumLogo} alt="Planetarium logo" style={{ width: 56, height: 56, objectFit: "cover" }} />
                            </Link>
                            <Link to="/" className="link-subtle">← Home</Link>
                        </div>

                        {/* Header */}
                        <div style={{ marginBottom: 24 }}>
                            <h1 style={{ fontFamily: "'Raleway', sans-serif", fontSize: "1.9rem", fontWeight: 900, color: "#fff", letterSpacing: "0.03em", marginBottom: 6 }}>
                                Welcome <span style={{ color: "#219EBC" }}>Back</span>
                            </h1>
                            <p style={{ color: "rgba(182,194,226,0.65)", fontSize: "0.85rem", fontWeight: 300 }}>
                                Log in to continue your cosmic journey.
                            </p>
                        </div>

                        {/* Alerts */}
                        {error && <div className="error-msg" style={{ marginBottom: 16 }}><XCircle size={16} />{error}</div>}
                        {success && <div className="success-msg" style={{ marginBottom: 16 }}><CheckCircle size={16} />{success}</div>}

                        {/* Form */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 20 }}>

                            <div className="field-group">
                                <label className={`field-label ${focused.usernameOrEmail ? "focused" : ""}`}>Username or Email</label>
                                <input
                                    type="text" name="usernameOrEmail"
                                    value={formData.usernameOrEmail}
                                    onChange={handleChange}
                                    onFocus={() => setFocused(f => ({ ...f, usernameOrEmail: true }))}
                                    onBlur={() => setFocused(f => ({ ...f, usernameOrEmail: false }))}
                                    placeholder="example@gmail.com"
                                    className={`field-input ${errors.usernameOrEmail ? "error" : ""}`}
                                    disabled={loading}
                                />
                                {errors.usernameOrEmail && <span className="field-error">{errors.usernameOrEmail}</span>}
                            </div>

                            <div className="field-group">
                                <label className={`field-label ${focused.password ? "focused" : ""}`}>Password</label>
                                <div style={{ position: "relative" }}>
                                    <input
                                        type={showPassword ? "text" : "password"} name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        onFocus={() => setFocused(f => ({ ...f, password: true }))}
                                        onBlur={() => setFocused(f => ({ ...f, password: false }))}
                                        placeholder="••••••••"
                                        className={`field-input ${errors.password ? "error" : ""}`}
                                        style={{ paddingRight: 44 }}
                                        disabled={loading}
                                    />
                                    <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)" }}>
                                        {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                    </button>
                                </div>
                                {errors.password && <span className="field-error">{errors.password}</span>}
                            </div>

                            {/* Remember + Forgot */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <label className="checkbox-label">
                                    <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} disabled={loading} />
                                    Remember me
                                </label>
                                <Link to="/forgot-password" className="link-subtle" style={{ fontSize: "0.8rem" }}>Forgot password?</Link>
                            </div>

                            <button onClick={handleLogin} disabled={loading} className="submit-btn">
                                {loading ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />Logging in...</> : "Login"}
                            </button>
                        </div>

                        {/* Divider */}
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                            <div className="divider-line" style={{ flex: 1 }} />
                            <span style={{ color: "rgba(182,194,226,0.45)", fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "nowrap" }}>or login with</span>
                            <div className="divider-line" style={{ flex: 1 }} />
                        </div>

                        {/* Google */}
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError('Google login failed. Please try again.')} useOneTap theme="filled_black" size="large" shape="circle" />
                        </div>

                        {/* Footer */}
                        <p style={{ textAlign: "center", color: "rgba(182,194,226,0.55)", fontSize: "0.82rem" }}>
                            Don't have an account?{" "}
                            <Link to="/sign-up" className="link-teal">Create account</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;