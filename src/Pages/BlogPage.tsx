import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  User,
  Calendar,
  Tag,
  RefreshCw,
} from "lucide-react";
import Navbar from "../components/Navbar.tsx";
import { getApprovedBlogs, type BlogResponse } from "../services/api.ts";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&h=400&fit=crop";
const CARDS_PER_PAGE = 3;

const CosmosBlogsPage: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animDir, setAnimDir] = useState<"left" | "right" | null>(null);
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
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setHeaderVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 },
    );
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
      setError("Could not load blogs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const maxSlide = Math.max(0, blogs.length - CARDS_PER_PAGE);

  const slide = (dir: "left" | "right") => {
    if (isAnimating) return;
    setAnimDir(dir);
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) =>
        dir === "right" ? Math.min(prev + 1, maxSlide) : Math.max(prev - 1, 0),
      );
      setAnimDir(null);
      setIsAnimating(false);
    }, 320);
  };

  const visiblePosts = blogs.slice(currentSlide, currentSlide + CARDS_PER_PAGE);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedBlog(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <div
        className="min-h-screen bg-[#0d1d52] relative overflow-x-hidden"
        style={{ fontFamily: "'Raleway', sans-serif" }}
      >
        <div
          className="nebula-blob"
          style={{
            width: 460,
            height: 360,
            top: "-10%",
            left: "-5%",
            background: "rgba(33,158,188,0.08)",
            animationDelay: "0s",
          }}
        />
        <div
          className="nebula-blob"
          style={{
            width: 380,
            height: 300,
            bottom: "5%",
            right: "-5%",
            background: "rgba(18,103,130,0.1)",
            animationDelay: "-9s",
          }}
        />

        {[
          { top: "10%", left: "5%", size: 2, dur: "3s", delay: "0s" },
          { top: "20%", left: "94%", size: 1.5, dur: "3.8s", delay: "-1.2s" },
          { top: "70%", left: "3%", size: 2, dur: "4.2s", delay: "-2s" },
          { top: "85%", left: "91%", size: 1.5, dur: "2.8s", delay: "-0.7s" },
        ].map((s, i) => (
          <div
            key={i}
            className="star-dot"
            style={
              {
                top: s.top,
                left: s.left,
                width: s.size,
                height: s.size,
                "--dur": s.dur,
                "--delay": s.delay,
              } as React.CSSProperties
            }
          />
        ))}

        <div className="relative z-20 w-full">
          <Navbar />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div
            className={`text-center mb-4 anim-enter ${mounted ? "anim-fade-down" : ""}`}
          >
            <h1
              style={{
                fontFamily: "'Raleway', sans-serif",
                fontSize: "clamp(1.8rem, 4vw, 3rem)",
                fontWeight: 900,
                color: "#fff",
                letterSpacing: "0.04em",
              }}
            >
              Astronomy <span style={{ color: "#219EBC" }}>Blogs</span>
            </h1>
            <p
              style={{
                color: "rgba(203,213,225,0.8)",
                fontSize: "0.9rem",
                fontWeight: 300,
              }}
            >
              Explore the latest articles, news, and discoveries written by our
              community.
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "80px 0",
              }}
            >
              <RefreshCw
                size={36}
                className="spinner"
                style={{ color: "#219EBC" }}
              />
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <p style={{ color: "#f87171", marginBottom: 16 }}>{error}</p>
              <button
                onClick={loadBlogs}
                style={{
                  background: "rgba(33,158,188,0.15)",
                  border: "1px solid rgba(33,158,188,0.4)",
                  color: "#219EBC",
                  padding: "10px 24px",
                  borderRadius: 30,
                  cursor: "pointer",
                  fontFamily: "'Raleway', sans-serif",
                }}
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && blogs.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "80px 0",
                color: "rgba(182,194,226,0.4)",
                fontFamily: "'Cinzel', serif",
                fontSize: "1.1rem",
              }}
            >
              No blogs published yet. Check back soon!
            </div>
          )}

          {/* Carousel */}
          {!loading && blogs.length > 0 && (
            <>
              <div className="relative flex items-center gap-4">
                <button
                  onClick={() => slide("left")}
                  disabled={currentSlide === 0 || isAnimating}
                  className="nav-btn flex-shrink-0"
                  aria-label="Previous"
                >
                  <ChevronLeft className="text-white" size={24} />
                </button>

                <div
                  className={`grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 auto-rows-fr ${animDir === "right" ? "cards-exit-left" : animDir === "left" ? "cards-exit-right" : ""}`}
                >
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
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                          }}
                        />
                        <div className="blog-card-overlay" />
                        {post.category && (
                          <span className="blog-tag">{post.category}</span>
                        )}
                      </div>
                      <div
                        style={{
                          padding: "26px 26px 40px",
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <h3
                          style={{
                            fontFamily: "'Raleway', sans-serif",
                            fontSize: "1.05rem",
                            fontWeight: 700,
                            color: "#fff",
                            marginBottom: 8,
                            lineHeight: 1.4,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            minHeight: "2.9em",
                          }}
                        >
                          {post.title}
                        </h3>
                        <p
                          style={{
                            color: "rgba(203,213,225,0.6)",
                            fontSize: "0.72rem",
                            marginBottom: 8,
                          }}
                        >
                          By {post.authorName} · {post.submittedAt}
                        </p>
                        <p
                          style={{
                            color: "rgba(203,213,225,0.75)",
                            fontSize: "0.85rem",
                            lineHeight: 1.7,
                            fontWeight: 300,
                            flex: 1,
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {post.excerpt}
                        </p>
                        <div className="read-more">
                          Read more
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#219EBC"
                            strokeWidth="2"
                          >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => slide("right")}
                  disabled={currentSlide >= maxSlide || isAnimating}
                  className="nav-btn flex-shrink-0"
                  aria-label="Next"
                >
                  <ChevronRight className="text-white" size={24} />
                </button>
              </div>

              {/* Dots */}
              {maxSlide > 0 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: maxSlide + 1 }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={`dot-indicator ${currentSlide === i ? "active" : ""}`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
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
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setSelectedBlog(null)}
            >
              <X size={16} />
            </button>

            {selectedBlog.imageUrl && (
              <img
                src={selectedBlog.imageUrl}
                alt={selectedBlog.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
                style={{
                  width: "100%",
                  height: 260,
                  objectFit: "cover",
                  borderRadius: "24px 24px 0 0",
                  display: "block",
                }}
              />
            )}

            <div style={{ padding: "32px 36px 36px" }}>
              {selectedBlog.category && (
                <span
                  style={{
                    background: "rgba(33,158,188,0.15)",
                    border: "1px solid rgba(33,158,188,0.3)",
                    color: "#219EBC",
                    borderRadius: 30,
                    padding: "3px 14px",
                    fontSize: "0.68rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    fontFamily: "'Raleway', sans-serif",
                  }}
                >
                  {selectedBlog.category}
                </span>
              )}

              <h2
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "clamp(1.3rem, 3vw, 1.9rem)",
                  fontWeight: 900,
                  color: "#fff",
                  margin: "16px 0 12px",
                  lineHeight: 1.3,
                }}
              >
                {selectedBlog.title}
              </h2>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 16,
                  marginBottom: 24,
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "rgba(182,194,226,0.6)",
                    fontSize: "0.8rem",
                  }}
                >
                  <User size={13} /> {selectedBlog.authorName}
                </span>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "rgba(182,194,226,0.6)",
                    fontSize: "0.8rem",
                  }}
                >
                  <Calendar size={13} /> {selectedBlog.submittedAt}
                </span>
                {selectedBlog.category && (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      color: "rgba(182,194,226,0.6)",
                      fontSize: "0.8rem",
                    }}
                  >
                    <Tag size={13} /> {selectedBlog.category}
                  </span>
                )}
              </div>

              <div
                style={{
                  borderTop: "1px solid rgba(33,158,188,0.15)",
                  paddingTop: 24,
                }}
              >
                <p
                  style={{
                    color: "rgba(203,213,225,0.85)",
                    fontSize: "0.95rem",
                    lineHeight: 1.85,
                    fontWeight: 300,
                    whiteSpace: "pre-wrap",
                  }}
                >
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
