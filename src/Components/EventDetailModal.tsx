import React from "react";
import { type EventDTO } from "../services/api";

type HighlightType = "yellow" | "blue" | "red";

const BORDER_COLORS: Record<HighlightType, string> = {
  yellow: "rgba(255,214,0,0.55)",
  blue: "rgba(33,158,188,0.55)",
  red: "rgba(255,59,59,0.55)",
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

type EventDetailModalProps = {
  event: EventDTO | null;
  onClose: () => void;
};

const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, onClose }) => {
  if (!event) return null;

  const type = event.type as HighlightType;
  const borderColor = BORDER_COLORS[type];
  const badgeColor = BADGE_COLORS[type];
  const textColor = TEXT_COLORS[type];

  const dateDisplay =
    event.startTime && event.endTime
      ? `${event.eventDate} | ${event.startTime} – ${event.endTime}`
      : event.eventDate;

  return (
    <>
      {/* Backdrop — click outside to close */}
      <div className="modal-backdrop" onClick={onClose}>
        <div
          className="modal-panel"
          style={{
            border: `1px solid ${borderColor}`,
            boxShadow: `0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px ${borderColor}`,
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Close button */}
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>

          {/* Icon + badge + title */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <div
              style={{
                width: 56, height: 56, borderRadius: 14, flexShrink: 0,
                background: badgeColor, border: `1px solid ${borderColor}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.7rem",
              }}
            >
              {event.icon}
            </div>
            <div>
              {event.badge && (
                <span
                  style={{
                    display: "inline-block", padding: "2px 12px", borderRadius: 30, marginBottom: 6,
                    background: badgeColor, border: `1px solid ${borderColor}`,
                    color: textColor, fontSize: "0.62rem", letterSpacing: "0.16em",
                    textTransform: "uppercase", fontWeight: 600,
                  }}
                >
                  {event.badge}
                </span>
              )}
              <h2
                style={{
                  fontFamily: "'Cinzel', serif", fontWeight: 700,
                  fontSize: "1.25rem", color: "#fff", margin: 0,
                }}
              >
                {event.title}
              </h2>
            </div>
          </div>

          {/* Colour-matched divider */}
          <div
            style={{
              height: 1,
              background: `linear-gradient(90deg, ${borderColor}, transparent)`,
              marginBottom: 20,
            }}
          />

          {/* Description */}
          <p
            style={{
              color: "rgba(203,213,225,0.85)", fontSize: "0.92rem",
              lineHeight: 1.8, fontWeight: 300, marginBottom: 20,
            }}
          >
            {event.description}
          </p>

          {/* Date / time pill */}
          <div
            style={{
              display: "flex", alignItems: "center", gap: 8,
              color: textColor, fontSize: "0.85rem", fontWeight: 600,
              background: badgeColor, border: `1px solid ${borderColor}`,
              borderRadius: 10, padding: "10px 16px", marginBottom: 28,
            }}
          >
            <svg
              width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            {dateDisplay}
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetailModal;