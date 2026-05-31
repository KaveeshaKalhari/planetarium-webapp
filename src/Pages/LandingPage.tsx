import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";

// --- Star canvas background ---
const StarField: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animFrameId: number;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        // Generate stars
        const stars = Array.from({ length: 180 }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            r: Math.random() * 1.4 + 0.3,
            alpha: Math.random(),
            speed: Math.random() * 0.004 + 0.002,
            phase: Math.random() * Math.PI * 2,
        }));

        const draw = (t: number) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (const s of stars) {
                const a = 0.4 + 0.6 * Math.abs(Math.sin(t * s.speed + s.phase));
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(180, 230, 255, ${a})`;
                ctx.fill();
            }
            animFrameId = requestAnimationFrame(draw);
        };

        animFrameId = requestAnimationFrame(draw);
        return () => {
            cancelAnimationFrame(animFrameId);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-0"
            style={{ opacity: 0.85 }}
        />
    );
};

const LandingPage: React.FC = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Trigger entrance animations after mount
        const t = setTimeout(() => setMounted(true), 80);
        return () => clearTimeout(t);
    }, []);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Raleway:wght@300;400;600&display=swap');

                /* ---- Keyframes ---- */
                @keyframes fadeSlideDown {
                    from { opacity: 0; transform: translateY(-32px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(40px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes scaleFadeIn {
                    from { opacity: 0; transform: scale(0.88); }
                    to   { opacity: 1; transform: scale(1); }
                }
                @keyframes glow-pulse {
                    0%, 100% { text-shadow: 0 0 18px rgba(33,158,188,0.45), 0 0 40px rgba(33,158,188,0.18); }
                    50%       { text-shadow: 0 0 36px rgba(33,158,188,0.85), 0 0 80px rgba(33,158,188,0.35); }
                }
                @keyframes shootAcross {
                    0%   { transform: translate(0,0) scaleX(1); opacity: 1; }
                    100% { transform: translate(520px, 260px) scaleX(0); opacity: 0; }
                }
                @keyframes orbitSlow {
                    from { transform: rotate(0deg) translateX(160px) rotate(0deg); }
                    to   { transform: rotate(360deg) translateX(160px) rotate(-360deg); }
                }
                @keyframes btnGlow {
                    0%, 100% { box-shadow: 0 0 14px rgba(33,158,188,0.5), 0 0 30px rgba(33,158,188,0.18); }
                    50%       { box-shadow: 0 0 28px rgba(33,158,188,0.9), 0 0 60px rgba(33,158,188,0.35); }
                }
                @keyframes nebulaDrift {
                    0%   { transform: translate(0, 0) scale(1); }
                    33%  { transform: translate(30px, -20px) scale(1.04); }
                    66%  { transform: translate(-20px, 15px) scale(0.97); }
                    100% { transform: translate(0, 0) scale(1); }
                }
                @keyframes lineExpand {
                    from { width: 0; opacity: 0; }
                    to   { width: 80px; opacity: 1; }
                }

                /* ---- Shooting stars ---- */
                .shooting-star {
                    position: absolute;
                    top: 15%;
                    left: 5%;
                    width: 130px;
                    height: 2px;
                    background: linear-gradient(90deg, transparent, rgba(180,230,255,0.9), transparent);
                    border-radius: 2px;
                    animation: shootAcross 2.8s ease-in infinite;
                    opacity: 0;
                }
                .shooting-star:nth-child(2) { top: 30%; left: 60%; width: 80px; }
                .shooting-star:nth-child(3) { top: 55%; left: 20%; width: 100px; }

                /* ---- Entrance states ---- */
                .anim-enter { opacity: 0; }
                .anim-enter.mounted-fade-1 { animation: fadeSlideDown 0.8s cubic-bezier(.22,1,.36,1) 0.1s forwards; }
                .anim-enter.mounted-fade-2 { animation: scaleFadeIn   0.9s cubic-bezier(.22,1,.36,1) 0.4s forwards; }
                .anim-enter.mounted-fade-3 { animation: scaleFadeIn   0.9s cubic-bezier(.22,1,.36,1) 0.65s forwards; }
                .anim-enter.mounted-fade-4 { animation: fadeSlideUp   0.85s cubic-bezier(.22,1,.36,1) 0.9s forwards; }
                .anim-enter.mounted-fade-5 { animation: fadeSlideUp   0.85s cubic-bezier(.22,1,.36,1) 1.1s forwards; }
                .anim-enter.mounted-fade-6 { animation: fadeSlideUp   0.85s cubic-bezier(.22,1,.36,1) 1.3s forwards; }

                /* ---- Title glow ---- */
                .title-glow {
                    animation: glow-pulse 3.5s ease-in-out infinite;
                }

                /* ---- Orbit dot ---- */
                .orbit-dot {
                    position: absolute;
                    width: 8px;
                    height: 8px;
                    background: #219EBC;
                    border-radius: 50%;
                    box-shadow: 0 0 10px #219EBC, 0 0 20px rgba(33,158,188,0.6);
                    animation: orbitSlow 12s linear infinite;
                    top: 50%;
                    left: 50%;
                    margin: -4px;
                }
                .orbit-ring {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 320px;
                    height: 320px;
                    border-radius: 50%;
                    border: 1px solid rgba(33,158,188,0.15);
                    pointer-events: none;
                }

                /* ---- Nebula blobs ---- */
                .nebula {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(80px);
                    pointer-events: none;
                    animation: nebulaDrift 18s ease-in-out infinite;
                }

                /* ---- CTA button ---- */
                .cta-btn {
                    position: relative;
                    overflow: hidden;
                    font-family: 'Raleway', sans-serif;
                    font-weight: 600;
                    letter-spacing: 0.14em;
                    text-transform: uppercase;
                    font-size: 0.85rem;
                    padding: 14px 44px;
                    border-radius: 40px;
                    background: linear-gradient(135deg, #219EBC 0%, #126782 100%);
                    color: white;
                    border: 1px solid rgba(33,158,188,0.5);
                    cursor: pointer;
                    transition: transform 0.22s cubic-bezier(.22,1,.36,1),
                                box-shadow 0.22s ease,
                                background 0.3s ease;
                    animation: btnGlow 3s ease-in-out infinite;
                    text-decoration: none;
                    display: inline-block;
                }
                .cta-btn::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 60%);
                    opacity: 0;
                    transition: opacity 0.25s;
                }
                .cta-btn:hover {
                    transform: translateY(-3px) scale(1.04);
                    box-shadow: 0 8px 32px rgba(33,158,188,0.55), 0 2px 8px rgba(0,0,0,0.4);
                    background: linear-gradient(135deg, #27b8dc 0%, #1a88a8 100%);
                }
                .cta-btn:hover::before { opacity: 1; }
                .cta-btn:active { transform: translateY(0) scale(0.98); }

                /* ---- Divider line ---- */
                .divider-line {
                    display: inline-block;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(33,158,188,0.7), transparent);
                    animation: lineExpand 1s cubic-bezier(.22,1,.36,1) 1.5s both;
                    width: 80px;
                }

                /* ---- Scroll hint ---- */
                @keyframes bounceDown {
                    0%, 100% { transform: translateY(0); opacity: 0.5; }
                    50%       { transform: translateY(8px); opacity: 1; }
                }
                .scroll-hint { animation: bounceDown 2s ease-in-out infinite; }

                /* ---- Stat badges ---- */
                .stat-badge {
                    background: rgba(33,158,188,0.08);
                    border: 1px solid rgba(33,158,188,0.25);
                    border-radius: 12px;
                    padding: 14px 24px;
                    transition: background 0.25s, border-color 0.25s, transform 0.25s;
                    cursor: default;
                }
                .stat-badge:hover {
                    background: rgba(33,158,188,0.18);
                    border-color: rgba(33,158,188,0.55);
                    transform: translateY(-4px);
                }
            `}</style>

            <div
                className="relative min-h-screen w-full flex flex-col bg-[#0A1128] overflow-hidden"
                style={{ fontFamily: "'Raleway', sans-serif" }}
            >
                {/* Background image with overlay */}
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(10,17,40,0.62), rgba(10,17,40,0.82)), url('/src/assets/planetarium-AI.png')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />

                {/* Nebula color blobs */}
                <div
                    className="nebula"
                    style={{
                        width: 500, height: 400,
                        top: "-10%", left: "-8%",
                        background: "rgba(33,158,188,0.09)",
                        animationDelay: "0s",
                    }}
                />
                <div
                    className="nebula"
                    style={{
                        width: 420, height: 360,
                        bottom: "0%", right: "-6%",
                        background: "rgba(18,103,130,0.12)",
                        animationDelay: "-9s",
                    }}
                />
                <div
                    className="nebula"
                    style={{
                        width: 260, height: 260,
                        top: "40%", left: "42%",
                        background: "rgba(39,184,220,0.06)",
                        animationDelay: "-4s",
                    }}
                />

                {/* Animated star canvas */}
                <StarField />

                {/* Navbar */}
                <div className="relative z-20 w-full">
                    <Navbar />
                </div>

                {/* Hero content */}
                <main className="relative z-10 flex flex-col items-center justify-center flex-grow text-center px-4 pt-6">

                    {/* Main title */}
                    <div className={`anim-enter ${mounted ? "mounted-fade-3" : ""}`}>
                        <h1
                            className="title-glow"
                            style={{
                                fontFamily: "'Raleway', sans-serif",
                                fontSize: "clamp(3rem, 9vw, 7.5rem)",
                                fontWeight: 900,
                                lineHeight: 1.0,
                                color: "#ffffff",
                                letterSpacing: "0.03em",
                                marginBottom: 0,
                            }}
                        >
                            Sri Lanka
                        </h1>
                        <h2
                            style={{
                                fontFamily: "'Raleway', sans-serif",
                                fontSize: "clamp(8rem, 12vw, 7rem)",
                                fontWeight: 600,
                                color: "#219EBC",
                                letterSpacing: "0.08em",
                                marginTop: "-0.1em",
                                marginBottom: "10px",
                                textTransform: "uppercase",
                            }}
                        >
                            Planetarium
                        </h2>
                    </div>

                    {/* Divider */}
                    <div className={`anim-enter ${mounted ? "mounted-fade-4" : ""} mb-6`}>
                        <span className="divider-line" />
                    </div>

                    {/* Tagline */}
                    <p
                        className={`anim-enter ${mounted ? "mounted-fade-5" : ""}`}
                        style={{
                            maxWidth: "520px",
                            marginBottom: "36px",
                            color: "rgba(203,213,225,0.88)",
                            fontSize: "1.05rem",
                            fontWeight: 300,
                            lineHeight: 1.75,
                            letterSpacing: "0.03em",
                        }}
                    >
                        Begin your cosmic adventure and explore the wonders of the universe with us.
                    </p>

                    {/* CTA */}
                    <div className={`anim-enter ${mounted ? "mounted-fade-6" : ""} flex flex-col items-center gap-5`}>
                        <a href="/sign-up" className="cta-btn">
                            Get Started
                        </a>

                        {/* Stat badges */}
                        <div className="flex flex-wrap justify-center gap-4 mt-4">
                            {[
                                { value: "100+", label: "Shows / Year" },
                                { value: "50K+", label: "Visitors" },
                                { value: "4K", label: "Resolution Dome" },
                            ].map((s) => (
                                <div key={s.label} className="stat-badge text-center">
                                    <div style={{ color: "#219EBC", fontFamily: "'Cinzel', serif", fontSize: "1.4rem", fontWeight: 700 }}>
                                        {s.value}
                                    </div>
                                    <div style={{ color: "rgba(203,213,225,0.65)", fontSize: "0.72rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                                        {s.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default LandingPage;