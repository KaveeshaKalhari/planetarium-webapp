import React, { useEffect, useRef, useState } from "react";
import UserNavbar from "../../components/UserNavbar";
import audience from "../../assets/audience.png";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
}

const AboutUsPage: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visible, setVisible] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);

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
            setVisible((prev) => {
              const next = [...prev];
              next[i] = true;
              return next;
            });
            obs.disconnect();
          }
        },
        { threshold: 0.15 },
      );
      obs.observe(ref);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "Dr. Anya Sharma",
      role: "CEO & Founder",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    },
    {
      id: 2,
      name: "Ethan Carter",
      role: "Head of Technology",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    },
    {
      id: 3,
      name: "Olivia Bennett",
      role: "Director of Outreach",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    },
  ];

  return (
    <>
      <div
        className="min-h-screen bg-[#0d1d52] relative overflow-x-hidden"
        style={{ fontFamily: "'Raleway', sans-serif" }}
      >
        {/* Nebula blobs */}
        <div
          className="nebula-blob"
          style={{
            width: 480,
            height: 380,
            top: "-8%",
            left: "-6%",
            background: "rgba(33,158,188,0.08)",
            animationDelay: "0s",
          }}
        />
        <div
          className="nebula-blob"
          style={{
            width: 360,
            height: 320,
            bottom: "5%",
            right: "-5%",
            background: "rgba(18,103,130,0.1)",
            animationDelay: "-8s",
          }}
        />

        {/* Static star dots */}
        {[
          { top: "12%", left: "8%", size: 2, dur: "2.8s", delay: "0s" },
          { top: "25%", left: "92%", size: 1.5, dur: "3.5s", delay: "-1s" },
          { top: "60%", left: "4%", size: 2, dur: "4s", delay: "-2s" },
          { top: "80%", left: "88%", size: 1.5, dur: "2.5s", delay: "-0.5s" },
          { top: "45%", left: "96%", size: 1, dur: "3.2s", delay: "-1.5s" },
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
        <div className="relative z-20 w-full">
          <UserNavbar />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Hero heading */}
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
              About <span style={{ color: "#219EBC" }}>Planetarium</span>
            </h1>
            <p
              style={{
                color: "rgba(203,213,225,0.8)",
                fontSize: "0.9rem",
                fontWeight: 300,
              }}
            >
              Discover the story behind our mission to bring the wonders of the
              universe closer to you.
            </p>
          </div>

          {/* Mission & Vision + Image */}
          <div
            ref={(el) => {
              sectionRefs.current[1] = el;
            }}
            className="grid md:grid-cols-2 gap-8 mb-24"
          >
            {/* Left: cards */}
            <div
              className={`space-y-6 anim-enter ${visible[1] ? "anim-fade-left" : ""}`}
              style={{ animationDelay: "0.1s" }}
            >
              <div className="section-card">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "rgba(33,158,188,0.15)",
                      border: "1px solid rgba(33,158,188,0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#219EBC"
                      strokeWidth="2"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <h2
                    style={{
                      fontFamily: "'Raleway', sans-serif",
                      fontSize: "1.4rem",
                      fontWeight: 700,
                      color: "#fff",
                    }}
                  >
                    Our Mission
                  </h2>
                </div>
                <p
                  style={{
                    color: "rgba(203,213,225,0.8)",
                    lineHeight: 1.78,
                    fontWeight: 300,
                  }}
                >
                  At Cosmos, our mission is to make the wonders of the universe
                  accessible to everyone. We strive to create a space where
                  curiosity meets discovery, offering not just a planetarium
                  experience but one that enriches understanding and
                  appreciation of astronomy and space exploration.
                </p>
              </div>

              <div className="section-card">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "rgba(33,158,188,0.15)",
                      border: "1px solid rgba(33,158,188,0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#219EBC"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2a14.5 14.5 0 000 20 14.5 14.5 0 000-20" />
                      <path d="M2 12h20" />
                    </svg>
                  </div>
                  <h2
                    style={{
                      fontFamily: "'Raleway', sans-serif",
                      fontSize: "1.4rem",
                      fontWeight: 700,
                      color: "#fff",
                    }}
                  >
                    Our Vision
                  </h2>
                </div>
                <p
                  style={{
                    color: "rgba(203,213,225,0.8)",
                    lineHeight: 1.78,
                    fontWeight: 300,
                  }}
                >
                  Our vision is to become the leading platform for planetarium
                  bookings and space-related experiences. We aim to connect
                  people with the cosmos, inspire a new generation of space
                  explorers, and foster a community of space enthusiasts that
                  supports planetariums in reaching wider audiences.
                </p>
              </div>
            </div>

            {/* Right: image */}
            <div
              className={`flex items-center justify-center anim-enter ${visible[1] ? "anim-fade-right" : ""}`}
              style={{ animationDelay: "0.2s" }}
            >
              <div className="image-frame w-full" style={{ minHeight: 380 }}>
                <img
                  src={audience}
                  alt="Planetarium audience"
                  className="w-full h-full object-cover"
                  style={{ minHeight: 380 }}
                />
              </div>
            </div>
          </div>

          {/* Team heading */}
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
              Meet Our <span style={{ color: "#219EBC" }}>Team</span>
            </h1>
            <p
              style={{
                color: "rgba(203,213,225,0.8)",
                fontSize: "0.9rem",
                fontWeight: 300,
              }}
            >
              Our team is composed of passionate individuals with diverse
              backgrounds in astronomy, technology, and education.
            </p>
          </div>

          {/* Team grid */}
          <div
            ref={(el) => {
              sectionRefs.current[3] = el;
            }}
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
                <h3
                  style={{
                    fontFamily: "'Raleway', sans-serif",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "#fff",
                    marginBottom: 4,
                  }}
                >
                  {member.name}
                </h3>
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
