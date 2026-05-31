import React, { useState, useEffect, useRef } from 'react';
import { Mail, Phone, Hash, Twitter, Instagram, Facebook, Loader2, CheckCircle } from 'lucide-react';
import api from '../../services/api.ts';
import UserNavbar from '../../components/UserNavbar.tsx';

const ContactUsPage: React.FC = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [focused, setFocused] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const [contentVisible, setContentVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 80);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        if (!contentRef.current) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setContentVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
        obs.observe(contentRef.current);
        return () => obs.disconnect();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError(null);
    };

    const handleSubmit = async () => {
        if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
            setError('Please fill in all fields.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await api.post('/contact', formData);
            setSubmitted(true);
            setFormData({ name: '', email: '', message: '' });
        } catch (err: any) {
            setError(err?.response?.data?.message ?? 'Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Raleway:wght@300;400;600&display=swap');

                @keyframes fadeSlideDown  { from { opacity:0; transform:translateY(-28px); } to { opacity:1; transform:translateY(0); } }
                @keyframes fadeSlideUp    { from { opacity:0; transform:translateY(36px); }  to { opacity:1; transform:translateY(0); } }
                @keyframes fadeSlideLeft  { from { opacity:0; transform:translateX(-40px); } to { opacity:1; transform:translateX(0); } }
                @keyframes fadeSlideRight { from { opacity:0; transform:translateX(40px); }  to { opacity:1; transform:translateX(0); } }
                @keyframes nebulaDrift    { 0% { transform:translate(0,0) scale(1); } 33% { transform:translate(25px,-18px) scale(1.04); } 66% { transform:translate(-18px,14px) scale(0.97); } 100% { transform:translate(0,0) scale(1); } }
                @keyframes twinkle        { 0%,100% { opacity:0.3; } 50% { opacity:1; } }
                @keyframes lineExpand     { from { width:0; opacity:0; } to { width:64px; opacity:1; } }
                @keyframes successIn      { from { opacity:0; transform:scale(0.92) translateY(-8px); } to { opacity:1; transform:scale(1) translateY(0); } }
                @keyframes checkDraw      { from { stroke-dashoffset:30; } to { stroke-dashoffset:0; } }
                @keyframes btnShimmer     { 0%,100% { box-shadow:0 0 14px rgba(33,158,188,0.4); } 50% { box-shadow:0 0 28px rgba(33,158,188,0.75),0 4px 20px rgba(33,158,188,0.3); } }
                @keyframes socialFloat    { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-4px); } }

                .anim-enter { opacity:0; }
                .anim-fade-down  { animation: fadeSlideDown  0.8s cubic-bezier(.22,1,.36,1) forwards; }
                .anim-fade-left  { animation: fadeSlideLeft  0.85s cubic-bezier(.22,1,.36,1) forwards; }
                .anim-fade-right { animation: fadeSlideRight 0.85s cubic-bezier(.22,1,.36,1) forwards; }

                .nebula-blob { position:fixed; border-radius:50%; filter:blur(90px); pointer-events:none; z-index:0; animation:nebulaDrift 20s ease-in-out infinite; }
                .star-dot { position:fixed; border-radius:50%; background:rgba(200,230,255,0.9); pointer-events:none; z-index:0; animation:twinkle var(--dur,3s) ease-in-out infinite; animation-delay:var(--delay,0s); }
                .divider-line { display:inline-block; height:1px; background:linear-gradient(90deg,transparent,rgba(33,158,188,0.7),transparent); animation:lineExpand 1s cubic-bezier(.22,1,.36,1) 0.5s both; width:64px; }
                .eyebrow { font-family:'Raleway',sans-serif; font-size:0.68rem; letter-spacing:0.28em; text-transform:uppercase; color:#219EBC; border:1px solid rgba(33,158,188,0.35); border-radius:40px; padding:4px 16px; display:inline-block; margin-bottom:16px; background:rgba(33,158,188,0.07); }

                /* Glass card */
                .glass-card {
                    background: rgba(15,24,52,0.72);
                    border: 1px solid rgba(33,158,188,0.25);
                    border-radius: 20px; padding: 32px;
                    backdrop-filter: blur(10px);
                    transition: border-color 0.3s, box-shadow 0.3s;
                }
                .glass-card:hover {
                    border-color: rgba(33,158,188,0.5);
                    box-shadow: 0 8px 40px rgba(33,158,188,0.12);
                }

                /* Input field */
                .field-wrap { position: relative; }
                .field-label {
                    font-family: 'Raleway', sans-serif; font-weight: 600;
                    color: #fff; font-size: 0.9rem; letter-spacing: 0.06em;
                    margin-bottom: 8px; display: block;
                    transition: color 0.2s;
                }
                .field-label.focused { color: #219EBC; }
                .field-input {
                    width: 100%; padding: 12px 16px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 10px; color: #fff;
                    font-family: 'Raleway', sans-serif; font-size: 0.9rem;
                    transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
                    outline: none; box-sizing: border-box;
                }
                .field-input::placeholder { color: rgba(203,213,225,0.35); }
                .field-input:focus {
                    border-color: rgba(33,158,188,0.7);
                    box-shadow: 0 0 0 3px rgba(33,158,188,0.12);
                    background: rgba(33,158,188,0.06);
                }
                .field-input:hover:not(:focus) { border-color: rgba(33,158,188,0.35); }

                /* Submit button */
                .submit-btn {
                    width: 100%; padding: 14px;
                    background: linear-gradient(135deg, #219EBC 0%, #126782 100%);
                    color: #fff; border: none; border-radius: 40px;
                    font-family: 'Raleway', sans-serif; font-weight: 600;
                    font-size: 0.85rem; letter-spacing: 0.16em; text-transform: uppercase;
                    cursor: pointer;
                    transition: transform 0.22s cubic-bezier(.22,1,.36,1), box-shadow 0.22s, background 0.3s;
                    animation: btnShimmer 3.5s ease-in-out infinite;
                    display: flex; align-items: center; justify-content: center; gap: 8px;
                }
                .submit-btn:hover:not(:disabled) {
                    transform: translateY(-2px) scale(1.02);
                    box-shadow: 0 8px 28px rgba(33,158,188,0.5);
                    background: linear-gradient(135deg, #27b8dc 0%, #1a88a8 100%);
                    animation: none;
                }
                .submit-btn:active:not(:disabled) { transform: scale(0.98); }
                .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; animation: none; }

                /* Success banner */
                .success-banner {
                    background: rgba(33,158,188,0.1);
                    border: 1px solid rgba(33,158,188,0.35);
                    border-radius: 12px; padding: 16px 18px;
                    display: flex; align-items: flex-start; gap: 12px;
                    animation: successIn 0.5s cubic-bezier(.22,1,.36,1) forwards;
                }

                /* Contact info rows */
                .contact-row {
                    display: flex; align-items: flex-start; gap: 16px;
                    padding: 16px 0; border-bottom: 1px solid rgba(33,158,188,0.1);
                    transition: padding-left 0.25s;
                }
                .contact-row:last-of-type { border-bottom: none; }
                .contact-row:hover { padding-left: 6px; }
                .contact-icon-box {
                    width: 44px; height: 44px; flex-shrink: 0;
                    border: 1px solid rgba(33,158,188,0.4); border-radius: 10px;
                    display: flex; align-items: center; justify-content: center;
                    background: rgba(33,158,188,0.08);
                    transition: background 0.25s, border-color 0.25s, box-shadow 0.25s;
                }
                .contact-row:hover .contact-icon-box {
                    background: rgba(33,158,188,0.2);
                    border-color: rgba(33,158,188,0.7);
                    box-shadow: 0 0 16px rgba(33,158,188,0.3);
                }

                /* Social buttons */
                .social-btn {
                    width: 44px; height: 44px; border-radius: 50%;
                    border: 1px solid rgba(255,255,255,0.25);
                    display: flex; align-items: center; justify-content: center;
                    background: transparent; color: white; cursor: pointer;
                    transition: background 0.25s, border-color 0.25s, transform 0.25s, box-shadow 0.25s;
                    text-decoration: none;
                }
                .social-btn:hover {
                    background: #219EBC; border-color: #219EBC;
                    transform: translateY(-4px) scale(1.1);
                    box-shadow: 0 6px 20px rgba(33,158,188,0.5);
                    animation: none;
                }
                .social-btn:nth-child(1) { animation: socialFloat 3s ease-in-out infinite; }
                .social-btn:nth-child(2) { animation: socialFloat 3s ease-in-out 0.4s infinite; }
                .social-btn:nth-child(3) { animation: socialFloat 3s ease-in-out 0.8s infinite; }
                .social-btn:hover { animation: none !important; }

                a.link-hover { color: rgba(203,213,225,0.75); text-decoration:none; font-size:0.9rem; transition: color 0.2s; }
                a.link-hover:hover { color: #219EBC; }
            `}</style>

            <div className="min-h-screen bg-[#0A1128] relative overflow-x-hidden" style={{ fontFamily: "'Raleway', sans-serif" }}>

                {/* Nebula blobs */}
                <div className="nebula-blob" style={{ width: 440, height: 360, top: "-8%", left: "-5%", background: "rgba(33,158,188,0.08)", animationDelay: "0s" }} />
                <div className="nebula-blob" style={{ width: 360, height: 300, bottom: "5%", right: "-5%", background: "rgba(18,103,130,0.1)", animationDelay: "-9s" }} />

                {/* Star dots */}
                {[
                    { top: "10%", left: "6%", size: 2, dur: "3s", delay: "0s" },
                    { top: "22%", left: "93%", size: 1.5, dur: "3.8s", delay: "-1.2s" },
                    { top: "65%", left: "4%", size: 2, dur: "4.2s", delay: "-2s" },
                    { top: "82%", left: "90%", size: 1.5, dur: "2.8s", delay: "-0.7s" },
                ].map((s, i) => (
                    <div key={i} className="star-dot" style={{ top: s.top, left: s.left, width: s.size, height: s.size, "--dur": s.dur, "--delay": s.delay } as React.CSSProperties} />
                ))}

                {/* Navbar */}
                <div className="relative z-20 w-full">
                    <UserNavbar />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto pt-14 pb-8">

                    {/* Header */}
                    <div className={`text-center mb-10 anim-enter ${mounted ? "anim-fade-down" : ""}`}>
                        <h1 style={{ fontFamily: "'Raleway', sans-serif", fontSize: "clamp(2.4rem, 6vw, 4.5rem)", fontWeight: 900, color: "#fff", letterSpacing: "0.04em" }}>
                            Contact <span style={{ color: "#219EBC" }}>Us</span>
                        </h1>
                        <p style={{ color: "rgba(203,213,225,0.8)", fontSize: "1rem", fontWeight: 300 }}>
                            We're here to help! Reach out with any questions or feedback.
                        </p>
                    </div>

                    {/* Cards grid */}
                    <div ref={contentRef} className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">

                        {/* Form card */}
                        <div className={`glass-card anim-enter ${contentVisible ? "anim-fade-left" : ""}`} style={{ animationDelay: "0.1s" }}>

                            {submitted && (
                                <div className="success-banner mb-6">
                                    <CheckCircle size={20} style={{ color: "#219EBC", flexShrink: 0, marginTop: 2 }} />
                                    <div>
                                        <p style={{ color: "#219EBC", fontWeight: 600, marginBottom: 4 }}>Message Sent!</p>
                                        <p style={{ color: "rgba(203,213,225,0.8)", fontSize: "0.85rem" }}>Thank you for reaching out. We'll get back to you as soon as possible.</p>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, color: "#f87171", fontSize: "0.85rem" }}>
                                    {error}
                                </div>
                            )}

                            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

                                {(['name', 'email'] as const).map(field => (
                                    <div key={field} className="field-wrap">
                                        <label className={`field-label ${focused === field ? 'focused' : ''}`} htmlFor={field}>
                                            {field.charAt(0).toUpperCase() + field.slice(1)}
                                        </label>
                                        <input
                                            id={field} name={field} type={field === 'email' ? 'email' : 'text'}
                                            value={formData[field]}
                                            onChange={handleChange}
                                            onFocus={() => setFocused(field)}
                                            onBlur={() => setFocused(null)}
                                            placeholder={`Enter your ${field}`}
                                            className="field-input"
                                        />
                                    </div>
                                ))}

                                <div className="field-wrap">
                                    <label className={`field-label ${focused === 'message' ? 'focused' : ''}`} htmlFor="message">Message</label>
                                    <textarea
                                        id="message" name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        onFocus={() => setFocused('message')}
                                        onBlur={() => setFocused(null)}
                                        placeholder="Enter your message"
                                        rows={7}
                                        className="field-input"
                                        style={{ resize: "none" }}
                                    />
                                </div>

                                <button onClick={handleSubmit} disabled={loading} className="submit-btn">
                                    {loading ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Sending...</> : 'Send Message'}
                                </button>
                            </div>
                        </div>

                        {/* Info card */}
                        <div className={`glass-card anim-enter ${contentVisible ? "anim-fade-right" : ""}`} style={{ animationDelay: "0.2s" }}>
                            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.5rem", fontWeight: 700, color: "#fff", marginBottom: 28, textAlign: "center" }}>
                                Other Ways to <span style={{ color: "#219EBC" }}>Reach Us</span>
                            </h2>

                            <div>
                                <div className="contact-row">
                                    <div className="contact-icon-box"><Mail size={20} color="#219EBC" /></div>
                                    <div>
                                        <p style={{ color: "#fff", fontWeight: 600, marginBottom: 4, fontSize: "0.95rem" }}>Email</p>
                                        <a href="mailto:srilanka.smartplanetarium@gmail.com" className="link-hover">
                                            srilanka.smartplanetarium@gmail.com
                                        </a>
                                    </div>
                                </div>

                                <div className="contact-row">
                                    <div className="contact-icon-box"><Phone size={20} color="#219EBC" /></div>
                                    <div>
                                        <p style={{ color: "#fff", fontWeight: 600, marginBottom: 4, fontSize: "0.95rem" }}>Phone</p>
                                        <a href="tel:+94111234567" className="link-hover">+94 11 123 4567</a>
                                    </div>
                                </div>

                                <div className="contact-row">
                                    <div className="contact-icon-box"><Hash size={20} color="#219EBC" /></div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ color: "#fff", fontWeight: 600, marginBottom: 4, fontSize: "0.95rem" }}>Social Media</p>
                                        <p style={{ color: "rgba(203,213,225,0.65)", fontSize: "0.82rem", marginBottom: 16 }}>Connect with us on social media</p>
                                        <div style={{ display: "flex", gap: 12 }}>
                                            {[
                                                { Icon: Twitter, label: "Twitter" },
                                                { Icon: Instagram, label: "Instagram" },
                                                { Icon: Facebook, label: "Facebook" },
                                            ].map(({ Icon, label }) => (
                                                <a key={label} href="#" className="social-btn" aria-label={label}>
                                                    <Icon size={18} />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Map placeholder */}
                            <div style={{
                                marginTop: 24, borderRadius: 12, overflow: "hidden",
                                border: "1px solid rgba(33,158,188,0.2)", height: 140,
                                background: "rgba(33,158,188,0.05)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                flexDirection: "column", gap: 8, cursor: "pointer",
                                transition: "background 0.25s, border-color 0.25s"
                            }}
                                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(33,158,188,0.1)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(33,158,188,0.45)"; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(33,158,188,0.05)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(33,158,188,0.2)"; }}
                            >
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#219EBC" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                <span style={{ color: "rgba(203,213,225,0.6)", fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Colombo, Sri Lanka</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactUsPage;