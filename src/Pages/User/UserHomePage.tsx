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
                    <h1 style={{ fontFamily: "'Raleway', sans-serif", fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 900, color: '#fff', letterSpacing: '0.04em', margin: '0 0 8px' }}>
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