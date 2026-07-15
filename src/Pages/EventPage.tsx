import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar.tsx";
import { getUpcomingEvents, type EventDTO } from "../services/api.ts";
import EventDetailModal from "../components/EventDetailModal.tsx";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
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

const Calendar: React.FC<CalendarProps> = ({
  year,
  month,
  highlights = {},
  onDayClick,
}) => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);
  const days: (number | null)[] = Array(firstDay)
    .fill(null)
    .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));
  while (days.length < 35) days.push(null);
  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month;

  return (
    <div className="cal-card">
      <div
        style={{
          textAlign: "center",
          fontFamily: "'Cinzel', serif",
          color: "#219EBC",
          fontWeight: 700,
          fontSize: "1rem",
          marginBottom: 12,
          letterSpacing: "0.06em",
        }}
      >
        {monthNames[month]} {year}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7,1fr)",
          gap: 4,
          textAlign: "center",
        }}
      >
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span
            key={i}
            style={{
              fontSize: "0.68rem",
              color: "rgba(182,194,226,0.6)",
              letterSpacing: "0.1em",
              paddingBottom: 6,
            }}
          >
            {d}
          </span>
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
                color: hlType
                  ? undefined
                  : isToday
                    ? "#219EBC"
                    : "rgba(182,194,226,0.8)",
                borderRadius: hlType ? "50%" : isToday ? "50%" : undefined,
                border:
                  isToday && !hlType
                    ? "1px solid rgba(33,158,188,0.5)"
                    : undefined,
                transition: "transform 0.15s",
                cursor: day && hlType ? "pointer" : "default",
              }}
              onMouseEnter={(e) => {
                if (day && hlType)
                  (e.currentTarget as HTMLElement).style.transform =
                    "scale(1.2)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "scale(1)";
              }}
            >
              {day || ""}
            </span>
          );
        })}
      </div>
    </div>
  );
};

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

// Build calendar highlights from live events
function buildHighlights(events: EventDTO[]): Record<number, HighlightType> {
  const result: Record<number, HighlightType> = {};
  events.forEach((ev) => {
    // eventDate is a string like "2026-07-06" — extract day number
    const day = new Date(ev.eventDate).getDate();
    result[day] = ev.type as HighlightType;
  });
  return result;
}

