import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, User, Calendar, Tag, RefreshCw } from 'lucide-react';
import Navbar from "../components/Navbar.tsx";
import { getApprovedBlogs, type BlogResponse } from '../services/api.ts';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&h=400&fit=crop';
const CARDS_PER_PAGE = 3;

const CosmosBlogsPage: React.FC = () => {
    const [blogs, setBlogs] = useState<BlogResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [animDir, setAnimDir] = useState<'left' | 'right' | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState<BlogResponse | null>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const [headerVisible, setHeaderVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 80);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        if (!headerRef.current) return;
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { setHeaderVisible(true); obs.disconnect(); }
        }, { threshold: 0.15 });
        obs.observe(headerRef.current);
        return () => obs.disconnect();
    }, []);

    const loadBlogs = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getApprovedBlogs();
            setBlogs(data);
        } catch {
            setError('Could not load blogs. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadBlogs(); }, []);

    const maxSlide = Math.max(0, blogs.length - CARDS_PER_PAGE);

    const slide = (dir: 'left' | 'right') => {
        if (isAnimating) return;
        setAnimDir(dir);
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentSlide(prev =>
                dir === 'right' ? Math.min(prev + 1, maxSlide) : Math.max(prev - 1, 0)
            );
            setAnimDir(null);
            setIsAnimating(false);
        }, 320);
    };

    const visiblePosts = blogs.slice(currentSlide, currentSlide + CARDS_PER_PAGE);

    // Close modal on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelectedBlog(null); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Raleway:wght@300;400;600&display=swap');

                @keyframes fadeSlideDown { from{opacity:0;transform:translateY(-28px)} to{opacity:1;transform:translateY(0)} }
                @keyframes scaleFadeIn   { from{opacity:0;transform:scale(0.9)}        to{opacity:1;transform:scale(1)} }
                @keyframes nebulaDrift   { 0%{transform:translate(0,0) scale(1)} 33%{transform:translate(25px,-18px) scale(1.04)} 66%{transform:translate(-18px,14px) scale(0.97)} 100%{transform:translate(0,0) scale(1)} }
                @keyframes twinkle       { 0%,100%{opacity:0.3} 50%{opacity:1} }
                @keyframes lineExpand    { from{width:0;opacity:0} to{width:64px;opacity:1} }
                @keyframes slideOutLeft  { from{opacity:1;transform:translateX(0)}   to{opacity:0;transform:translateX(-32px)} }
                @keyframes slideOutRight { from{opacity:1;transform:translateX(0)}   to{opacity:0;transform:translateX(32px)} }
                @keyframes modalIn       { from{opacity:0;transform:scale(0.93) translateY(16px)} to{opacity:1;transform:scale(1) translateY(0)} }
                @keyframes spin          { to{transform:rotate(360deg)} }

                .anim-enter    { opacity:0 }
                .anim-fade-down { animation:fadeSlideDown 0.8s cubic-bezier(.22,1,.36,1) forwards }
                .anim-scale     { animation:scaleFadeIn   0.8s cubic-bezier(.22,1,.36,1) forwards }

                .nebula-blob { position:fixed;border-radius:50%;filter:blur(90px);pointer-events:none;z-index:0;animation:nebulaDrift 20s ease-in-out infinite }
                .star-dot    { position:fixed;border-radius:50%;background:rgba(200,230,255,0.9);pointer-events:none;z-index:0;animation:twinkle var(--dur,3s) ease-in-out infinite;animation-delay:var(--delay,0s) }

                .divider-line { display:inline-block;height:1px;background:linear-gradient(90deg,transparent,rgba(33,158,188,0.7),transparent);animation:lineExpand 1s cubic-bezier(.22,1,.36,1) 0.5s both;width:64px }

                .blog-card { background:rgba(15,24,52,0.75);border:1px solid rgba(33,158,188,0.25);border-radius:20px;overflow:hidden;display:flex;flex-direction:column;cursor:pointer;transition:transform 0.32s cubic-bezier(.22,1,.36,1),border-color 0.28s,box-shadow 0.3s;backdrop-filter:blur(8px) }
                .blog-card:hover { transform:translateY(-10px) scale(1.02);border-color:rgba(33,158,188,0.7);box-shadow:0 20px 60px rgba(33,158,188,0.2) }
                .blog-card-img-wrap { overflow:hidden;position:relative }
                .blog-card-img-wrap img { width:100%;height:200px;object-fit:cover;transition:transform 0.55s cubic-bezier(.22,1,.36,1);display:block }
                .blog-card:hover .blog-card-img-wrap img { transform:scale(1.09) }
                .blog-card-overlay { position:absolute;inset:0;background:linear-gradient(180deg,transparent 50%,rgba(10,17,40,0.7) 100%);opacity:0;transition:opacity 0.3s }
                .blog-card:hover .blog-card-overlay { opacity:1 }
                .blog-tag { position:absolute;top:12px;right:12px;font-family:'Raleway',sans-serif;font-size:0.62rem;letter-spacing:0.18em;text-transform:uppercase;background:rgba(33,158,188,0.85);color:#fff;padding:3px 10px;border-radius:30px }

                .read-more { display:inline-flex;align-items:center;gap:6px;font-family:'Raleway',sans-serif;font-size:0.75rem;letter-spacing:0.14em;text-transform:uppercase;color:#219EBC;margin-top:14px;transition:gap 0.2s }
                .blog-card:hover .read-more { gap:10px }

                .nav-btn { width:48px;height:48px;background:rgba(15,24,52,0.8);border:1px solid rgba(33,158,188,0.3);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:10;transition:background 0.22s,border-color 0.22s,transform 0.22s,box-shadow 0.22s;backdrop-filter:blur(6px) }
                .nav-btn:hover:not(:disabled) { background:rgba(33,158,188,0.2);border-color:rgba(33,158,188,0.7);transform:scale(1.1);box-shadow:0 0 18px rgba(33,158,188,0.35) }
                .nav-btn:disabled { opacity:0.35;cursor:not-allowed }

                .dot-indicator { width:10px;height:10px;border-radius:30px;background:rgba(100,130,160,0.4);border:1px solid rgba(33,158,188,0.2);cursor:pointer;transition:background 0.25s,width 0.25s,border-color 0.25s }
                .dot-indicator.active { width:28px;background:#219EBC;border-color:#219EBC;box-shadow:0 0 10px rgba(33,158,188,0.5) }

                .cards-exit-left  { animation:slideOutLeft  0.32s ease forwards }
                .cards-exit-right { animation:slideOutRight 0.32s ease forwards }

                /* Modal */
                .modal-backdrop { position:fixed;inset:0;background:rgba(5,10,30,0.85);backdrop-filter:blur(6px);z-index:100;display:flex;align-items:center;justify-content:center;padding:24px }
                .modal-box { background:rgba(12,20,50,0.97);border:1px solid rgba(33,158,188,0.35);border-radius:24px;max-width:720px;width:100%;max-height:88vh;overflow-y:auto;animation:modalIn 0.35s cubic-bezier(.22,1,.36,1) forwards;position:relative }
                .modal-box::-webkit-scrollbar { width:6px }
                .modal-box::-webkit-scrollbar-track { background:transparent }
                .modal-box::-webkit-scrollbar-thumb { background:rgba(33,158,188,0.3);border-radius:3px }
                .modal-close { position:absolute;top:16px;right:16px;width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);color:rgba(200,215,240,0.7);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background 0.2s,color 0.2s }
                .modal-close:hover { background:rgba(239,68,68,0.15);color:#f87171;border-color:rgba(239,68,68,0.3) }

                .spinner { animation:spin 1s linear infinite }
            `}</style>

            <div className="min-h-screen bg-[#0A1128] relative overflow-x-hidden" style={{ fontFamily: "'Raleway', sans-serif" }}>

                <div className="nebula-blob" style={{ width: 460, height: 360, top: "-10%", left: "-5%", background: "rgba(33,158,188,0.08)", animationDelay: "0s" }} />
                <div className="nebula-blob" style={{ width: 380, height: 300, bottom: "5%", right: "-5%", background: "rgba(18,103,130,0.1)", animationDelay: "-9s" }} />

                {[
                    { top: "10%", left: "5%", size: 2, dur: "3s", delay: "0s" },
                    { top: "20%", left: "94%", size: 1.5, dur: "3.8s", delay: "-1.2s" },
                    { top: "70%", left: "3%", size: 2, dur: "4.2s", delay: "-2s" },
                    { top: "85%", left: "91%", size: 1.5, dur: "2.8s", delay: "-0.7s" },
                ].map((s, i) => (
                    <div key={i} className="star-dot" style={{ top: s.top, left: s.left, width: s.size, height: s.size, "--dur": s.dur, "--delay": s.delay } as React.CSSProperties} />
                ))}

                <div className="relative z-20 w-full"><Navbar /></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                    {/* Header */}
                    <div ref={headerRef} className={`text-center mb-14 anim-enter ${headerVisible ? "anim-fade-down" : ""}`}>
                        <h1 style={{ fontFamily: "'Raleway', sans-serif", fontSize: "clamp(2.4rem, 6vw, 4.5rem)", fontWeight: 900, color: "#fff", letterSpacing: "0.04em" }}>
                            Astronomy <span style={{ color: "#219EBC" }}>Blogs</span>
                        </h1>
                        <p style={{ color: "rgba(203,213,225,0.8)", maxWidth: 580, margin: "0 auto", fontWeight: 300, lineHeight: 1.75 }}>
                            Explore the latest articles, news, and discoveries written by our community.
                        </p>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                            <RefreshCw size={36} className="spinner" style={{ color: '#219EBC' }} />
                        </div>
                    )}

                    {/* Error */}
                    {error && !loading && (
                        <div style={{ textAlign: 'center', padding: '60px 0' }}>
                            <p style={{ color: '#f87171', marginBottom: 16 }}>{error}</p>
                            <button onClick={loadBlogs} style={{ background: 'rgba(33,158,188,0.15)', border: '1px solid rgba(33,158,188,0.4)', color: '#219EBC', padding: '10px 24px', borderRadius: 30, cursor: 'pointer', fontFamily: "'Raleway', sans-serif" }}>
                                Try again
                            </button>
                        </div>
                    )}

                    {/* Empty state */}
                    {!loading && !error && blogs.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(182,194,226,0.4)', fontFamily: "'Cinzel', serif", fontSize: '1.1rem' }}>
                            No blogs published yet. Check back soon!
                        </div>
                    )}

                    {/* Carousel */}
                    {!loading && blogs.length > 0 && (
                        <>
                            <div className="relative flex items-center gap-4">
                                <button onClick={() => slide('left')} disabled={currentSlide === 0 || isAnimating} className="nav-btn flex-shrink-0" aria-label="Previous">
                                    <ChevronLeft className="text-white" size={24} />
                                </button>

                                <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 ${animDir === 'right' ? 'cards-exit-left' : animDir === 'left' ? 'cards-exit-right' : ''}`}>
                                    {visiblePosts.map((post, i) => (
                                        <div
                                            key={post.id}
                                            className={`blog-card anim-enter ${mounted ? "anim-scale" : ""}`}
                                            style={{ animationDelay: `${0.1 + i * 0.12}s` }}
                                            onClick={() => setSelectedBlog(post)}
                                        >
                                            <div className="blog-card-img-wrap">
                                                <img
                                                    src={post.imageUrl || FALLBACK_IMAGE}
                                                    alt={post.title}
                                                    onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                                                />
                                                <div className="blog-card-overlay" />
                                                {post.category && <span className="blog-tag">{post.category}</span>}
                                            </div>
                                            <div style={{ padding: "24px 24px 28px", flex: 1, display: 'flex', flexDirection: 'column' }}>
                                                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.05rem", fontWeight: 700, color: "#fff", marginBottom: 8, lineHeight: 1.4 }}>
                                                    {post.title}
                                                </h3>
                                                <p style={{ color: "rgba(203,213,225,0.6)", fontSize: "0.72rem", marginBottom: 8 }}>
                                                    By {post.authorName} · {post.submittedAt}
                                                </p>
                                                <p style={{ color: "rgba(203,213,225,0.75)", fontSize: "0.85rem", lineHeight: 1.7, fontWeight: 300, flex: 1 }}>
                                                    {post.excerpt}
                                                </p>
                                                <div className="read-more">
                                                    Read more
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#219EBC" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button onClick={() => slide('right')} disabled={currentSlide >= maxSlide || isAnimating} className="nav-btn flex-shrink-0" aria-label="Next">
                                    <ChevronRight className="text-white" size={24} />
                                </button>
                            </div>

                            {/* Dots */}
                            {maxSlide > 0 && (
                                <div className="flex justify-center gap-2 mt-10">
                                    {Array.from({ length: maxSlide + 1 }).map((_, i) => (
                                        <button key={i} onClick={() => setCurrentSlide(i)} className={`dot-indicator ${currentSlide === i ? 'active' : ''}`} aria-label={`Go to slide ${i + 1}`} />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Blog detail modal */}
            {selectedBlog && (
                <div className="modal-backdrop" onClick={() => setSelectedBlog(null)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedBlog(null)}><X size={16} /></button>

                        {selectedBlog.imageUrl && (
                            <img
                                src={selectedBlog.imageUrl}
                                alt={selectedBlog.title}
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                style={{ width: '100%', height: 260, objectFit: 'cover', borderRadius: '24px 24px 0 0', display: 'block' }}
                            />
                        )}

                        <div style={{ padding: '32px 36px 36px' }}>
                            {selectedBlog.category && (
                                <span style={{ background: 'rgba(33,158,188,0.15)', border: '1px solid rgba(33,158,188,0.3)', color: '#219EBC', borderRadius: 30, padding: '3px 14px', fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: "'Raleway', sans-serif" }}>
                                    {selectedBlog.category}
                                </span>
                            )}

                            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.3rem, 3vw, 1.9rem)', fontWeight: 900, color: '#fff', margin: '16px 0 12px', lineHeight: 1.3 }}>
                                {selectedBlog.title}
                            </h2>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(182,194,226,0.6)', fontSize: '0.8rem' }}>
                                    <User size={13} /> {selectedBlog.authorName}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(182,194,226,0.6)', fontSize: '0.8rem' }}>
                                    <Calendar size={13} /> {selectedBlog.submittedAt}
                                </span>
                                {selectedBlog.category && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(182,194,226,0.6)', fontSize: '0.8rem' }}>
                                        <Tag size={13} /> {selectedBlog.category}
                                    </span>
                                )}
                            </div>

                            <div style={{ borderTop: '1px solid rgba(33,158,188,0.15)', paddingTop: 24 }}>
                                <p style={{ color: 'rgba(203,213,225,0.85)', fontSize: '0.95rem', lineHeight: 1.85, fontWeight: 300, whiteSpace: 'pre-wrap' }}>
                                    {selectedBlog.content}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CosmosBlogsPage;