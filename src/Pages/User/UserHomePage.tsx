import React, { useState, useEffect } from "react";
import { Calendar, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';
import UserNavbar from "../../components/UserNavbar.tsx";

const cards = [
    {
        to: "/show-availability",
        icon: Calendar,
        iconColor: "#219EBC",
        title: "Show Availability",
        description: "Browse available dates and show times with language options. Perfect for planning your first visit or checking upcoming available slots.",
        features: [
            "View calendar of available dates",
            "Check show times (10:00 AM & 01:00 PM)",
            "See language medium options",
            "Real-time seat availability",
        ],
        btnLabel: "View Show Availability",
        btnGradient: "linear-gradient(135deg,#219EBC,#126782)",
        btnHover: "linear-gradient(135deg,#27b8dc,#1a88a8)",
        accentColor: "rgba(33,158,188,0.7)",
        glowColor: "rgba(33,158,188,0.2)",
    },
    {
        to: "/select-datetime",
        icon: Ticket,
        iconColor: "#27b8dc",
        title: "Book Now",
        description: "Ready to secure your seat? Start the complete booking process with our simple, step-by-step flow — from session selection to payment confirmation.",
        features: [
            "Select scheduled session (date, time, content, language)",
            "Choose your preferred seats",
            "Review booking details and pricing",
            "Complete secure payment and receive confirmation",
        ],
        btnLabel: "Start Booking",
        btnGradient: "linear-gradient(135deg,#126782,#0a3d52)",
        btnHover: "linear-gradient(135deg,#219EBC,#126782)",
        accentColor: "rgba(33,158,188,0.5)",
        glowColor: "rgba(33,158,188,0.15)",
    },
];

const UserLandingPage: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    useEffect(() => {
        requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    }, []);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Raleway:wght@300;400;600&display=swap');

                @keyframes nebulaDrift { 0%{transform:translate(0,0) scale(1)} 33%{transform:translate(22px,-16px) scale(1.04)} 66%{transform:translate(-16px,12px) scale(0.97)} 100%{transform:translate(0,0) scale(1)} }
                @keyframes twinkle     { 0%,100%{opacity:0.2} 50%{opacity:0.85} }
                @keyframes shootAcross { 0%{transform:translate(0,0) scaleX(1);opacity:0.9} 100%{transform:translate(320px,160px) scaleX(0);opacity:0} }
                @keyframes lineExpand  { from{width:0;opacity:0} to{width:60px;opacity:1} }
                @keyframes btnGlow     { 0%,100%{box-shadow:0 0 12px rgba(33,158,188,0.35)} 50%{box-shadow:0 0 26px rgba(33,158,188,0.65)} }
                @keyframes floatUp     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }

                .nebula-blob { position:fixed;border-radius:50%;filter:blur(88px);pointer-events:none;z-index:0;animation:nebulaDrift 22s ease-in-out infinite; }
                .star-dot    { position:fixed;border-radius:50%;background:rgba(210,235,255,0.9);pointer-events:none;z-index:0;animation:twinkle var(--dur,3s) ease-in-out infinite;animation-delay:var(--delay,0s); }
                .shooting    { position:fixed;height:1.5px;background:linear-gradient(90deg,transparent,rgba(180,230,255,0.75),transparent);border-radius:2px;opacity:0;pointer-events:none;z-index:0;animation:shootAcross 3.2s ease-in infinite; }

                .plan-card {
                    background: rgba(10,18,44,0.80);
                    border: 1px solid rgba(33,158,188,0.2);
                    border-radius: 22px;
                    padding: 36px 32px;
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    position: relative;
                    overflow: hidden;
                    transition: transform 0.35s cubic-bezier(.22,1,.36,1),
                                border-color 0.3s,
                                box-shadow 0.35s;
                    display: flex;
                    flex-direction: column;
                }
                .plan-card::before {
                    content:'';position:absolute;top:0;left:0;right:0;height:1px;
                    background:linear-gradient(90deg,transparent,rgba(33,158,188,0.4),transparent);
                }
                .plan-card:hover {
                    transform: translateY(-8px);
                    border-color: rgba(33,158,188,0.55);
                }

                .icon-box {
                    width:60px;height:60px;border-radius:16px;
                    display:flex;align-items:center;justify-content:center;
                    background:rgba(33,158,188,0.1);
                    border:1px solid rgba(33,158,188,0.25);
                    margin-bottom:22px;
                    transition:background 0.3s,border-color 0.3s,transform 0.3s;
                }
                .plan-card:hover .icon-box {
                    background:rgba(33,158,188,0.2);
                    border-color:rgba(33,158,188,0.55);
                    transform:scale(1.08) rotate(-4deg);
                }

                .feature-dot {
                    width:6px;height:6px;border-radius:50%;
                    background:#219EBC;flex-shrink:0;
                    box-shadow:0 0 6px rgba(33,158,188,0.6);
                    transition:transform 0.2s;
                }
                .plan-card:hover .feature-dot { transform:scale(1.3); }

                .plan-btn {
                    display:block;width:100%;text-align:center;
                    padding:13px 24px;border-radius:40px;
                    color:#fff;font-family:'Raleway',sans-serif;font-weight:600;
                    font-size:0.83rem;letter-spacing:0.14em;text-transform:uppercase;
                    text-decoration:none;
                    transition:transform 0.22s cubic-bezier(.22,1,.36,1),box-shadow 0.22s;
                    animation:btnGlow 3.5s ease-in-out infinite;
                    margin-top:auto;
                }
                .plan-btn:hover {
                    transform:translateY(-2px) scale(1.03);
                    animation:none;
                }

                .divider-line {
                    display:inline-block;height:1px;
                    background:linear-gradient(90deg,transparent,rgba(33,158,188,0.7),transparent);
                    animation:lineExpand 1s cubic-bezier(.22,1,.36,1) 0.5s both;
                    width:60px;
                }
                .eyebrow {
                    font-family:'Raleway',sans-serif;font-size:0.68rem;letter-spacing:0.28em;
                    text-transform:uppercase;color:#219EBC;
                    border:1px solid rgba(33,158,188,0.35);border-radius:40px;
                    padding:4px 16px;display:inline-block;margin-bottom:14px;
                    background:rgba(33,158,188,0.07);
                }
            `}</style>

            <div
                style={{
                    minHeight: '100vh', position: 'relative', overflow: 'hidden',
                    background: '#0A1128', fontFamily: "'Raleway',sans-serif",
                    display: 'flex', flexDirection: 'column',
                    backgroundImage: "linear-gradient(rgba(10,17,40,0.65),rgba(10,17,40,0.85)),url('/src/assets/planetarium-AI.png')",
                    backgroundSize: 'cover', backgroundPosition: 'center',
                }}
            >
                {/* Nebula blobs */}
                <div className="nebula-blob" style={{ width: 460, height: 360, top: '-8%', left: '-6%', background: 'rgba(33,158,188,0.08)', animationDelay: '0s' }} />
                <div className="nebula-blob" style={{ width: 380, height: 300, bottom: '0', right: '-5%', background: 'rgba(18,103,130,0.1)', animationDelay: '-9s' }} />

                {/* Stars */}
                {[
                    { top: '6%', left: '4%', s: 2, dur: '3s', dl: '0s' },
                    { top: '15%', left: '93%', s: 1.5, dur: '3.8s', dl: '-1s' },
                    { top: '70%', left: '3%', s: 2, dur: '4.1s', dl: '-2s' },
                    { top: '85%', left: '92%', s: 1.5, dur: '2.7s', dl: '-0.5s' },
                    { top: '45%', left: '97%', s: 1, dur: '3.4s', dl: '-1.5s' },
                ].map((s, i) => (
                    <div key={i} className="star-dot" style={{ top: s.top, left: s.left, width: s.s, height: s.s, '--dur': s.dur, '--delay': s.dl } as React.CSSProperties} />
                ))}

                {/* Navbar */}
                <div style={{ position: 'relative', zIndex: 10 }}>
                    <UserNavbar />
                </div>

                {/* Hero heading */}
                <div
                    style={{
                        textAlign: 'center',
                        marginTop: 80, marginBottom: 48,
                        position: 'relative', zIndex: 10,
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0)' : 'translateY(-24px)',
                        transition: 'opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1)',
                    }}
                >
                    <h1 style={{ fontFamily: "'Cinzel',serif", fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 900, color: '#fff', letterSpacing: '0.04em', margin: '0 0 8px' }}>
                        Plan Your <span style={{ color: '#219EBC' }}>Visit</span>
                    </h1>
                    <p style={{ color: 'rgba(203,213,225,0.8)', fontSize: '1rem', fontWeight: 300, maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
                        Choose the best way to explore our planetarium shows
                    </p>
                </div>

                {/* Cards */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
                        gap: 28,
                        maxWidth: 900,
                        width: '100%',
                        margin: '0 auto',
                        padding: '0 20px 60px',
                        position: 'relative',
                        zIndex: 10,
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0)' : 'translateY(32px)',
                        transition: 'opacity 0.7s cubic-bezier(.22,1,.36,1) 0.2s, transform 0.7s cubic-bezier(.22,1,.36,1) 0.2s',
                    }}
                >
                    {cards.map((card, idx) => {
                        const Icon = card.icon;
                        const isHovered = hoveredCard === idx;
                        return (
                            <div
                                key={idx}
                                className="plan-card"
                                style={{
                                    boxShadow: isHovered
                                        ? `0 20px 60px ${card.glowColor}, 0 0 0 1px ${card.accentColor}`
                                        : '0 8px 32px rgba(0,0,0,0.4)',
                                }}
                                onMouseEnter={() => setHoveredCard(idx)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                {/* Accent bar */}
                                <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: isHovered ? 4 : 2, borderRadius: '3px 0 0 3px', background: card.iconColor, transition: 'width 0.3s' }} />

                                <div className="icon-box">
                                    <Icon size={26} color={card.iconColor} />
                                </div>

                                <h3 style={{ fontFamily: "'Cinzel',serif", fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: 12, letterSpacing: '0.03em' }}>
                                    {card.title}
                                </h3>

                                <p style={{ color: 'rgba(182,194,226,0.75)', fontSize: '0.875rem', lineHeight: 1.75, fontWeight: 300, marginBottom: 20 }}>
                                    {card.description}
                                </p>

                                {/* Feature list */}
                                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {card.features.map((feat, i) => (
                                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.82rem', color: 'rgba(182,194,226,0.8)' }}>
                                            <span className="feature-dot" />
                                            {feat}
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    to={card.to}
                                    className="plan-btn"
                                    style={{
                                        background: isHovered ? card.btnHover : card.btnGradient,
                                        boxShadow: isHovered ? `0 8px 28px ${card.glowColor}` : undefined,
                                    }}
                                >
                                    {card.btnLabel}
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default UserLandingPage;