const EventPage: React.FC = () => {
  const [events, setEvents] = useState<EventDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(false);
  const [subError, setSubError] = useState<string | null>(null);

  const [leftYear, setLeftYear] = useState(new Date().getFullYear());
  const [leftMonth, setLeftMonth] = useState(new Date().getMonth());
  const [mounted, setMounted] = useState(false);
  const [sectionsVisible, setSectionsVisible] = useState([false, false, false]);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [modalEvent, setModalEvent] = useState<EventDTO | null>(null);

  useEffect(() => {
    getUpcomingEvents()
      .then(setEvents)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sectionRefs.current.forEach((ref, i) => {
      if (!ref) return;
      const obs = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setSectionsVisible((p) => {
              const n = [...p];
              n[i] = true;
              return n;
            });
            obs.disconnect();
          }
        },
        { threshold: 0.12 },
      );
      obs.observe(ref);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const handlePrev = () => {
    let m = leftMonth - 1,
      y = leftYear;
    if (m < 0) {
      m = 11;
      y--;
    }
    setLeftMonth(m);
    setLeftYear(y);
  };
  const handleNext = () => {
    let m = leftMonth + 1,
      y = leftYear;
    if (m > 11) {
      m = 0;
      y++;
    }
    setLeftMonth(m);
    setLeftYear(y);
  };

  let rightMonth = leftMonth + 1,
    rightYear = leftYear;
  if (rightMonth > 11) {
    rightMonth = 0;
    rightYear++;
  }

  // Build highlights only for the months currently shown
  const highlights1 = buildHighlights(
    events.filter((ev) => {
      const d = new Date(ev.eventDate);
      return d.getFullYear() === leftYear && d.getMonth() === leftMonth;
    }),
  );
  const highlights2 = buildHighlights(
    events.filter((ev) => {
      const d = new Date(ev.eventDate);
      return d.getFullYear() === rightYear && d.getMonth() === rightMonth;
    }),
  );

  return (
    <>
      <div
        className="min-h-screen bg-[#0d1d52] relative overflow-x-hidden pb-16"
        style={{ fontFamily: "'Raleway', sans-serif" }}
      >
        {/* Nebula blobs */}
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
        <div
          className="nebula-blob"
          style={{
            width: 260,
            height: 260,
            top: "50%",
            left: "45%",
            background: "rgba(255,214,0,0.04)",
            animationDelay: "-5s",
          }}
        />

        {/* Star dots */}
        {[
          { top: "10%", left: "6%", size: 2, dur: "3s", delay: "0s" },
          { top: "20%", left: "93%", size: 1.5, dur: "3.8s", delay: "-1.2s" },
          { top: "55%", left: "3%", size: 2, dur: "4.2s", delay: "-2s" },
          { top: "78%", left: "91%", size: 1.5, dur: "2.8s", delay: "-0.7s" },
          { top: "40%", left: "97%", size: 1, dur: "3.5s", delay: "-1.5s" },
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
        <div className="relative z-10">
          <Navbar />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div
            className={`text-center mt-14 mb-10 anim-enter ${mounted ? "anim-fade-down" : ""}`}
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
              Natural <span style={{ color: "#219EBC" }}>Phenomena</span>
            </h1>
            <p
              style={{
                color: "rgba(203,213,225,0.8)",
                fontSize: "0.9rem",
                fontWeight: 300,
              }}
            >
              Witness the wonders of the natural world. From meteor showers to
              solar eclipses, stay informed about upcoming celestial and natural
              events.
            </p>
          </div>

          {/* Notification box */}
          <div
            ref={(el) => {
              sectionRefs.current[0] = el;
            }}
            className={`notify-box mb-12 anim-enter ${sectionsVisible[0] ? "anim-fade-up" : ""}`}
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 6,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: "rgba(33,158,188,0.15)",
                      border: "1px solid rgba(33,158,188,0.35)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#219EBC"
                      strokeWidth="2"
                    >
                      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
                    </svg>
                  </div>
                  <span
                    style={{
                      fontFamily: "'Raleway', sans-serif",
                      fontWeight: 700,
                      fontSize: "1rem",
                      color: "#fff",
                    }}
                  >
                    Stay Notified
                  </span>
                </div>
                <p
                  style={{
                    color: "rgba(182,194,226,0.7)",
                    fontSize: "0.82rem",
                    lineHeight: 1.6,
                  }}
                >
                  Never miss a celestial event. Subscribe to get reminders for
                  upcoming events.
                </p>
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div style={{ display: "flex", gap: 8 }}>
                  {subscribed ? (
                    <div
                      style={{
                        flex: 1,
                        padding: "10px 16px",
                        borderRadius: 8,
                        background: "rgba(33,158,188,0.1)",
                        border: "1px solid rgba(33,158,188,0.35)",
                        color: "#219EBC",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        textAlign: "center",
                      }}
                    >
                      ✓ You're subscribed!
                    </div>
                  ) : (
                    <>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="notify-input"
                      />
                      <button
                        className="subscribe-btn"
                        disabled={subLoading}
                        onClick={async () => {
                          if (!email) return;
                          setSubLoading(true);
                          setSubError(null);
                          try {
                            const res = await fetch(
                              "http://localhost:8080/api/v1/events/subscribe",
                              {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  email,
                                  alertDayBefore: true,
                                  alertHourBefore: false,
                                }),
                              },
                            );
                            const data = await res.json();
                            if (res.ok) {
                              setSubscribed(true);
                            } else {
                              setSubError(
                                data.message ?? "Failed to subscribe.",
                              );
                            }
                          } catch {
                            setSubError("Network error. Please try again.");
                          } finally {
                            setSubLoading(false);
                          }
                        }}
                      >
                        {subLoading ? "..." : "Subscribe"}
                      </button>
                    </>
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    fontSize: "0.75rem",
                    color: "rgba(182,194,226,0.65)",
                  }}
                >
                  <span style={{ letterSpacing: "0.08em" }}>
                    Alert Preferences:
                  </span>
                  {["1 day before", "1 hour before"].map((label) => (
                    <label
                      key={label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        defaultChecked={label === "1 day before"}
                      />
                      {label}
                      {subError && (
                        <span style={{ color: "#f87171", fontSize: "0.75rem" }}>
                          {subError}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Calendars */}
          <div
            ref={(el) => {
              sectionRefs.current[1] = el;
            }}
            className={`anim-enter ${sectionsVisible[1] ? "anim-scale" : ""} mb-14`}
            style={{ animationDelay: "0.1s" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 20,
                flexWrap: "wrap",
              }}
            >
              <button className="nav-arrow" onClick={handlePrev}>
                &#60;
              </button>
              <Calendar
                year={leftYear}
                month={leftMonth}
                highlights={highlights1}
              />
              <Calendar
                year={rightYear}
                month={rightMonth}
                highlights={highlights2}
              />
              <button className="nav-arrow" onClick={handleNext}>
                &#62;
              </button>
            </div>

            {/* Legend */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 20,
                marginTop: 16,
                flexWrap: "wrap",
              }}
            >
              {[
                { color: "#FFD600", label: "Special Event" },
                { color: "#219EBC", label: "Regular Event" },
                { color: "#FF3B3B", label: "Rare Event" },
              ].map(({ color, label }) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    fontSize: "0.72rem",
                    color: "rgba(182,194,226,0.7)",
                    letterSpacing: "0.1em",
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: color,
                      display: "inline-block",
                      boxShadow: `0 0 6px ${color}`,
                    }}
                  />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Event Cards */}
          <div
            ref={(el) => {
              sectionRefs.current[2] = el;
            }}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            {loading && (
              <p
                style={{
                  color: "rgba(182,194,226,0.6)",
                  textAlign: "center",
                  padding: "40px 0",
                }}
              >
                Loading events...
              </p>
            )}
            {!loading && events.length === 0 && (
              <p
                style={{
                  color: "rgba(182,194,226,0.6)",
                  textAlign: "center",
                  padding: "40px 0",
                }}
              >
                No upcoming events at this time.
              </p>
            )}
            {events.map((ev, i) => {
              const type = ev.type as HighlightType;
              const isHovered = hoveredCard === ev.id;
              const borderColor = BORDER_COLORS[type];
              const glowColor = GLOW_COLORS[type];
              const badgeColor = BADGE_COLORS[type];
              const textColor = TEXT_COLORS[type];
              // Format date display: "July 6, 2026 | 1:00 PM – 3:00 PM"
              const dateDisplay =
                ev.startTime && ev.endTime
                  ? `${ev.eventDate} | ${ev.startTime} – ${ev.endTime}`
                  : ev.eventDate;

              return (
                <div
                  key={ev.id}
                  className={`event-card anim-enter ${sectionsVisible[2] ? "anim-fade-left" : ""}`}
                  style={{
                    animationDelay: `${0.1 + i * 0.12}s`,
                    border: `1px solid ${isHovered ? borderColor : borderColor.replace("0.55", "0.3")}`,
                    boxShadow: isHovered
                      ? `0 12px 40px ${glowColor}, inset 0 0 0 1px ${borderColor}`
                      : "none",
                  }}
                  onMouseEnter={() => setHoveredCard(ev.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Accent bar */}
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: isHovered ? 5 : 3,
                      borderRadius: "3px 0 0 3px",
                      background: textColor,
                      transition: "width 0.3s",
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 16,
                      paddingLeft: 8,
                    }}
                  >
                    {/* Icon */}
                    <div
                      className="event-icon"
                      style={{
                        background: badgeColor,
                        border: `1px solid ${borderColor}`,
                      }}
                    >
                      {ev.icon}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          flexWrap: "wrap",
                          marginBottom: 6,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Raleway', sans-serif",
                            fontWeight: 700,
                            fontSize: "1.05rem",
                            color: "#fff",
                          }}
                        >
                          {ev.title}
                        </span>
                        {ev.badge && (
                          <span
                            className="event-badge"
                            style={{
                              background: badgeColor,
                              border: `1px solid ${borderColor}`,
                              color: textColor,
                            }}
                          >
                            {ev.badge}
                          </span>
                        )}
                      </div>
                      <p
                        style={{
                          color: "rgba(182,194,226,0.75)",
                          fontSize: "0.85rem",
                          lineHeight: 1.7,
                          fontWeight: 300,
                          marginBottom: 10,
                        }}
                      >
                        {ev.description}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 7,
                            color: textColor,
                            fontSize: "0.82rem",
                            fontWeight: 600,
                          }}
                        >
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v6l4 2" />
                          </svg>
                          {dateDisplay}
                        </div>
                        <button
                          className="register-btn"
                          style={{ borderColor, color: textColor }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.background =
                              badgeColor;
                            (e.currentTarget as HTMLElement).style.boxShadow =
                              `0 4px 16px ${glowColor}`;
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background =
                              "transparent";
                            (e.currentTarget as HTMLElement).style.boxShadow =
                              "none";
                          }}
                          onClick={() => setModalEvent(ev)}
                        >
                          Learn More
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
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
      <EventDetailModal
        event={modalEvent}
        onClose={() => setModalEvent(null)}
      />
    </>
  );
};

export default EventPage;
