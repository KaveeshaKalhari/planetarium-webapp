import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, CheckCircle, Mail, KeyRound, Lock, XCircle } from "lucide-react";
import PlanetariumLogo from "../assets/PlanetariumLogo.png";

type Step = "email" | "otp" | "password";

const ForgotPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>("email");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [visible, setVisible] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    useEffect(() => { requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true))); }, []);

    const clearMessages = () => { setError(null); setSuccess(null); };

    const handleSendOtp = async () => {
        if (!email.trim()) { setError("Please enter your email."); return; }
        clearMessages(); setLoading(true);
        try {
            const res = await fetch("http://localhost:8080/api/v1/password-reset/send-otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
            const data = await res.json();
            if (data.success) { setSuccess("OTP sent! Check your inbox."); setStep("otp"); }
            else setError(data.message ?? "Failed to send OTP.");
        } catch { setError("Network error. Please try again."); }
        finally { setLoading(false); }
    };

    const handleVerifyOtp = async () => {
        if (!otp.trim()) { setError("Please enter the OTP."); return; }
        clearMessages(); setLoading(true);
        try {
            const res = await fetch("http://localhost:8080/api/v1/password-reset/verify-otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, otp }) });
            const data = await res.json();
            if (data.success) { setSuccess("OTP verified! Set your new password."); setStep("password"); }
            else setError(data.message ?? "Invalid OTP.");
        } catch { setError("Network error. Please try again."); }
        finally { setLoading(false); }
    };

    const handleResetPassword = async () => {
        if (!newPassword.trim()) { setError("Please enter a new password."); return; }
        if (newPassword.length < 6) { setError("Password must be at least 6 characters."); return; }
        if (newPassword !== confirmPassword) { setError("Passwords do not match."); return; }
        clearMessages(); setLoading(true);
        try {
            const res = await fetch("http://localhost:8080/api/v1/password-reset/reset", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, otp, newPassword }) });
            const data = await res.json();
            if (data.success) { setSuccess("Password updated! Redirecting to login..."); setTimeout(() => navigate("/login"), 2500); }
            else setError(data.message ?? "Failed to reset password.");
        } catch { setError("Network error. Please try again."); }
        finally { setLoading(false); }
    };

    const steps: { key: Step; label: string; icon: React.ReactNode }[] = [
        { key: "email", label: "Email", icon: <Mail size={15} /> },
        { key: "otp", label: "Verify", icon: <KeyRound size={15} /> },
        { key: "password", label: "Password", icon: <Lock size={15} /> },
    ];
    const stepIndex = steps.findIndex(s => s.key === step);


    const cardStyle: React.CSSProperties = {
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1) translateY(0)' : 'scale(0.94) translateY(20px)',
        transition: 'opacity 0.65s cubic-bezier(.22,1,.36,1), transform 0.65s cubic-bezier(.22,1,.36,1)',
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Raleway:wght@300;400;600&display=swap');

                @keyframes fadeSlideUp  { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
                @keyframes scaleFadeIn  { from{opacity:0;transform:scale(0.92)}      to{opacity:1;transform:scale(1)} }
                @keyframes nebulaDrift  { 0%{transform:translate(0,0) scale(1)} 33%{transform:translate(22px,-16px) scale(1.04)} 66%{transform:translate(-16px,12px) scale(0.97)} 100%{transform:translate(0,0) scale(1)} }
                @keyframes twinkle      { 0%,100%{opacity:0.25} 50%{opacity:0.9} }
                @keyframes cardGlow     { 0%,100%{box-shadow:0 0 0 1px rgba(33,158,188,0.15),0 24px 64px rgba(0,0,0,0.5)} 50%{box-shadow:0 0 0 1px rgba(33,158,188,0.35),0 24px 64px rgba(0,0,0,0.5),0 0 40px rgba(33,158,188,0.08)} }
                @keyframes btnGlow      { 0%,100%{box-shadow:0 0 14px rgba(33,158,188,0.4)} 50%{box-shadow:0 0 28px rgba(33,158,188,0.75),0 4px 20px rgba(33,158,188,0.3)} }
                @keyframes orbitSpin    { from{transform:rotate(0deg) translateX(110px) rotate(0deg)} to{transform:rotate(360deg) translateX(110px) rotate(-360deg)} }
                @keyframes shootAcross  { 0%{transform:translate(0,0) scaleX(1);opacity:1} 100%{transform:translate(300px,150px) scaleX(0);opacity:0} }
                @keyframes stepPop      { 0%{transform:scale(0.8);opacity:0} 100%{transform:scale(1);opacity:1} }
                @keyframes otpPulse     { 0%,100%{border-color:rgba(33,158,188,0.4)} 50%{border-color:rgba(33,158,188,0.9);box-shadow:0 0 0 4px rgba(33,158,188,0.12)} }
                @keyframes contentSwap  { from{opacity:0;transform:translateX(18px)} to{opacity:1;transform:translateX(0)} }

                .nebula-blob { position:fixed;border-radius:50%;filter:blur(80px);pointer-events:none;z-index:0;animation:nebulaDrift 20s ease-in-out infinite; }
                .star-dot    { position:fixed;border-radius:50%;background:rgba(200,230,255,0.9);pointer-events:none;z-index:0;animation:twinkle var(--dur,3s) ease-in-out infinite;animation-delay:var(--delay,0s); }
                .shooting    { position:fixed;width:100px;height:1.5px;background:linear-gradient(90deg,transparent,rgba(180,230,255,0.8),transparent);border-radius:2px;opacity:0;animation:shootAcross 3s ease-in infinite; }

                .anim-enter      { opacity:0; }
                .mounted-card    { animation:scaleFadeIn 0.75s cubic-bezier(.22,1,.36,1) 0.1s forwards; }
                .mounted-content { animation:fadeSlideUp 0.75s cubic-bezier(.22,1,.36,1) 0.25s forwards; }
                .step-content    { animation:contentSwap 0.4s cubic-bezier(.22,1,.36,1) forwards; }

                .auth-card {
                    background:rgba(12,20,46,0.88);
                    border:1px solid rgba(33,158,188,0.2);
                    border-radius:28px;padding:32px;
                    width:100%;max-width:420px;
                    backdrop-filter:blur(20px);
                    animation:cardGlow 5s ease-in-out infinite;
                    position:relative;overflow:hidden;
                }
                .auth-card::before { content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(33,158,188,0.5),transparent); }

                .orbit-ring { position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:220px;height:220px;border-radius:50%;border:1px solid rgba(33,158,188,0.08);pointer-events:none; }
                .orbit-dot  { position:absolute;width:6px;height:6px;background:#219EBC;border-radius:50%;box-shadow:0 0 8px #219EBC;animation:orbitSpin 14s linear infinite;top:50%;left:50%;margin:-3px; }

                /* Step indicator */
                .step-node {
                    width:38px;height:38px;border-radius:50%;
                    display:flex;align-items:center;justify-content:center;
                    font-size:0.8rem;font-weight:700;
                    transition:background 0.35s,box-shadow 0.35s,transform 0.35s;
                }
                .step-node.done    { background:#219EBC;color:#fff; }
                .step-node.active  { background:linear-gradient(135deg,#219EBC,#126782);color:#fff;box-shadow:0 0 0 4px rgba(33,158,188,0.2),0 0 16px rgba(33,158,188,0.4);animation:stepPop 0.4s ease; }
                .step-node.pending { background:rgba(255,255,255,0.07);color:rgba(182,194,226,0.4);border:1px solid rgba(255,255,255,0.1); }
                .step-connector { flex:1;height:2px;border-radius:2px;transition:background 0.5s; }
                .step-connector.done { background:linear-gradient(90deg,#219EBC,rgba(33,158,188,0.4)); }
                .step-connector.pending { background:rgba(255,255,255,0.08); }

                /* Fields */
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

                /* OTP input special style */
                .otp-input {
                    text-align:center;font-size:1.8rem;letter-spacing:0.5em;
                    padding:14px 16px;
                    animation:otpPulse 2.5s ease-in-out infinite;
                }
                .otp-input:focus { animation:none;border-color:rgba(33,158,188,0.85);box-shadow:0 0 0 4px rgba(33,158,188,0.15); }

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

                .ghost-btn { background:none;border:none;cursor:pointer;color:rgba(33,158,188,0.75);font-family:'Raleway',sans-serif;font-size:0.8rem;letter-spacing:0.08em;padding:8px 0;transition:color 0.2s;text-align:center;width:100%; }
                .ghost-btn:hover { color:#27b8dc; }
                .eye-btn { background:none;border:none;cursor:pointer;color:rgba(182,194,226,0.5);padding:0;display:flex;transition:color 0.2s; }
                .eye-btn:hover { color:#219EBC; }
                .link-subtle { color:rgba(182,194,226,0.65);text-decoration:none;font-size:0.82rem;transition:color 0.2s; }
                .link-subtle:hover { color:#219EBC; }
                .success-msg { background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.35);border-radius:10px;padding:12px 14px;display:flex;align-items:center;gap:10px;color:#6ee7b7;font-size:0.83rem; }
                .error-msg   { background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.35);border-radius:10px;padding:12px 14px;display:flex;align-items:center;gap:10px;color:#f87171;font-size:0.83rem; }
            `}</style>

            <div className="min-h-screen bg-[#0A1128] flex items-center justify-center p-4 relative overflow-hidden" style={{ fontFamily: "'Raleway',sans-serif" }}>
                {/* Stars */}
                {[{ top: "8%", left: "5%", s: 2, d: "3s", dl: "0s" }, { top: "18%", left: "92%", s: 1.5, d: "3.8s", dl: "-1s" }, { top: "75%", left: "4%", s: 2, d: "4s", dl: "-2s" }, { top: "88%", left: "90%", s: 1.5, d: "2.8s", dl: "-0.5s" }].map((s, i) => (
                    <div key={i} className="star-dot" style={{ top: s.top, left: s.left, width: s.s, height: s.s, "--dur": s.d, "--delay": s.dl } as React.CSSProperties} />
                ))}

                {/* Card */}
                <div className="auth-card" style={cardStyle}>

                    {/* Orbit */}
                    <div style={{ position: "absolute", top: -40, right: -40, opacity: 0.4, pointerEvents: "none" }}>
                        <div className="orbit-ring"><div className="orbit-dot" /></div>
                    </div>

                    <div className="">

                        {/* Logo + back */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                            <Link to="/"><img src={PlanetariumLogo} alt="Planetarium logo" style={{ width: 56, height: 56, objectFit: "cover" }} /></Link>
                            <Link to="/login" className="link-subtle">← Back to login</Link>
                        </div>

                        {/* Header */}
                        <div style={{ marginBottom: 24 }}>
                            <h1 style={{ fontFamily: "'Raleway', sans-serif", fontSize: "1.6rem", fontWeight: 900, color: "#fff", letterSpacing: "0.03em", marginBottom: 6 }}>
                                Reset <span style={{ color: "#219EBC" }}>Password</span>
                            </h1>
                            <p style={{ color: "rgba(182,194,226,0.6)", fontSize: "0.83rem", fontWeight: 300 }}>
                                {step === "email" && "Enter your email to receive a verification code."}
                                {step === "otp" && `We sent a 6-digit code to ${email}.`}
                                {step === "password" && "Choose a strong new password for your account."}
                            </p>
                        </div>

                        {/* Step indicator */}
                        <div style={{ display: "flex", alignItems: "center", marginBottom: 28 }}>
                            {steps.map((s, i) => (
                                <React.Fragment key={s.key}>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                                        <div className={`step-node ${i < stepIndex ? "done" : i === stepIndex ? "active" : "pending"}`}>
                                            {i < stepIndex ? <CheckCircle size={16} /> : s.icon}
                                        </div>
                                        <span style={{ fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: i === stepIndex ? "#219EBC" : "rgba(182,194,226,0.35)", fontWeight: 600 }}>
                                            {s.label}
                                        </span>
                                    </div>
                                    {i < steps.length - 1 && (
                                        <div className={`step-connector ${i < stepIndex ? "done" : "pending"}`} style={{ marginBottom: 18 }} />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Alerts */}
                        {success && <div className="success-msg" style={{ marginBottom: 16 }}><CheckCircle size={16} />{success}</div>}
                        {error && <div className="error-msg" style={{ marginBottom: 16 }}><XCircle size={16} />{error}</div>}

                        {/* Step content */}
                        <div className="step-content" key={step}>

                            {/* Step 1 — Email */}
                            {step === "email" && (
                                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                    <div className="field-group">
                                        <label className={`field-label ${focusedField === "email" ? "focused" : ""}`}>Email Address</label>
                                        <input
                                            type="email" value={email}
                                            onChange={e => { setEmail(e.target.value); clearMessages(); }}
                                            onFocus={() => setFocusedField("email")}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="example@gmail.com"
                                            className="field-input"
                                        />
                                    </div>
                                    <button onClick={handleSendOtp} disabled={loading} className="submit-btn">
                                        {loading ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />Sending...</> : "Send OTP"}
                                    </button>
                                </div>
                            )}

                            {/* Step 2 — OTP */}
                            {step === "otp" && (
                                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                    <div className="field-group">
                                        <label className={`field-label ${focusedField === "otp" ? "focused" : ""}`}>Verification Code</label>
                                        <input
                                            type="text" value={otp}
                                            onChange={e => { setOtp(e.target.value.replace(/\D/g, "").slice(0, 6)); clearMessages(); }}
                                            onFocus={() => setFocusedField("otp")}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="– – – – – –"
                                            maxLength={6}
                                            className="field-input otp-input"
                                        />
                                        <span style={{ fontSize: "0.72rem", color: "rgba(182,194,226,0.45)", textAlign: "center" }}>
                                            Code expires in 10 minutes
                                        </span>
                                    </div>
                                    <button onClick={handleVerifyOtp} disabled={loading} className="submit-btn">
                                        {loading ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />Verifying...</> : "Verify Code"}
                                    </button>
                                    <button className="ghost-btn" onClick={() => { setStep("email"); setOtp(""); clearMessages(); }}>
                                        ← Use a different email / resend OTP
                                    </button>
                                </div>
                            )}

                            {/* Step 3 — New Password */}
                            {step === "password" && (
                                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                    {[
                                        { id: "new", label: "New Password", val: newPassword, setVal: setNewPassword, show: showPassword, toggle: () => setShowPassword(!showPassword), placeholder: "Min. 6 characters" },
                                        { id: "confirm", label: "Confirm Password", val: confirmPassword, setVal: setConfirmPassword, show: showConfirmPassword, toggle: () => setShowConfirmPassword(!showConfirmPassword), placeholder: "Re-enter new password" },
                                    ].map(f => (
                                        <div key={f.id} className="field-group">
                                            <label className={`field-label ${focusedField === f.id ? "focused" : ""}`}>{f.label}</label>
                                            <div style={{ position: "relative" }}>
                                                <input
                                                    type={f.show ? "text" : "password"}
                                                    value={f.val}
                                                    onChange={e => { f.setVal(e.target.value); clearMessages(); }}
                                                    onFocus={() => setFocusedField(f.id)}
                                                    onBlur={() => setFocusedField(null)}
                                                    placeholder={f.placeholder}
                                                    className="field-input"
                                                    style={{ paddingRight: 44 }}
                                                />
                                                <button type="button" className="eye-btn" onClick={f.toggle} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)" }}>
                                                    {f.show ? <Eye size={18} /> : <EyeOff size={18} />}
                                                </button>
                                            </div>
                                            {/* Match indicator for confirm field */}
                                            {f.id === "confirm" && confirmPassword && (
                                                <span style={{ fontSize: "0.72rem", paddingLeft: 4, color: confirmPassword === newPassword ? "#6ee7b7" : "#f87171" }}>
                                                    {confirmPassword === newPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                    <button onClick={handleResetPassword} disabled={loading} className="submit-btn" style={{ marginTop: 4 }}>
                                        {loading ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />Updating...</> : "Update Password"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgotPasswordPage;