import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Bell, LogOut, X, CheckCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getMyNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationItem,
} from "../services/api";

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileDropdown({ isOpen, onClose }: ProfileDropdownProps) {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const [visible, setVisible] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userData = {
    name: storedUser.username || storedUser.name || "User",
    email: storedUser.email || "",
  };

  useEffect(() => {
    if (!isOpen) {
      setVisible(false);
      return;
    }
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    setLoadingNotifs(true);
    getMyNotifications()
      .then(setNotifications)
      .catch(() => setNotifications([]))
      .finally(() => setLoadingNotifs(false));
  }, [isOpen]);

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleMarkOneRead = async (id: number) => {
    await markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Outside click — document listener only, no overlay div
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    // Delay so the trigger button click doesn't immediately close
    const t = setTimeout(
      () => document.addEventListener("click", handler),
      150,
    );
    return () => {
      clearTimeout(t);
      document.removeEventListener("click", handler);
    };
  }, [isOpen, onClose]);

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    onClose();
    navigate("/");
  };

  const getNotifColors = (type: string) => {
    if (type === "BLOG_APPROVED")
      return {
        border: "rgba(16,185,129,0.45)",
        glow: "rgba(16,185,129,0.1)",
        icon: "#10b981",
        badge: "rgba(16,185,129,0.12)",
        dot: "#10b981",
      };
    if (type === "BLOG_REJECTED")
      return {
        border: "rgba(239,68,68,0.45)",
        glow: "rgba(239,68,68,0.1)",
        icon: "#f87171",
        badge: "rgba(239,68,68,0.12)",
        dot: "#f87171",
      };
    if (type === "BOOKING_CONFIRMED")
      return {
        border: "rgba(33,158,188,0.45)",
        glow: "rgba(33,158,188,0.1)",
        icon: "#219EBC",
        badge: "rgba(33,158,188,0.12)",
        dot: "#219EBC",
      };
    return {
      border: "rgba(33,158,188,0.45)",
      glow: "rgba(33,158,188,0.1)",
      icon: "#219EBC",
      badge: "rgba(33,158,188,0.12)",
      dot: "#219EBC",
    };
  };

  const getNotifEmoji = (type: string) => {
    if (type === "BLOG_APPROVED") return "✅";
    if (type === "BLOG_REJECTED") return "❌";
    if (type === "BOOKING_CONFIRMED") return "🎟️";
    return "🔔";
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Visual dimmer only — pointer-events: none so it NEVER blocks clicks */}
      <div className="pd-dimmer bg-[#0d1d52]" />

      {/* The actual panel — z-index 9999, fully interactive */}
      <div
        ref={dropdownRef}
        className="pd-panel"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible
            ? "translateY(0) scale(1)"
            : "translateY(-10px) scale(0.97)",
          transition:
            "opacity 0.3s cubic-bezier(.22,1,.36,1), transform 0.3s cubic-bezier(.22,1,.36,1)",
        }}
      >
        {/* Header */}
        <div className="pd-header">
          <button className="pd-close" onClick={onClose}>
            <X size={14} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="pd-avatar">
              {userData.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2
                style={{
                  fontFamily: "'Raleway', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.98rem",
                  color: "#fff",
                  margin: "0 0 3px",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                {userData.name}
              </h2>
              <p
                style={{
                  color: "rgba(182,194,226,0.5)",
                  fontSize: "0.73rem",
                  fontWeight: 300,
                  margin: 0,
                }}
              >
                {userData.email}
              </p>
            </div>
          </div>
        </div>

        {/* Section label (replaces removed tabs) */}
        <div className="pd-section-lbl">
          <Bell size={13} />
          Notifications
          {unreadCount > 0 && <span className="pd-badge">{unreadCount}</span>}
        </div>

        {/* Body */}
        <div className="pd-body">
          {unreadCount > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: 10,
              }}
            >
              <button className="pd-mark-all" onClick={handleMarkAllRead}>
                <CheckCheck size={11} />
                Mark all read
              </button>
            </div>
          )}
          {loadingNotifs ? (
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="pd-skeleton"
                style={{ animationDelay: `${i * 0.08}s` }}
              />
            ))
          ) : notifications.length === 0 ? (
            <div className="pd-empty">
              <Bell
                size={34}
                className="pd-bell-anim"
                style={{
                  color: "rgba(33,158,188,0.35)",
                  display: "block",
                  margin: "0 auto 12px",
                }}
              />
              <p
                style={{
                  fontFamily: "'Raleway', sans-serif",
                  color: "rgba(182,194,226,0.4)",
                  fontSize: "0.86rem",
                  fontWeight: 700,
                  margin: "0 0 5px",
                }}
              >
                All caught up
              </p>
              <p
                style={{
                  color: "rgba(182,194,226,0.25)",
                  fontSize: "0.73rem",
                  fontWeight: 300,
                  margin: 0,
                }}
              >
                No notifications yet
              </p>
            </div>
          ) : (
            notifications.map((n, i) => {
              const c = getNotifColors(n.type);
              return (
                <div
                  key={n.id}
                  className="pd-notif"
                  onClick={() => !n.isRead && handleMarkOneRead(n.id)}
                  style={{
                    background: n.isRead ? "rgba(255,255,255,0.03)" : c.badge,
                    border: `1px solid ${n.isRead ? "rgba(255,255,255,0.07)" : c.border}`,
                    boxShadow: n.isRead ? "none" : `0 3px 12px ${c.glow}`,
                    animationDelay: `${i * 0.05}s`,
                  }}
                >
                  <div
                    className="pd-notif-bar"
                    style={{
                      background: n.isRead ? "rgba(255,255,255,0.07)" : c.dot,
                    }}
                  />
                  <div style={{ paddingLeft: 10 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 4,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 7,
                        }}
                      >
                        <span style={{ fontSize: "0.82rem" }}>
                          {getNotifEmoji(n.type)}
                        </span>
                        <span
                          style={{
                            fontFamily: "'Raleway', sans-serif",
                            fontWeight: 700,
                            fontSize: "0.78rem",
                            color: n.isRead ? "rgba(182,194,226,0.5)" : "#fff",
                          }}
                        >
                          {n.title}
                        </span>
                      </div>
                      {!n.isRead && (
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: c.dot,
                            boxShadow: `0 0 5px ${c.dot}`,
                            flexShrink: 0,
                          }}
                        />
                      )}
                    </div>
                    <p
                      style={{
                        color: "rgba(182,194,226,0.6)",
                        fontSize: "0.74rem",
                        lineHeight: 1.6,
                        fontWeight: 300,
                        margin: "0 0 4px",
                      }}
                    >
                      {n.message}
                    </p>
                    <p
                      style={{
                        color: "rgba(182,194,226,0.26)",
                        fontSize: "0.64rem",
                        margin: 0,
                      }}
                    >
                      {n.createdAt}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pd-footer">
          <button className="pd-logout" onClick={handleLogout}>
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </div>
    </>,
    document.body,
  );
}
