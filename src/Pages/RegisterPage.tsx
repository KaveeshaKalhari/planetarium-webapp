import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import PlanetariumLogo from "../assets/PlanetariumLogo.png";
import { Link, useNavigate } from "react-router-dom";
import { signUp, googleAuth } from '../services/api';
import { type CredentialResponse, GoogleLogin } from "@react-oauth/google";

const SignUpPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [focused, setFocused] = useState({ username: false, email: false, password: false });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [errors, setErrors] = useState({ username: '', email: '', password: '' });
    const [visible, setVisible] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    useEffect(() => {
        // Use two ticks to ensure DOM is ready before triggering transition
        requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    }, []);

    const getPasswordStrength = (pw: string) => {
        let score = 0;
        if (pw.length >= 8) score++;
        if (/[A-Z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;
        return score;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
        setError('');
        if (name === 'password') setPasswordStrength(getPasswordStrength(value));
    };

    const validateForm = () => {
        const newErrors = { username: '', email: '', password: '' };
        if (!formData.username.trim()) newErrors.username = 'Username is required';
        else if (formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters';
        else if (formData.username.length > 50) newErrors.username = 'Username must be less than 50 characters';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email format';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
        setErrors(newErrors);
        return !newErrors.username && !newErrors.email && !newErrors.password;
    };

    const handleSignUp = async () => {
        setError(''); setSuccess('');
        if (!validateForm()) return;
        setLoading(true);
        try {
            const response = await signUp(formData);
            if (response.success) {
                if (response.token) localStorage.setItem('authToken', response.token);
                if (response.user) localStorage.setItem('user', JSON.stringify(response.user));
                setSuccess('Account created successfully! Redirecting...');
                setFormData({ username: '', email: '', password: '' });
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(response.message || 'Registration failed. Please try again.');
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
                setSuccess('Google sign up successful! Redirecting...');
                setTimeout(() => navigate('/login'), 1000);
            } else { setError(response.message || 'Google authentication failed'); }
        } catch { setError('An unexpected error occurred with Google sign up.'); }
        finally { setLoading(false); }
    };

    const strengthColors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e'];
    const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

    const fields = [
        { name: 'username' as const, label: 'Username', type: 'text', placeholder: 'cosmicexplorer42', icon: <User size={16} /> },
        { name: 'email' as const, label: 'Email', type: 'email', placeholder: 'example@gmail.com', icon: <Mail size={16} /> },
        { name: 'password' as const, label: 'Password', type: 'password', placeholder: '••••••••', icon: <Lock size={16} /> },
    ];

    // Inline transition styles — reliable across all browsers
    const cardStyle: React.CSSProperties = {
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1) translateY(0)' : 'scale(0.94) translateY(20px)',
        transition: 'opacity 0.65s cubic-bezier(.22,1,.36,1), transform 0.65s cubic-bezier(.22,1,.36,1)',
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Raleway:wght@300;400;600&display=swap');

                @keyframes nebulaDrift { 0%{transform:translate(0,0) scale(1)} 33%{transform:translate(22px,-16px) scale(1.04)} 66%{transform:translate(-16px,12px) scale(0.97)} 100%{transform:translate(0,0) scale(1)} }
                @keyframes twinkle     { 0%,100%{opacity:0.2} 50%{opacity:0.85} }
                @keyframes cardGlow    { 0%,100%{box-shadow:0 0 0 1px rgba(33,158,188,0.15),0 24px 64px rgba(0,0,0,0.5)} 50%{box-shadow:0 0 0 1px rgba(33,158,188,0.35),0 24px 64px rgba(0,0,0,0.5),0 0 40px rgba(33,158,188,0.08)} }
                @keyframes btnGlow     { 0%,100%{box-shadow:0 0 14px rgba(33,158,188,0.35)} 50%{box-shadow:0 0 28px rgba(33,158,188,0.7),0 4px 20px rgba(33,158,188,0.25)} }
                @keyframes orbitSpin   { from{transform:rotate(0deg) translateX(110px) rotate(0deg)} to{transform:rotate(360deg) translateX(110px) rotate(-360deg)} }
                @keyframes shootAcross { 0%{transform:translate(0,0) scaleX(1);opacity:0.9} 100%{transform:translate(320px,160px) scaleX(0);opacity:0} }

                .nebula-blob { position:fixed;border-radius:50%;filter:blur(85px);pointer-events:none;z-index:0;animation:nebulaDrift 22s ease-in-out infinite; }
                .star-dot    { position:fixed;border-radius:50%;background:rgba(210,235,255,0.95);pointer-events:none;z-index:0;animation:twinkle var(--dur,3s) ease-in-out infinite;animation-delay:var(--delay,0s); }

                .auth-card {
                    background: rgba(10,18,44,0.90);
                    border: 1px solid rgba(33,158,188,0.22);
                    border-radius: 26px;
                    padding: 32px;
                    width: 100%;
                    max-width: 420px;
                    backdrop-filter: blur(18px);
                    -webkit-backdrop-filter: blur(18px);
                    animation: cardGlow 5s ease-in-out infinite;
                    position: relative;
                    overflow: hidden;
                    z-index: 10;
                }
                .auth-card::before {
                    content:'';position:absolute;top:0;left:0;right:0;height:1px;
                    background:linear-gradient(90deg,transparent,rgba(33,158,188,0.55),transparent);
                }

                .orbit-ring { position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:220px;height:220px;border-radius:50%;border:1px solid rgba(33,158,188,0.07);pointer-events:none; }
                .orbit-dot  { position:absolute;width:6px;height:6px;background:#219EBC;border-radius:50%;box-shadow:0 0 10px #219EBC,0 0 20px rgba(33,158,188,0.5);animation:orbitSpin 14s linear infinite;top:50%;left:50%;margin:-3px; }

                .sp-field-label {
                    font-family:'Raleway',sans-serif;font-size:0.76rem;font-weight:600;
                    letter-spacing:0.1em;text-transform:uppercase;
                    color:rgba(182,194,226,0.7);
                    transition:color 0.2s;
                    display:block;margin-bottom:7px;
                }
                .sp-field-label.sp-focused { color:#219EBC; }

                .sp-field-input {
                    width:100%;padding:11px 16px 11px 40px;box-sizing:border-box;
                    background:rgba(255,255,255,0.05);
                    border:1px solid rgba(255,255,255,0.1);
                    border-radius:10px;color:#fff;
                    font-family:'Raleway',sans-serif;font-size:0.88rem;
                    outline:none;
                    transition:border-color 0.25s,box-shadow 0.25s,background 0.25s;
                }
                .sp-field-input::placeholder { color:rgba(182,194,226,0.28); }
                .sp-field-input:focus {
                    border-color:rgba(33,158,188,0.7);
                    box-shadow:0 0 0 3px rgba(33,158,188,0.12);
                    background:rgba(33,158,188,0.06);
                }
                .sp-field-input:hover:not(:focus) { border-color:rgba(33,158,188,0.32); }
                .sp-field-input.sp-has-error { border-color:rgba(239,68,68,0.65); }
                .sp-field-input:disabled { opacity:0.5;cursor:not-allowed; }

                .sp-field-icon {
                    position:absolute;left:13px;top:50%;transform:translateY(-50%);
                    color:rgba(33,158,188,0.55);pointer-events:none;
                    transition:color 0.2s;
                }
                .sp-field-wrap:focus-within .sp-field-icon { color:#219EBC; }

                .sp-submit-btn {
                    width:100%;padding:13px;border:none;border-radius:40px;
                    background:linear-gradient(135deg,#219EBC 0%,#126782 100%);
                    color:#fff;font-family:'Raleway',sans-serif;font-weight:600;
                    font-size:0.83rem;letter-spacing:0.15em;text-transform:uppercase;
                    cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;
                    transition:transform 0.22s cubic-bezier(.22,1,.36,1),box-shadow 0.22s,background 0.3s;
                    animation:btnGlow 3.5s ease-in-out infinite;
                }
                .sp-submit-btn:hover:not(:disabled) {
                    transform:translateY(-2px) scale(1.02);
                    box-shadow:0 8px 30px rgba(33,158,188,0.5);
                    background:linear-gradient(135deg,#27b8dc 0%,#1a88a8 100%);
                    animation:none;
                }
                .sp-submit-btn:active:not(:disabled) { transform:scale(0.98); }
                .sp-submit-btn:disabled { opacity:0.55;cursor:not-allowed;animation:none; }

                .sp-eye-btn { background:none;border:none;cursor:pointer;color:rgba(182,194,226,0.45);padding:0;display:flex;align-items:center;transition:color 0.2s; }
                .sp-eye-btn:hover { color:#219EBC; }

                .sp-divider { height:1px;background:linear-gradient(90deg,transparent,rgba(33,158,188,0.28),transparent); }

                .sp-link-teal   { color:rgba(33,158,188,0.9);text-decoration:none;font-weight:600;transition:color 0.2s; }
                .sp-link-teal:hover { color:#27b8dc; }
                .sp-link-subtle { color:rgba(182,194,226,0.6);text-decoration:none;font-size:0.8rem;transition:color 0.2s; }
                .sp-link-subtle:hover { color:#219EBC; }

                .sp-success-banner { background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.35);border-radius:10px;padding:11px 14px;display:flex;align-items:center;gap:10px;color:#6ee7b7;font-size:0.82rem;margin-bottom:14px; }
                .sp-error-banner   { background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.35); border-radius:10px;padding:11px 14px;display:flex;align-items:center;gap:10px;color:#f87171;font-size:0.82rem;margin-bottom:14px; }
                .sp-field-err      { color:#f87171;font-size:0.7rem;padding-left:4px;margin-top:3px; }

                .sp-strength-bg   { height:3px;background:rgba(255,255,255,0.08);border-radius:3px;overflow:hidden;margin-top:5px; }
                .sp-strength-fill { height:100%;border-radius:3px;transition:width 0.4s ease,background 0.4s ease; }
            `}</style>

            <div style={{ minHeight: '100vh', background: '#0A1128', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, position: 'relative', overflow: 'hidden', fontFamily: "'Raleway',sans-serif" }}>

                {/* Nebula blobs */}
                <div className="nebula-blob" style={{ width: 440, height: 360, top: '-10%', left: '-8%', background: 'rgba(33,158,188,0.09)', animationDelay: '0s' }} />
                <div className="nebula-blob" style={{ width: 360, height: 300, bottom: '0', right: '-6%', background: 'rgba(18,103,130,0.1)', animationDelay: '-8s' }} />
                <div className="nebula-blob" style={{ width: 250, height: 250, top: '40%', left: '44%', background: 'rgba(33,158,188,0.05)', animationDelay: '-4s' }} />

                {/* Stars */}
                {[
                    { top: '8%', left: '5%', s: 2, dur: '3s', dl: '0s' },
                    { top: '18%', left: '93%', s: 1.5, dur: '3.8s', dl: '-1s' },
                    { top: '72%', left: '4%', s: 2, dur: '4.1s', dl: '-2s' },
                    { top: '86%', left: '91%', s: 1.5, dur: '2.7s', dl: '-0.5s' },
                    { top: '48%', left: '97%', s: 1, dur: '3.4s', dl: '-1.5s' },
                ].map((s, i) => (
                    <div key={i} className="star-dot" style={{ top: s.top, left: s.left, width: s.s, height: s.s, '--dur': s.dur, '--delay': s.dl } as React.CSSProperties} />
                ))}

                {/* Card — visibility via inline transition */}
                <div className="auth-card" style={cardStyle}>

                    <div style={{ position: 'relative', zIndex: 1 }}>

                        {/* Logo + home link */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                            <Link to="/"><img src={PlanetariumLogo} alt="Planetarium" style={{ width: 56, height: 56, objectFit: 'cover' }} /></Link>
                            <Link to="/" className="sp-link-subtle">← Home</Link>
                        </div>

                        {/* Heading */}
                        <div style={{ marginBottom: 22 }}>
                            <h1 style={{ fontFamily: "'Raleway', sans-serif", fontSize: '1.75rem', fontWeight: 900, color: '#fff', letterSpacing: '0.03em', margin: '0 0 6px' }}>
                                Join the <span style={{ color: '#219EBC' }}>Cosmos</span>
                            </h1>
                            <p style={{ color: 'rgba(182,194,226,0.6)', fontSize: '0.84rem', fontWeight: 300, margin: 0 }}>
                                Create your account and begin exploring the universe.
                            </p>
                        </div>

                        {/* Alerts */}
                        {error && <div className="sp-error-banner"><XCircle size={16} style={{ flexShrink: 0 }} />{error}</div>}
                        {success && <div className="sp-success-banner"><CheckCircle size={16} style={{ flexShrink: 0 }} />{success}</div>}

                        {/* Fields */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
                            {fields.map(field => (
                                <div key={field.name}>
                                    <label className={`sp-field-label ${focused[field.name] ? 'sp-focused' : ''}`}>{field.label}</label>
                                    <div className="sp-field-wrap" style={{ position: 'relative' }}>
                                        <span className="sp-field-icon">{field.icon}</span>
                                        <input
                                            type={field.name === 'password' ? (showPassword ? 'text' : 'password') : field.type}
                                            name={field.name}
                                            value={formData[field.name]}
                                            onChange={handleChange}
                                            onFocus={() => setFocused(f => ({ ...f, [field.name]: true }))}
                                            onBlur={() => setFocused(f => ({ ...f, [field.name]: false }))}
                                            placeholder={field.placeholder}
                                            className={`sp-field-input${errors[field.name] ? ' sp-has-error' : ''}`}
                                            style={field.name === 'password' ? { paddingRight: 44 } : {}}
                                            disabled={loading}
                                        />
                                        {field.name === 'password' && (
                                            <button type="button" className="sp-eye-btn" onClick={() => setShowPassword(!showPassword)}
                                                style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)' }}>
                                                {showPassword ? <Eye size={17} /> : <EyeOff size={17} />}
                                            </button>
                                        )}
                                    </div>
                                    {errors[field.name] && <p className="sp-field-err">{errors[field.name]}</p>}

                                    {/* Password strength meter */}
                                    {field.name === 'password' && formData.password && (
                                        <div>
                                            <div className="sp-strength-bg">
                                                <div className="sp-strength-fill" style={{ width: `${passwordStrength * 25}%`, background: strengthColors[passwordStrength] }} />
                                            </div>
                                            <span style={{ fontSize: '0.68rem', color: strengthColors[passwordStrength], paddingLeft: 2 }}>
                                                {strengthLabels[passwordStrength]}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}

                            <button onClick={handleSignUp} disabled={loading} className="sp-submit-btn" style={{ marginTop: 4 }}>
                                {loading
                                    ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />Creating Account...</>
                                    : 'Create Account'}
                            </button>
                        </div>

                        {/* Divider */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                            <div className="sp-divider" style={{ flex: 1 }} />
                            <span style={{ color: 'rgba(182,194,226,0.4)', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>or sign up with</span>
                            <div className="sp-divider" style={{ flex: 1 }} />
                        </div>

                        {/* Google */}
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => setError('Google sign up failed. Please try again.')}
                                useOneTap theme="filled_black" size="large" shape="circle"
                            />
                        </div>

                        {/* Footer */}
                        <p style={{ textAlign: 'center', color: 'rgba(182,194,226,0.5)', fontSize: '0.82rem', margin: 0 }}>
                            Already have an account?{' '}
                            <Link to="/login" className="sp-link-teal">Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignUpPage;