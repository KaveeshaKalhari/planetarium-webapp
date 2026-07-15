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
                                fontSize: "6rem",
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
                                fontFamily: "'Inter', sans-serif",
                                fontSize: "6rem",
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