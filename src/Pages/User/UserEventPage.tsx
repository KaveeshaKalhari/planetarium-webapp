import React, { useState, useEffect, useRef } from "react";
import UserNavbar from "../../components/UserNavbar.tsx";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

type HighlightType = "yellow" | "blue" | "red";
type CalendarProps = {
  year: number;
  month: number;
  highlights?: Record<number, HighlightType>;
  onDayClick?: (day: number) => void;
};

const HIGHLIGHT_STYLES: Record<HighlightType, string> = {
  yellow: "bg-[#FFD600] text-black font-bold rounded-full cursor-pointer",
  blue: "bg-[#219EBC] text-white font-bold rounded-full cursor-pointer",
  red: "bg-[#FF3B3B] text-white font-bold rounded-full cursor-pointer",
};

const Calendar: React.FC<CalendarProps> = ({ year, month, highlights = {}, onDayClick }) => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);
  const days: (number | null)[] = Array(firstDay).fill(null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );
  while (days.length < 35) days.push(null);
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  return (
    <div className="cal-card">
      <div style={{ textAlign: "center", fontFamily: "'Cinzel', serif", color: "#219EBC", fontWeight: 700, fontSize: "1rem", marginBottom: 12, letterSpacing: "0.06em" }}>
        {monthNames[month]} {year}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, textAlign: "center" }}>
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i} style={{ fontSize: "0.68rem", color: "rgba(182,194,226,0.6)", letterSpacing: "0.1em", paddingBottom: 6 }}>{d}</span>
        ))}
        {days.map((day, i) => {
          const hlType = day ? highlights[day] : undefined;
          const isToday = isCurrentMonth && day === today.getDate();
          return (
            <span
              key={i}
              onClick={() => day && hlType && onDayClick?.(day)}
              className={hlType ? HIGHLIGHT_STYLES[hlType] : ""}
              style={{
                padding: "5px 0",
                fontSize: "0.82rem",
                color: hlType ? undefined : isToday ? "#219EBC" : "rgba(182,194,226,0.8)",
                borderRadius: hlType ? "50%" : isToday ? "50%" : undefined,
                border: isToday && !hlType ? "1px solid rgba(33,158,188,0.5)" : undefined,
                transition: "transform 0.15s",
                cursor: day && hlType ? "pointer" : "default",
              }}
              onMouseEnter={e => { if (day && hlType) (e.currentTarget as HTMLElement).style.transform = "scale(1.2)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
            >
              {day || ""}
            </span>
          );
        })}
      </div>
    </div>
  );
};

type EventCard = {
  id: number;
  title: string;
  description: string;
  date: string;
  type: HighlightType;
  icon: string;
  badge?: string;
};

const events: EventCard[] = [
  { id: 1, title: "Solar Eclipse Viewing", description: "Witness a rare total solar eclipse through our specially equipped telescopes. Expert astronomers will guide you through this breathtaking celestial event.", date: "July 6, 2024 | 1:00 PM – 3:00 PM", type: "yellow", icon: "☀️", badge: "Special Event" },
  { id: 2, title: "Lunar Eclipse Viewing", description: "Watch the Moon slip into Earth's shadow in a stunning display of celestial mechanics. Hot beverages and stargazing kits included.", date: "July 15, 2024 | 8:00 PM – 11:00 PM", type: "blue", icon: "🌕", badge: undefined },
  { id: 3, title: "Halley's Comet Watch Night", description: "A once-in-a-generation opportunity to observe Halley's Comet with our high-powered observatory telescopes alongside leading astronomers.", date: "July 25, 2024 | 9:00 PM – 1:00 AM", type: "red", icon: "☄️", badge: "Rare Event" },
];

