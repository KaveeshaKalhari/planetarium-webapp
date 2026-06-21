import React, { useEffect, useRef, useState } from 'react';
import audience from "../../assets/audience.png";
import UserNavbar from '../../components/UserNavbar';

interface TeamMember {
    id: number;
    name: string;
    role: string;
    image: string;
}

const AboutUsPage: React.FC = () => {
    const [mounted, setMounted] = useState(false);
    const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [visible, setVisible] = useState<boolean[]>([false, false, false, false]);

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 80);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        const observers: IntersectionObserver[] = [];
        sectionRefs.current.forEach((ref, i) => {
            if (!ref) return;
            const obs = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setVisible(prev => { const next = [...prev]; next[i] = true; return next; });
                        obs.disconnect();
                    }
                },
                { threshold: 0.15 }
            );
            obs.observe(ref);
            observers.push(obs);
        });
        return () => observers.forEach(o => o.disconnect());
    }, []);

    const teamMembers: TeamMember[] = [
        { id: 1, name: "Dr. Anya Sharma", role: "CEO & Founder", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" },
        { id: 2, name: "Ethan Carter", role: "Head of Technology", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" },
        { id: 3, name: "Olivia Bennett", role: "Director of Outreach", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop" },
    ];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Raleway:wght@300;400;600&display=swap');

                @keyframes fadeSlideDown {
                    from { opacity: 0; transform: translateY(-28px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(36px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeSlideLeft {
                    from { opacity: 0; transform: translateX(-40px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes fadeSlideRight {
                    from { opacity: 0; transform: translateX(40px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes scaleFadeIn {
                    from { opacity: 0; transform: scale(0.88); }
                    to   { opacity: 1; transform: scale(1); }
                }
                @keyframes nebulaDrift {
                    0%   { transform: translate(0,0) scale(1); }
                    33%  { transform: translate(25px,-18px) scale(1.04); }
                    66%  { transform: translate(-18px,14px) scale(0.97); }
                    100% { transform: translate(0,0) scale(1); }
                }
                @keyframes twinkle {
                    0%,100% { opacity: 0.3; }
                    50%      { opacity: 1; }
                }
                @keyframes lineExpand {
                    from { width: 0; opacity: 0; }
                    to   { width: 64px; opacity: 1; }
                }
                @keyframes ringPulse {
                    0%,100% { box-shadow: 0 0 0 0 rgba(33,158,188,0.35); }
                    50%      { box-shadow: 0 0 0 10px rgba(33,158,188,0); }
                }
                @keyframes borderGlow {
                    0%,100% { border-color: rgba(33,158,188,0.55); }
                    50%      { border-color: rgba(33,158,188,1); }
                }

                .anim-enter { opacity: 0; }
                .anim-fade-down  { animation: fadeSlideDown  0.8s cubic-bezier(.22,1,.36,1) forwards; }
                .anim-fade-up    { animation: fadeSlideUp    0.8s cubic-bezier(.22,1,.36,1) forwards; }
                .anim-fade-left  { animation: fadeSlideLeft  0.8s cubic-bezier(.22,1,.36,1) forwards; }
                .anim-fade-right { animation: fadeSlideRight 0.8s cubic-bezier(.22,1,.36,1) forwards; }
                .anim-scale      { animation: scaleFadeIn    0.8s cubic-bezier(.22,1,.36,1) forwards; }

                .nebula-blob {
                    position: fixed;
                    border-radius: 50%;
                    filter: blur(90px);
                    pointer-events: none;
                    z-index: 0;
                    animation: nebulaDrift 20s ease-in-out infinite;
                }
                .star-dot {
                    position: fixed;
                    border-radius: 50%;
                    background: rgba(200,230,255,0.9);
                    pointer-events: none;
                    z-index: 0;
                    animation: twinkle var(--dur,3s) ease-in-out infinite;
                    animation-delay: var(--delay,0s);
                }

                .section-card {
                    background: rgba(15,24,52,0.7);
                    border: 1px solid rgba(33,158,188,0.22);
                    border-radius: 20px;
                    padding: 36px;
                    backdrop-filter: blur(8px);
                    transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;
                }
                .section-card:hover {
                    border-color: rgba(33,158,188,0.65);
                    box-shadow: 0 8px 40px rgba(33,158,188,0.14);
                    transform: translateY(-3px);
                }

                .image-frame {
                    border: 2px solid rgba(33,158,188,0.55);
                    border-radius: 20px;
                    overflow: hidden;
                    animation: borderGlow 4s ease-in-out infinite;
                    transition: transform 0.4s cubic-bezier(.22,1,.36,1), box-shadow 0.4s;
                }
                .image-frame:hover {
                    transform: scale(1.02) rotate(0.5deg);
                    box-shadow: 0 16px 56px rgba(33,158,188,0.3);
                }
                .image-frame img {
                    transition: transform 0.6s cubic-bezier(.22,1,.36,1);
                }
                .image-frame:hover img { transform: scale(1.05); }

                .team-card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    transition: transform 0.3s cubic-bezier(.22,1,.36,1);
                }
                .team-card:hover { transform: translateY(-8px); }

                .avatar-ring {
                    width: 192px; height: 192px;
                    border-radius: 50%;
                    overflow: hidden;
                    border: 3px solid rgba(33,158,188,0.4);
                    transition: border-color 0.3s, box-shadow 0.3s;
                    animation: ringPulse 3s ease-in-out infinite;
                }
                .team-card:hover .avatar-ring {
                    border-color: #219EBC;
                    box-shadow: 0 0 28px rgba(33,158,188,0.55);
                    animation: none;
                }
                .avatar-ring img {
                    width: 100%; height: 100%; object-fit: cover;
                    transition: transform 0.5s cubic-bezier(.22,1,.36,1);
                }
                .team-card:hover .avatar-ring img { transform: scale(1.1); }

                .role-tag {
                    display: inline-block;
                    margin-top: 6px;
                    padding: 3px 14px;
                    border-radius: 30px;
                    font-size: 0.72rem;
                    letter-spacing: 0.14em;
                    text-transform: uppercase;
                    background: rgba(33,158,188,0.12);
                    border: 1px solid rgba(33,158,188,0.3);
                    color: #219EBC;
                    transition: background 0.25s, border-color 0.25s;
                }
                .team-card:hover .role-tag {
                    background: rgba(33,158,188,0.25);
                    border-color: rgba(33,158,188,0.7);
                }

                .divider-line {
                    display: inline-block;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(33,158,188,0.7), transparent);
                    animation: lineExpand 1s cubic-bezier(.22,1,.36,1) 0.5s both;
                    width: 64px;
                }

                .eyebrow {
                    font-family: 'Raleway', sans-serif;
                    font-size: 0.68rem;
                    letter-spacing: 0.28em;
                    text-transform: uppercase;
                    color: #219EBC;
                    border: 1px solid rgba(33,158,188,0.35);
                    border-radius: 40px;
                    padding: 4px 16px;
                    display: inline-block;
                    margin-bottom: 16px;
                    background: rgba(33,158,188,0.07);
                }
            `}</style>

            <div className="min-h-screen bg-[#0A1128] relative overflow-x-hidden" style={{ fontFamily: "'Raleway', sans-serif" }}>

                {/* Nebula blobs */}
                <div className="nebula-blob" style={{ width: 480, height: 380, top: "-8%", left: "-6%", background: "rgba(33,158,188,0.08)", animationDelay: "0s" }} />
                <div className="nebula-blob" style={{ width: 360, height: 320, bottom: "5%", right: "-5%", background: "rgba(18,103,130,0.1)", animationDelay: "-8s" }} />

                {/* Static star dots */}
                {[
                    { top: "12%", left: "8%", size: 2, dur: "2.8s", delay: "0s" },
                    { top: "25%", left: "92%", size: 1.5, dur: "3.5s", delay: "-1s" },
                    { top: "60%", left: "4%", size: 2, dur: "4s", delay: "-2s" },
                    { top: "80%", left: "88%", size: 1.5, dur: "2.5s", delay: "-0.5s" },
                    { top: "45%", left: "96%", size: 1, dur: "3.2s", delay: "-1.5s" },
                ].map((s, i) => (
                    <div key={i} className="star-dot" style={{ top: s.top, left: s.left, width: s.size, height: s.size, "--dur": s.dur, "--delay": s.delay } as React.CSSProperties} />
                ))}

                {/* Navbar */}
                <div className="relative z-20 w-full">
                    <UserNavbar />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                    {/* Hero heading */}
                    <div
                        ref={el => { sectionRefs.current[0] = el; }}
                        className={`text-center mb-14 anim-enter ${visible[0] ? "anim-fade-down" : ""}`}
                        style={{ animationDelay: "0s" }}
                    >
                        <h1 style={{ fontFamily: "'Raleway', sans-serif", fontSize: "clamp(2.4rem, 6vw, 4.5rem)", fontWeight: 900, color: "#fff", letterSpacing: "0.04em" }}>
                            About <span style={{ color: "#219EBC" }}>Planetarium</span>
                        </h1>
                        <p style={{ color: "rgba(203,213,225,0.8)", maxWidth: 560, margin: "0 auto", lineHeight: 1.75, fontWeight: 300 }}>
                            Discover the story behind our mission to bring the wonders of the universe closer to you.
                        </p>
                    </div>

                    {/* Mission & Vision + Image */}
                    <div
                        ref={el => { sectionRefs.current[1] = el; }}
                        className="grid md:grid-cols-2 gap-8 mb-24"
                    >
                        {/* Left: cards */}
                        <div className={`space-y-6 anim-enter ${visible[1] ? "anim-fade-left" : ""}`} style={{ animationDelay: "0.1s" }}>
                            <div className="section-card">
                                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(33,158,188,0.15)", border: "1px solid rgba(33,158,188,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#219EBC" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                                    </div>
                                    <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.4rem", fontWeight: 700, color: "#fff" }}>Our Mission</h2>
                                </div>
                                <p style={{ color: "rgba(203,213,225,0.8)", lineHeight: 1.78, fontWeight: 300 }}>
                                    At Cosmos, our mission is to make the wonders of the universe accessible to everyone. We strive to create a space where curiosity meets discovery, offering not just a planetarium experience but one that enriches understanding and appreciation of astronomy and space exploration.
                                </p>
                            </div>

                            <div className="section-card">
                                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(33,158,188,0.15)", border: "1px solid rgba(33,158,188,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#219EBC" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 000 20 14.5 14.5 0 000-20" /><path d="M2 12h20" /></svg>
                                    </div>
                                    <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.4rem", fontWeight: 700, color: "#fff" }}>Our Vision</h2>
                                </div>
                                <p style={{ color: "rgba(203,213,225,0.8)", lineHeight: 1.78, fontWeight: 300 }}>
                                    Our vision is to become the leading platform for planetarium bookings and space-related experiences. We aim to connect people with the cosmos, inspire a new generation of space explorers, and foster a community of space enthusiasts that supports planetariums in reaching wider audiences.
                                </p>
                            </div>
                        </div>

                        {/* Right: image */}
                        <div className={`flex items-center justify-center anim-enter ${visible[1] ? "anim-fade-right" : ""}`} style={{ animationDelay: "0.2s" }}>
                            <div className="image-frame w-full" style={{ minHeight: 380 }}>
                                <img src={audience} alt="Planetarium audience" className="w-full h-full object-cover" style={{ minHeight: 380 }} />
                            </div>
                        </div>
                    </div>

                    {/* Team heading */}
                    <div
                        ref={el => { sectionRefs.current[2] = el; }}
                        className={`text-center mb-14 anim-enter ${visible[2] ? "anim-fade-up" : ""}`}
                    >
                        <h2 style={{ fontFamily: "'Raleway', sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, color: "#fff", letterSpacing: "0.04em" }}>
                            Meet Our <span style={{ color: "#219EBC" }}>Team</span>
                        </h2>
                        <p style={{ color: "rgba(203,213,225,0.8)", maxWidth: 540, margin: "0 auto", fontWeight: 300, lineHeight: 1.75 }}>
                            Our team is composed of passionate individuals with diverse backgrounds in astronomy, technology, and education.
                        </p>
                    </div>

                    {/* Team grid */}
                    <div
                        ref={el => { sectionRefs.current[3] = el; }}
                        className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto pb-20"
                    >
                        {teamMembers.map((member, i) => (
                            <div
                                key={member.id}
                                className={`team-card anim-enter ${visible[3] ? "anim-scale" : ""}`}
                                style={{ animationDelay: `${0.1 + i * 0.15}s` }}
                            >
                                <div className="avatar-ring mb-5">
                                    <img src={member.image} alt={member.name} />
                                </div>
                                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.1rem", fontWeight: 700, color: "#fff", marginBottom: 4 }}>{member.name}</h3>
                                <span className="role-tag">{member.role}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AboutUsPage;