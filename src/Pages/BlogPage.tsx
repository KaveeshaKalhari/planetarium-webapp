import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from "../components/Navbar.tsx";

interface BlogPost {
    id: number;
    title: string;
    description: string;
    image: string;
    tag: string;
}

const CosmosBlogsPage: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [animDir, setAnimDir] = useState<'left' | 'right' | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [mounted, setMounted] = useState(false);
    const headerRef = useRef<HTMLDivElement>(null);
    const [headerVisible, setHeaderVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 80);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        if (!headerRef.current) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setHeaderVisible(true); obs.disconnect(); } }, { threshold: 0.15 });
        obs.observe(headerRef.current);
        return () => obs.disconnect();
    }, []);

    const blogPosts: BlogPost[] = [
        { id: 1, title: "The Wonders of the Orion Nebula", description: "Dive into the heart of the Orion Nebula, a stellar nursery teeming with young stars and glowing gas.", image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&h=400&fit=crop", tag: "Nebulae" },
        { id: 2, title: "The Future of Space Tourism", description: "Explore the exciting possibilities and challenges of space tourism, making space accessible to everyone.", image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=600&h=400&fit=crop", tag: "Tourism" },
        { id: 3, title: "Understanding Black Holes", description: "Unravel the mysteries of black holes, regions of spacetime where gravity is so strong that nothing can escape.", image: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=600&h=400&fit=crop", tag: "Deep Space" },
        { id: 4, title: "Mars Exploration Mission", description: "Discover the latest findings from Mars rovers and the potential for human colonization of the Red Planet.", image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=600&h=400&fit=crop", tag: "Exploration" },
        { id: 5, title: "The Beauty of Saturn's Rings", description: "Learn about the composition and formation of Saturn's magnificent ring system and its moons.", image: "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?w=600&h=400&fit=crop", tag: "Solar System" },
    ];

    const maxSlide = blogPosts.length - 3;

    const slide = (dir: 'left' | 'right') => {
        if (isAnimating) return;
        setAnimDir(dir);
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentSlide(prev =>
                dir === 'right'
                    ? Math.min(prev + 1, maxSlide)
                    : Math.max(prev - 1, 0)
            );
            setAnimDir(null);
            setIsAnimating(false);
        }, 320);
    };

    const visiblePosts = blogPosts.slice(currentSlide, currentSlide + 3);

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
                @keyframes scaleFadeIn {
                    from { opacity: 0; transform: scale(0.9); }
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
                @keyframes slideOutLeft  { from { opacity:1; transform: translateX(0); }  to { opacity:0; transform: translateX(-32px); } }
                @keyframes slideOutRight { from { opacity:1; transform: translateX(0); }  to { opacity:0; transform: translateX(32px); } }
                @keyframes slideInLeft   { from { opacity:0; transform: translateX(32px); } to { opacity:1; transform: translateX(0); } }
                @keyframes slideInRight  { from { opacity:0; transform: translateX(-32px); } to { opacity:1; transform: translateX(0); } }

                .anim-enter { opacity: 0; }
                .anim-fade-down { animation: fadeSlideDown 0.8s cubic-bezier(.22,1,.36,1) forwards; }
                .anim-fade-up   { animation: fadeSlideUp   0.8s cubic-bezier(.22,1,.36,1) forwards; }
                .anim-scale     { animation: scaleFadeIn   0.8s cubic-bezier(.22,1,.36,1) forwards; }

                .nebula-blob {
                    position: fixed; border-radius: 50%; filter: blur(90px);
                    pointer-events: none; z-index: 0;
                    animation: nebulaDrift 20s ease-in-out infinite;
                }
                .star-dot {
                    position: fixed; border-radius: 50%;
                    background: rgba(200,230,255,0.9);
                    pointer-events: none; z-index: 0;
                    animation: twinkle var(--dur,3s) ease-in-out infinite;
                    animation-delay: var(--delay,0s);
                }

                .divider-line {
                    display: inline-block; height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(33,158,188,0.7), transparent);
                    animation: lineExpand 1s cubic-bezier(.22,1,.36,1) 0.5s both;
                    width: 64px;
                }
                .eyebrow {
                    font-family: 'Raleway', sans-serif; font-size: 0.68rem; letter-spacing: 0.28em;
                    text-transform: uppercase; color: #219EBC; border: 1px solid rgba(33,158,188,0.35);
                    border-radius: 40px; padding: 4px 16px; display: inline-block; margin-bottom: 16px;
                    background: rgba(33,158,188,0.07);
                }

                /* Blog card */
                .blog-card {
                    background: rgba(15,24,52,0.75);
                    border: 1px solid rgba(33,158,188,0.25);
                    border-radius: 20px; overflow: hidden;
                    display: flex; flex-direction: column;
                    cursor: pointer;
                    transition: transform 0.32s cubic-bezier(.22,1,.36,1),
                                border-color 0.28s,
                                box-shadow 0.3s;
                    backdrop-filter: blur(8px);
                }
                .blog-card:hover {
                    transform: translateY(-10px) scale(1.02);
                    border-color: rgba(33,158,188,0.7);
                    box-shadow: 0 20px 60px rgba(33,158,188,0.2);
                }
                .blog-card-img-wrap { overflow: hidden; position: relative; }
                .blog-card-img-wrap img {
                    width: 100%; height: 200px; object-fit: cover;
                    transition: transform 0.55s cubic-bezier(.22,1,.36,1);
                    display: block;
                }
                .blog-card:hover .blog-card-img-wrap img { transform: scale(1.09); }
                .blog-card-overlay {
                    position: absolute; inset: 0;
                    background: linear-gradient(180deg, transparent 50%, rgba(10,17,40,0.7) 100%);
                    opacity: 0; transition: opacity 0.3s;
                }
                .blog-card:hover .blog-card-overlay { opacity: 1; }

                .blog-tag {
                    position: absolute; top: 12px; right: 12px;
                    font-family: 'Raleway', sans-serif; font-size: 0.62rem;
                    letter-spacing: 0.18em; text-transform: uppercase;
                    background: rgba(33,158,188,0.85); color: #fff;
                    padding: 3px 10px; border-radius: 30px;
                }

                /* Read more arrow */
                .read-more {
                    display: inline-flex; align-items: center; gap: 6px;
                    font-family: 'Raleway', sans-serif; font-size: 0.75rem;
                    letter-spacing: 0.14em; text-transform: uppercase;
                    color: #219EBC; margin-top: 14px;
                    transition: gap 0.2s;
                }
                .blog-card:hover .read-more { gap: 10px; }

                /* Nav buttons */
                .nav-btn {
                    width: 48px; height: 48px;
                    background: rgba(15,24,52,0.8);
                    border: 1px solid rgba(33,158,188,0.3);
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer; z-index: 10;
                    transition: background 0.22s, border-color 0.22s, transform 0.22s, box-shadow 0.22s;
                    backdrop-filter: blur(6px);
                }
                .nav-btn:hover:not(:disabled) {
                    background: rgba(33,158,188,0.2);
                    border-color: rgba(33,158,188,0.7);
                    transform: scale(1.1);
                    box-shadow: 0 0 18px rgba(33,158,188,0.35);
                }
                .nav-btn:disabled { opacity: 0.35; cursor: not-allowed; }

                /* Indicator dots */
                .dot-indicator {
                    width: 10px; height: 10px; border-radius: 30px;
                    background: rgba(100,130,160,0.4);
                    border: 1px solid rgba(33,158,188,0.2);
                    cursor: pointer;
                    transition: background 0.25s, width 0.25s, border-color 0.25s;
                }
                .dot-indicator.active {
                    width: 28px;
                    background: #219EBC;
                    border-color: #219EBC;
                    box-shadow: 0 0 10px rgba(33,158,188,0.5);
                }

                /* Slide animation helpers */
                .cards-exit-left  { animation: slideOutLeft  0.32s ease forwards; }
                .cards-exit-right { animation: slideOutRight 0.32s ease forwards; }
                .cards-enter-left  { animation: slideInLeft  0.32s ease forwards; }
                .cards-enter-right { animation: slideInRight 0.32s ease forwards; }
            `}</style>

            <div className="min-h-screen bg-[#0A1128] relative overflow-x-hidden" style={{ fontFamily: "'Raleway', sans-serif" }}>

                {/* Nebula blobs */}
                <div className="nebula-blob" style={{ width: 460, height: 360, top: "-10%", left: "-5%", background: "rgba(33,158,188,0.08)", animationDelay: "0s" }} />
                <div className="nebula-blob" style={{ width: 380, height: 300, bottom: "5%", right: "-5%", background: "rgba(18,103,130,0.1)", animationDelay: "-9s" }} />

                {/* Star dots */}
                {[
                    { top: "10%", left: "5%", size: 2, dur: "3s", delay: "0s" },
                    { top: "20%", left: "94%", size: 1.5, dur: "3.8s", delay: "-1.2s" },
                    { top: "70%", left: "3%", size: 2, dur: "4.2s", delay: "-2s" },
                    { top: "85%", left: "91%", size: 1.5, dur: "2.8s", delay: "-0.7s" },
                ].map((s, i) => (
                    <div key={i} className="star-dot" style={{ top: s.top, left: s.left, width: s.size, height: s.size, "--dur": s.dur, "--delay": s.delay } as React.CSSProperties} />
                ))}

                {/* Navbar */}
                <div className="relative z-20 w-full">
                    <Navbar />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                    {/* Header */}
                    <div
                        ref={headerRef}
                        className={`text-center mb-14 anim-enter ${headerVisible ? "anim-fade-down" : ""}`}
                    >
                        <h1 style={{ fontFamily: "'Raleway', sans-serif", fontSize: "clamp(2.4rem, 6vw, 4.5rem)", fontWeight: 900, color: "#fff", letterSpacing: "0.04em" }}>
                            Astronomy <span style={{ color: "#219EBC" }}>Blogs</span>
                        </h1>
                        <p style={{ color: "rgba(203,213,225,0.8)", maxWidth: 580, margin: "0 auto", fontWeight: 300, lineHeight: 1.75 }}>
                            Explore the latest articles, news, and discoveries in the world of astronomy — from deep-sky wonders to the future of space exploration.
                        </p>
                    </div>

                    {/* Carousel */}
                    <div className="relative flex items-center gap-4">

                        {/* Prev button */}
                        <button
                            onClick={() => slide('left')}
                            disabled={currentSlide === 0 || isAnimating}
                            className="nav-btn flex-shrink-0"
                            aria-label="Previous"
                        >
                            <ChevronLeft className="text-white" size={24} />
                        </button>

                        {/* Cards */}
                        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 ${animDir === 'right' ? 'cards-exit-left' : animDir === 'left' ? 'cards-exit-right' : ''}`}>
                            {visiblePosts.map((post, i) => (
                                <div
                                    key={post.id}
                                    className={`blog-card anim-enter ${mounted ? "anim-scale" : ""}`}
                                    style={{ animationDelay: `${0.1 + i * 0.12}s` }}
                                >
                                    <div className="blog-card-img-wrap">
                                        <img src={post.image} alt={post.title} />
                                        <div className="blog-card-overlay" />
                                        <span className="blog-tag">{post.tag}</span>
                                    </div>
                                    <div style={{ padding: "24px 24px 28px" }}>
                                        <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.05rem", fontWeight: 700, color: "#fff", marginBottom: 10, lineHeight: 1.4 }}>{post.title}</h3>
                                        <p style={{ color: "rgba(203,213,225,0.75)", fontSize: "0.85rem", lineHeight: 1.7, fontWeight: 300 }}>{post.description}</p>
                                        <div className="read-more">
                                            Read more
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#219EBC" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Next button */}
                        <button
                            onClick={() => slide('right')}
                            disabled={currentSlide >= maxSlide || isAnimating}
                            className="nav-btn flex-shrink-0"
                            aria-label="Next"
                        >
                            <ChevronRight className="text-white" size={24} />
                        </button>
                    </div>

                    {/* Indicator dots */}
                    <div className="flex justify-center gap-2 mt-10">
                        {Array.from({ length: maxSlide + 1 }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentSlide(i)}
                                className={`dot-indicator ${currentSlide === i ? 'active' : ''}`}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CosmosBlogsPage;