const BORDER_COLORS: Record<HighlightType, string> = {
  yellow: "rgba(255,214,0,0.55)",
  blue: "rgba(33,158,188,0.55)",
  red: "rgba(255,59,59,0.55)",
};
const GLOW_COLORS: Record<HighlightType, string> = {
  yellow: "rgba(255,214,0,0.18)",
  blue: "rgba(33,158,188,0.18)",
  red: "rgba(255,59,59,0.18)",
};
const BADGE_COLORS: Record<HighlightType, string> = {
  yellow: "rgba(255,214,0,0.15)",
  blue: "rgba(33,158,188,0.15)",
  red: "rgba(255,59,59,0.15)",
};
const TEXT_COLORS: Record<HighlightType, string> = {
  yellow: "#FFD600",
  blue: "#219EBC",
  red: "#FF3B3B",
};

const EventPage: React.FC = () => {
  const [leftYear, setLeftYear] = useState(2024);
  const [leftMonth, setLeftMonth] = useState(6);
  const [mounted, setMounted] = useState(false);
  const [sectionsVisible, setSectionsVisible] = useState([false, false, false]);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sectionRefs.current.forEach((ref, i) => {
      if (!ref) return;
      const obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { setSectionsVisible(p => { const n = [...p]; n[i] = true; return n; }); obs.disconnect(); }
      }, { threshold: 0.12 });
      obs.observe(ref);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const handlePrev = () => {
    let m = leftMonth - 1, y = leftYear;
    if (m < 0) { m = 11; y--; }
    setLeftMonth(m); setLeftYear(y);
  };
  const handleNext = () => {
    let m = leftMonth + 1, y = leftYear;
    if (m > 11) { m = 0; y++; }
    setLeftMonth(m); setLeftYear(y);
  };

  let rightMonth = leftMonth + 1, rightYear = leftYear;
  if (rightMonth > 11) { rightMonth = 0; rightYear++; }

  const highlights1: Record<number, HighlightType> = { 6: "yellow", 15: "blue", 25: "red" };
  const highlights2: Record<number, HighlightType> = { 9: "blue" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Raleway:wght@300;400;600&display=swap');

        @keyframes fadeSlideDown  { from{opacity:0;transform:translateY(-28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeSlideUp    { from{opacity:0;transform:translateY(36px)}  to{opacity:1;transform:translateY(0)} }
        @keyframes fadeSlideLeft  { from{opacity:0;transform:translateX(-40px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fadeSlideRight { from{opacity:0;transform:translateX(40px)}  to{opacity:1;transform:translateX(0)} }
        @keyframes scaleFadeIn    { from{opacity:0;transform:scale(0.9)}        to{opacity:1;transform:scale(1)} }
        @keyframes nebulaDrift    { 0%{transform:translate(0,0) scale(1)} 33%{transform:translate(25px,-18px) scale(1.04)} 66%{transform:translate(-18px,14px) scale(0.97)} 100%{transform:translate(0,0) scale(1)} }
        @keyframes twinkle        { 0%,100%{opacity:0.3} 50%{opacity:1} }
        @keyframes lineExpand     { from{width:0;opacity:0} to{width:64px;opacity:1} }
        @keyframes calPulse       { 0%,100%{box-shadow:0 0 0 0 rgba(33,158,188,0.2)} 50%{box-shadow:0 0 0 8px rgba(33,158,188,0)} }
        @keyframes btnGlow        { 0%,100%{box-shadow:0 0 12px rgba(33,158,188,0.4)} 50%{box-shadow:0 0 24px rgba(33,158,188,0.75)} }

        .anim-enter { opacity:0; }
        .anim-fade-down  { animation:fadeSlideDown  0.8s cubic-bezier(.22,1,.36,1) forwards; }
        .anim-fade-up    { animation:fadeSlideUp    0.8s cubic-bezier(.22,1,.36,1) forwards; }
        .anim-fade-left  { animation:fadeSlideLeft  0.85s cubic-bezier(.22,1,.36,1) forwards; }
        .anim-fade-right { animation:fadeSlideRight 0.85s cubic-bezier(.22,1,.36,1) forwards; }
        .anim-scale      { animation:scaleFadeIn    0.8s cubic-bezier(.22,1,.36,1) forwards; }

        .nebula-blob { position:fixed;border-radius:50%;filter:blur(90px);pointer-events:none;z-index:0;animation:nebulaDrift 20s ease-in-out infinite; }
        .star-dot    { position:fixed;border-radius:50%;background:rgba(200,230,255,0.9);pointer-events:none;z-index:0;animation:twinkle var(--dur,3s) ease-in-out infinite;animation-delay:var(--delay,0s); }

        .divider-line { display:inline-block;height:1px;background:linear-gradient(90deg,transparent,rgba(33,158,188,0.7),transparent);animation:lineExpand 1s cubic-bezier(.22,1,.36,1) 0.5s both;width:64px; }
        .eyebrow { font-family:'Raleway',sans-serif;font-size:0.68rem;letter-spacing:0.28em;text-transform:uppercase;color:#219EBC;border:1px solid rgba(33,158,188,0.35);border-radius:40px;padding:4px 16px;display:inline-block;margin-bottom:16px;background:rgba(33,158,188,0.07); }

        /* Calendar card */
        .cal-card {
          background: rgba(15,24,52,0.75);
          border: 1px solid rgba(33,158,188,0.25);
          border-radius: 16px; padding: 24px;
          width: 272px; backdrop-filter: blur(10px);
          transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;
          animation: calPulse 4s ease-in-out infinite;
        }
        .cal-card:hover {
          border-color: rgba(33,158,188,0.6);
          box-shadow: 0 12px 40px rgba(33,158,188,0.2);
          transform: translateY(-4px);
          animation: none;
        }

        /* Nav arrow buttons */
        .nav-arrow {
          width: 44px; height: 44px; border-radius: 50%;
          border: 1px solid rgba(33,158,188,0.3);
          background: rgba(15,24,52,0.7);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: rgba(182,194,226,0.8); font-size: 1.2rem;
          transition: background 0.22s, border-color 0.22s, transform 0.22s, box-shadow 0.22s;
          backdrop-filter: blur(6px); flex-shrink: 0;
        }
        .nav-arrow:hover {
          background: rgba(33,158,188,0.18);
          border-color: rgba(33,158,188,0.7);
          transform: scale(1.1);
          box-shadow: 0 0 16px rgba(33,158,188,0.35);
          color: #219EBC;
        }

        /* Notify box */
        .notify-box {
          background: rgba(15,24,52,0.75);
          border: 1px solid rgba(33,158,188,0.3);
          border-radius: 18px; padding: 24px 28px;
          backdrop-filter: blur(10px);
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .notify-box:hover {
          border-color: rgba(33,158,188,0.6);
          box-shadow: 0 8px 36px rgba(33,158,188,0.12);
        }

        .notify-input {
          flex: 1; padding: 10px 16px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px; color: #fff;
          font-family: 'Raleway', sans-serif; font-size: 0.88rem;
          outline: none; transition: border-color 0.25s, box-shadow 0.25s;
        }
        .notify-input::placeholder { color: rgba(182,194,226,0.35); }
        .notify-input:focus {
          border-color: rgba(33,158,188,0.6);
          box-shadow: 0 0 0 3px rgba(33,158,188,0.1);
        }

        .subscribe-btn {
          padding: 10px 22px; border-radius: 8px;
          background: linear-gradient(135deg, #219EBC, #126782);
          color: #fff; font-family: 'Raleway', sans-serif;
          font-weight: 600; font-size: 0.82rem; letter-spacing: 0.1em;
          text-transform: uppercase; border: none; cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          animation: btnGlow 3s ease-in-out infinite;
        }
        .subscribe-btn:hover {
          transform: translateY(-2px) scale(1.04);
          box-shadow: 0 6px 22px rgba(33,158,188,0.5);
          animation: none;
        }

        /* Event cards */
        .event-card {
          background: rgba(15,24,52,0.75);
          border-radius: 18px; padding: 28px;
          backdrop-filter: blur(10px);
          display: flex; flex-direction: column;
          gap: 10px;
          transition: transform 0.32s cubic-bezier(.22,1,.36,1),
                      box-shadow 0.3s, border-color 0.3s;
          cursor: pointer;
          position: relative; overflow: hidden;
        }
        .event-card::before {
          content: '';
          position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
          border-radius: 3px 0 0 3px;
          transition: width 0.3s;
        }
        .event-card:hover::before { width: 5px; }
        .event-card:hover {
          transform: translateX(6px) translateY(-3px);
        }

        .event-icon {
          width: 48px; height: 48px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.4rem; flex-shrink: 0;
          transition: transform 0.3s;
        }
        .event-card:hover .event-icon { transform: scale(1.15) rotate(-5deg); }

        .event-badge {
          display: inline-block; padding: 2px 12px; border-radius: 30px;
          font-family: 'Raleway', sans-serif; font-size: 0.62rem;
          letter-spacing: 0.16em; text-transform: uppercase; font-weight: 600;
        }

        .register-btn {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: 'Raleway', sans-serif; font-size: 0.75rem;
          letter-spacing: 0.14em; text-transform: uppercase;
          padding: 8px 20px; border-radius: 30px;
          border: 1px solid; cursor: pointer;
          transition: background 0.22s, transform 0.22s, box-shadow 0.22s;
          background: transparent;
        }
        .register-btn:hover {
          transform: translateY(-2px);
        }

        input[type="checkbox"] { accent-color: #219EBC; }
      `}</style>

      <div className="min-h-screen bg-[#0A1128] relative overflow-x-hidden pb-16" style={{ fontFamily: "'Raleway', sans-serif" }}>

        {/* Nebula blobs */}
        <div className="nebula-blob" style={{ width: 460, height: 360, top: "-10%", left: "-5%", background: "rgba(33,158,188,0.08)", animationDelay: "0s" }} />
        <div className="nebula-blob" style={{ width: 380, height: 300, bottom: "5%", right: "-5%", background: "rgba(18,103,130,0.1)", animationDelay: "-9s" }} />
        <div className="nebula-blob" style={{ width: 260, height: 260, top: "50%", left: "45%", background: "rgba(255,214,0,0.04)", animationDelay: "-5s" }} />

        {/* Star dots */}
        {[
          { top: "10%", left: "6%", size: 2, dur: "3s", delay: "0s" },
          { top: "20%", left: "93%", size: 1.5, dur: "3.8s", delay: "-1.2s" },
          { top: "55%", left: "3%", size: 2, dur: "4.2s", delay: "-2s" },
          { top: "78%", left: "91%", size: 1.5, dur: "2.8s", delay: "-0.7s" },
          { top: "40%", left: "97%", size: 1, dur: "3.5s", delay: "-1.5s" },
        ].map((s, i) => (
          <div key={i} className="star-dot" style={{ top: s.top, left: s.left, width: s.size, height: s.size, "--dur": s.dur, "--delay": s.delay } as React.CSSProperties} />
        ))}

        {/* Navbar */}
        <div className="relative z-10"><UserNavbar /></div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className={`text-center mt-14 mb-10 anim-enter ${mounted ? "anim-fade-down" : ""}`}>
            <h1 style={{ fontFamily: "'Raleway', sans-serif", fontSize: "clamp(2.4rem,6vw,4.5rem)", fontWeight: 900, color: "#fff", letterSpacing: "0.04em" }}>
              Upcoming <span style={{ color: "#219EBC" }}>Events</span>
            </h1>
            <p style={{ color: "rgba(203,213,225,0.8)", maxWidth: 560, margin: "0 auto", fontWeight: 300, lineHeight: 1.75 }}>
              Explore the cosmos with our exciting events. From stargazing nights to expert talks, there's something for everyone.
            </p>
          </div>

          {/* Notification box */}
          <div
            ref={el => { sectionRefs.current[0] = el; }}
            className={`notify-box mb-12 anim-enter ${sectionsVisible[0] ? "anim-fade-up" : ""}`}
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(33,158,188,0.15)", border: "1px solid rgba(33,158,188,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#219EBC" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" /></svg>
                  </div>
                  <span style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: "1rem", color: "#fff" }}>Stay Notified</span>
                </div>
                <p style={{ color: "rgba(182,194,226,0.7)", fontSize: "0.82rem", lineHeight: 1.6 }}>
                  Never miss a celestial event. Subscribe to get reminders for upcoming events.
                </p>
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  {subscribed ? (
                    <div style={{ flex: 1, padding: "10px 16px", borderRadius: 8, background: "rgba(33,158,188,0.1)", border: "1px solid rgba(33,158,188,0.35)", color: "#219EBC", fontSize: "0.85rem", fontWeight: 600, textAlign: "center" }}>
                      ✓ You're subscribed!
                    </div>
                  ) : (
                    <>
                      <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} className="notify-input" />
                      <button className="subscribe-btn" onClick={() => email && setSubscribed(true)}>Subscribe</button>
                    </>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: "0.75rem", color: "rgba(182,194,226,0.65)" }}>
                  <span style={{ letterSpacing: "0.08em" }}>Alert Preferences:</span>
                  {["1 day before", "1 hour before"].map(label => (
                    <label key={label} style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
                      <input type="checkbox" defaultChecked={label === "1 day before"} />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Calendars */}
          <div
            ref={el => { sectionRefs.current[1] = el; }}
            className={`anim-enter ${sectionsVisible[1] ? "anim-scale" : ""} mb-14`}
            style={{ animationDelay: "0.1s" }}
          >
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
              <button className="nav-arrow" onClick={handlePrev}>&#60;</button>
              <Calendar year={leftYear} month={leftMonth} highlights={highlights1} />
              <Calendar year={rightYear} month={rightMonth} highlights={highlights2} />
              <button className="nav-arrow" onClick={handleNext}>&#62;</button>
            </div>

            {/* Legend */}
            <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 16, flexWrap: "wrap" }}>
              {[
                { color: "#FFD600", label: "Special Event" },
                { color: "#219EBC", label: "Regular Event" },
                { color: "#FF3B3B", label: "Rare Event" },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: "0.72rem", color: "rgba(182,194,226,0.7)", letterSpacing: "0.1em" }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, display: "inline-block", boxShadow: `0 0 6px ${color}` }} />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Event Cards */}
          <div
            ref={el => { sectionRefs.current[2] = el; }}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            {events.map((ev, i) => {
              const isHovered = hoveredCard === ev.id;
              const borderColor = BORDER_COLORS[ev.type];
              const glowColor = GLOW_COLORS[ev.type];
              const badgeColor = BADGE_COLORS[ev.type];
              const textColor = TEXT_COLORS[ev.type];

              return (
                <div
                  key={ev.id}
                  className={`event-card anim-enter ${sectionsVisible[2] ? "anim-fade-left" : ""}`}
                  style={{
                    animationDelay: `${0.1 + i * 0.12}s`,
                    border: `1px solid ${isHovered ? borderColor : borderColor.replace("0.55", "0.3")}`,
                    boxShadow: isHovered ? `0 12px 40px ${glowColor}, inset 0 0 0 1px ${borderColor}` : "none",
                  }}
                  onMouseEnter={() => setHoveredCard(ev.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Accent bar */}
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: isHovered ? 5 : 3, borderRadius: "3px 0 0 3px", background: textColor, transition: "width 0.3s" }} />

                  <div style={{ display: "flex", alignItems: "flex-start", gap: 16, paddingLeft: 8 }}>
                    {/* Icon */}
                    <div
                      className="event-icon"
                      style={{ background: badgeColor, border: `1px solid ${borderColor}` }}
                    >
                      {ev.icon}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
                        <span style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: "1.05rem", color: "#fff" }}>
                          {ev.title}
                        </span>
                        {ev.badge && (
                          <span className="event-badge" style={{ background: badgeColor, border: `1px solid ${borderColor}`, color: textColor }}>
                            {ev.badge}
                          </span>
                        )}
                      </div>
                      <p style={{ color: "rgba(182,194,226,0.75)", fontSize: "0.85rem", lineHeight: 1.7, fontWeight: 300, marginBottom: 10 }}>
                        {ev.description}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 7, color: textColor, fontSize: "0.82rem", fontWeight: 600 }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                          {ev.date}
                        </div>
                        <button
                          className="register-btn"
                          style={{ borderColor, color: textColor }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = badgeColor; (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 16px ${glowColor}`; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                        >
                          Register
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default EventPage;