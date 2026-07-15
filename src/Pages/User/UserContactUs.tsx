import React, { useState, useEffect, useRef } from "react";
import {
  Mail,
  Phone,
  Hash,
  Twitter,
  Instagram,
  Facebook,
  Loader2,
  CheckCircle,
} from "lucide-react";
import api from "../../services/api";
import UserNavbar from "../../components/UserNavbar";

const ContactUsPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
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
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setContentVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(contentRef.current);
    return () => obs.disconnect();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async () => {
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await api.post("/contact", formData);
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          "Failed to send message. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="h-screen overflow-hidden bg-[#0d1d52] relative flex flex-col"
        style={{ fontFamily: "'Raleway', sans-serif" }}
      >
        {/* Nebula blobs */}
        <div
          className="nebula-blob"
          style={{
            width: 440,
            height: 360,
            top: "-8%",
            left: "-5%",
            background: "rgba(33,158,188,0.08)",
            animationDelay: "0s",
          }}
        />
        <div
          className="nebula-blob"
          style={{
            width: 360,
            height: 300,
            bottom: "5%",
            right: "-5%",
            background: "rgba(18,103,130,0.1)",
            animationDelay: "-9s",
          }}
        />

        {/* Star dots */}
        {[
          { top: "10%", left: "6%", size: 2, dur: "3s", delay: "0s" },
          { top: "22%", left: "93%", size: 1.5, dur: "3.8s", delay: "-1.2s" },
          { top: "65%", left: "4%", size: 2, dur: "4.2s", delay: "-2s" },
          { top: "82%", left: "90%", size: 1.5, dur: "2.8s", delay: "-0.7s" },
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

        {/* Navbar */}
        <div className="relative z-20 w-full flex-shrink-0">
          <UserNavbar />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 justify-center px-4 sm:px-6 lg:px-8 py-16">
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
              Contact <span style={{ color: "#219EBC" }}>Us</span>
            </h1>
            <p
              style={{
                color: "rgba(203,213,225,0.8)",
                fontSize: "0.9rem",
                fontWeight: 300,
              }}
            >
              We're here to help! Reach out with any questions or feedback.
            </p>
          </div>

          {/* Cards grid */}
          <div
            ref={contentRef}
            className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto w-full"
          >
            {/* Form card */}
            <div
              className={`glass-card anim-enter ${contentVisible ? "anim-fade-left" : ""}`}
              style={{ animationDelay: "0.1s", padding: "20px" }}
            >
              {submitted && (
                <div className="success-banner mb-3">
                  <CheckCircle
                    size={18}
                    style={{ color: "#219EBC", flexShrink: 0, marginTop: 2 }}
                  />
                  <div>
                    <p
                      style={{
                        color: "#219EBC",
                        fontWeight: 600,
                        marginBottom: 2,
                        fontSize: "0.9rem",
                      }}
                    >
                      Message Sent!
                    </p>
                    <p
                      style={{
                        color: "rgba(203,213,225,0.8)",
                        fontSize: "0.78rem",
                      }}
                    >
                      Thank you for reaching out. We'll get back to you as soon
                      as possible.
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div
                  style={{
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    borderRadius: 10,
                    padding: "8px 14px",
                    marginBottom: 12,
                    color: "#f87171",
                    fontSize: "0.8rem",
                  }}
                >
                  {error}
                </div>
              )}

              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {(["name", "email"] as const).map((field) => (
                  <div key={field} className="field-wrap">
                    <label
                      className={`field-label ${focused === field ? "focused" : ""}`}
                      htmlFor={field}
                      style={{ fontSize: "0.8rem" }}
                    >
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      id={field}
                      name={field}
                      type={field === "email" ? "email" : "text"}
                      value={formData[field]}
                      onChange={handleChange}
                      onFocus={() => setFocused(field)}
                      onBlur={() => setFocused(null)}
                      placeholder={`Enter your ${field}`}
                      className="field-input"
                      style={{ padding: "8px 12px", fontSize: "0.85rem" }}
                    />
                  </div>
                ))}

                <div className="field-wrap">
                  <label
                    className={`field-label ${focused === "message" ? "focused" : ""}`}
                    htmlFor="message"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocused("message")}
                    onBlur={() => setFocused(null)}
                    placeholder="Enter your message"
                    rows={4}
                    className="field-input"
                    style={{
                      resize: "none",
                      padding: "8px 12px",
                      fontSize: "0.85rem",
                    }}
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="submit-btn"
                  style={{ padding: "10px" }}
                >
                  {loading ? (
                    <>
                      <Loader2
                        size={16}
                        style={{ animation: "spin 1s linear infinite" }}
                      />{" "}
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </div>
            </div>

            {/* Info card */}
            <div
              className={`glass-card anim-enter ${contentVisible ? "anim-fade-right" : ""}`}
              style={{ animationDelay: "0.2s", padding: "20px" }}
            >
              <h2
                style={{
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: 14,
                  textAlign: "center",
                }}
              >
                Other Ways to <span style={{ color: "#219EBC" }}>Reach Us</span>
              </h2>

              <div>
                <div className="contact-row" style={{ marginBottom: 10 }}>
                  <div className="contact-icon-box">
                    <Mail size={18} color="#219EBC" />
                  </div>
                  <div>
                    <p
                      style={{
                        color: "#fff",
                        fontWeight: 600,
                        marginBottom: 2,
                        fontSize: "0.85rem",
                      }}
                    >
                      Email
                    </p>
                    <a
                      href="mailto:srilanka.smartplanetarium@gmail.com"
                      className="link-hover"
                      style={{ fontSize: "0.8rem" }}
                    >
                      srilanka.smartplanetarium@gmail.com
                    </a>
                  </div>
                </div>

                <div className="contact-row" style={{ marginBottom: 10 }}>
                  <div className="contact-icon-box">
                    <Phone size={18} color="#219EBC" />
                  </div>
                  <div>
                    <p
                      style={{
                        color: "#fff",
                        fontWeight: 600,
                        marginBottom: 2,
                        fontSize: "0.85rem",
                      }}
                    >
                      Phone
                    </p>
                    <a
                      href="tel:+94111234567"
                      className="link-hover"
                      style={{ fontSize: "0.8rem" }}
                    >
                      +94 11 123 4567
                    </a>
                  </div>
                </div>

                <div className="contact-row">
                  <div className="contact-icon-box">
                    <Hash size={18} color="#219EBC" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        color: "#fff",
                        fontWeight: 600,
                        marginBottom: 2,
                        fontSize: "0.85rem",
                      }}
                    >
                      Social Media
                    </p>
                    <p
                      style={{
                        color: "rgba(203,213,225,0.65)",
                        fontSize: "0.76rem",
                        marginBottom: 8,
                      }}
                    >
                      Connect with us on social media
                    </p>
                    <div style={{ display: "flex", gap: 10 }}>
                      {[
                        { Icon: Twitter, label: "Twitter" },
                        { Icon: Instagram, label: "Instagram" },
                        { Icon: Facebook, label: "Facebook" },
                      ].map(({ Icon, label }) => (
                        <a
                          key={label}
                          href="#"
                          className="social-btn"
                          aria-label={label}
                        >
                          <Icon size={16} />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Map placeholder */}
              <div
                style={{
                  marginTop: 14,
                  borderRadius: 12,
                  overflow: "hidden",
                  border: "1px solid rgba(33,158,188,0.2)",
                  height: 80,
                  background: "rgba(33,158,188,0.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: 4,
                  cursor: "pointer",
                  transition: "background 0.25s, border-color 0.25s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background =
                    "rgba(33,158,188,0.1)";
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    "rgba(33,158,188,0.45)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background =
                    "rgba(33,158,188,0.05)";
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    "rgba(33,158,188,0.2)";
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#219EBC"
                  strokeWidth="1.5"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span
                  style={{
                    color: "rgba(203,213,225,0.6)",
                    fontSize: "0.72rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Colombo, Sri Lanka
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUsPage;
