import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Bell, LogOut, X, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getMyNotifications, markAllNotificationsRead, markNotificationRead, type NotificationItem } from '../services/api';

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

    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userData = {
        name: storedUser.username || storedUser.name || 'User',
        email: storedUser.email || '',
    };

    useEffect(() => {
        if (!isOpen) { setVisible(false); return; }
        requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
        setLoadingNotifs(true);
        getMyNotifications()
            .then(setNotifications)
            .catch(() => setNotifications([]))
            .finally(() => setLoadingNotifs(false));
    }, [isOpen]);

    const handleMarkAllRead = async () => {
        await markAllNotificationsRead();
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const handleMarkOneRead = async (id: number) => {
        await markNotificationRead(id);
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Outside click — document listener only, no overlay div
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        // Delay so the trigger button click doesn't immediately close
        const t = setTimeout(() => document.addEventListener('click', handler), 150);
        return () => {
            clearTimeout(t);
            document.removeEventListener('click', handler);
        };
    }, [isOpen, onClose]);

    const handleLogout = () => {
        sessionStorage.clear();
        localStorage.clear();
        onClose();
        navigate('/');
    };

    const getNotifColors = (type: string) => {
        if (type === 'BLOG_APPROVED') return { border: 'rgba(16,185,129,0.45)', glow: 'rgba(16,185,129,0.1)', icon: '#10b981', badge: 'rgba(16,185,129,0.12)', dot: '#10b981' };
        if (type === 'BLOG_REJECTED') return { border: 'rgba(239,68,68,0.45)', glow: 'rgba(239,68,68,0.1)', icon: '#f87171', badge: 'rgba(239,68,68,0.12)', dot: '#f87171' };
        if (type === 'BOOKING_CONFIRMED') return { border: 'rgba(33,158,188,0.45)', glow: 'rgba(33,158,188,0.1)', icon: '#219EBC', badge: 'rgba(33,158,188,0.12)', dot: '#219EBC' };
        return { border: 'rgba(33,158,188,0.45)', glow: 'rgba(33,158,188,0.1)', icon: '#219EBC', badge: 'rgba(33,158,188,0.12)', dot: '#219EBC' };
    };

    const getNotifEmoji = (type: string) => {
        if (type === 'BLOG_APPROVED') return '✅';
        if (type === 'BLOG_REJECTED') return '❌';
        if (type === 'BOOKING_CONFIRMED') return '🎟️';
        return '🔔';
    };

    if (!isOpen) return null;

    return createPortal(
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Raleway:wght@300;400;600&display=swap');

                @keyframes notifSlide { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
                @keyframes shimmer    { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
                @keyframes bellWiggle { 0%,100%{transform:rotate(0)} 20%{transform:rotate(-12deg)} 40%{transform:rotate(10deg)} 60%{transform:rotate(-6deg)} 80%{transform:rotate(4deg)} }

                .pd-panel {
                    position: fixed;
                    top: 68px;
                    right: 16px;
                    z-index: 9999;
                    width: 420px;
                    max-width: calc(100vw - 32px);
                    max-height: calc(100vh - 84px);
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    background: rgba(8,15,38,0.98);
                    border: 1px solid rgba(33,158,188,0.28);
                    border-radius: 20px;
                    box-shadow:
                        0 32px 80px rgba(0,0,0,0.8),
                        0 0 0 1px rgba(33,158,188,0.08),
                        0 0 60px rgba(33,158,188,0.07);
                    /* NO pointer-events restrictions — everything clickable */
                }
                .pd-panel::before {
                    content: '';
                    position: absolute; top: 0; left: 0; right: 0; height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(33,158,188,0.6), transparent);
                    pointer-events: none; z-index: 0;
                }

                /* Soft page dimmer — sits BEHIND the panel using z-index */
                .pd-dimmer {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.4);
                    backdrop-filter: blur(2px);
                    z-index: 9998; /* one below the panel */
                    pointer-events: none; /* NEVER intercept clicks */
                }

                .pd-header {
                    background: linear-gradient(135deg, rgba(10,17,40,0.99), rgba(18,40,80,0.97));
                    border-bottom: 1px solid rgba(33,158,188,0.15);
                    padding: 20px 20px 18px;
                    position: relative;
                    flex-shrink: 0;
                    z-index: 1;
                }
                .pd-avatar {
                    width: 52px; height: 52px; border-radius: 50%;
                    background: linear-gradient(135deg, #219EBC, #126782);
                    display: flex; align-items: center; justify-content: center;
                    border: 2px solid rgba(33,158,188,0.55);
                    box-shadow: 0 0 18px rgba(33,158,188,0.35);
                    flex-shrink: 0;
                    font-family: 'Cinzel', serif; font-size: 1.15rem; font-weight: 900; color: #fff;
                }
                .pd-close {
                    position: absolute; top: 14px; right: 14px;
                    width: 28px; height: 28px; border-radius: 50%;
                    background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer; color: rgba(182,194,226,0.7);
                    transition: background 0.2s, color 0.2s, transform 0.2s;
                    z-index: 2;
                }
                .pd-close:hover { background: rgba(239,68,68,0.2); border-color: rgba(239,68,68,0.45); color: #f87171; transform: scale(1.1); }

                /* Section label (replaces old tabs) */
                .pd-section-lbl {
                    display: flex; align-items: center; gap: 8px;
                    padding: 14px 18px 12px;
                    border-bottom: 1px solid rgba(33,158,188,0.14);
                    background: rgba(8,15,38,0.98);
                    flex-shrink: 0;
                    position: relative;
                    z-index: 2;
                    font-family: 'Raleway', sans-serif; font-size: 0.78rem; font-weight: 600;
                    letter-spacing: 0.1em; text-transform: uppercase;
                    color: #219EBC;
                }
                .pd-badge {
                    background: #ef4444; color: #fff;
                    font-size: 0.58rem; font-weight: 700;
                    padding: 1px 6px; border-radius: 20px;
                    min-width: 18px; text-align: center;
                    box-shadow: 0 0 8px rgba(239,68,68,0.55);
                    pointer-events: none;
                }

                .pd-body {
                    flex: 1; overflow-y: auto; padding: 14px;
                    position: relative; z-index: 1;
                    scrollbar-width: thin;
                    scrollbar-color: rgba(33,158,188,0.25) transparent;
                }
                .pd-body::-webkit-scrollbar { width: 4px; }
                .pd-body::-webkit-scrollbar-thumb { background: rgba(33,158,188,0.25); border-radius: 4px; }

                .pd-notif {
                    border-radius: 12px; padding: 13px;
                    position: relative; overflow: hidden; cursor: pointer;
                    animation: notifSlide 0.32s cubic-bezier(.22,1,.36,1) both;
                    transition: transform 0.22s;
                    margin-bottom: 10px;
                }
                .pd-notif:hover { transform: translateX(3px); }
                .pd-notif-bar { position: absolute; left: 0; top: 0; bottom: 0; width: 3px; border-radius: 3px 0 0 3px; }

                .pd-mark-all {
                    display: inline-flex; align-items: center; gap: 5px;
                    font-family: 'Raleway', sans-serif; font-size: 0.68rem; font-weight: 600;
                    letter-spacing: 0.1em; text-transform: uppercase;
                    color: rgba(33,158,188,0.75); background: none; border: none; cursor: pointer;
                    padding: 5px 10px; border-radius: 18px;
                    transition: color 0.2s, background 0.2s;
                }
                .pd-mark-all:hover { color: #219EBC; background: rgba(33,158,188,0.1); }

                .pd-skeleton {
                    height: 68px; border-radius: 12px; margin-bottom: 10px;
                    background: linear-gradient(90deg, rgba(33,158,188,0.05) 25%, rgba(33,158,188,0.1) 50%, rgba(33,158,188,0.05) 75%);
                    background-size: 200% 100%; animation: shimmer 1.5s infinite;
                }

                .pd-empty { text-align: center; padding: 40px 16px; }
                .pd-bell-anim { animation: bellWiggle 2.5s ease-in-out infinite; }

                .pd-footer {
                    border-top: 1px solid rgba(33,158,188,0.12);
                    padding: 12px 14px;
                    background: rgba(6,12,30,0.98);
                    flex-shrink: 0;
                    z-index: 2;
                    position: relative;
                }
                .pd-logout {
                    width: 100%; padding: 11px; border-radius: 30px;
                    background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3);
                    color: #f87171; font-family: 'Raleway', sans-serif; font-weight: 600;
                    font-size: 0.75rem; letter-spacing: 0.14em; text-transform: uppercase;
                    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
                    transition: background 0.22s, border-color 0.22s, transform 0.22s, box-shadow 0.22s;
                }
                .pd-logout:hover { background: rgba(239,68,68,0.2); border-color: rgba(239,68,68,0.55); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(239,68,68,0.2); }
            `}</style>

            {/* Visual dimmer only — pointer-events: none so it NEVER blocks clicks */}
            <div className="pd-dimmer" />

            {/* The actual panel — z-index 9999, fully interactive */}
            <div
                ref={dropdownRef}
                className="pd-panel"
                style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.97)',
                    transition: 'opacity 0.3s cubic-bezier(.22,1,.36,1), transform 0.3s cubic-bezier(.22,1,.36,1)',
                }}
            >
                {/* Header */}
                <div className="pd-header">
                    <button className="pd-close" onClick={onClose}><X size={14} /></button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div className="pd-avatar">{userData.name.charAt(0).toUpperCase()}</div>
                        <div>
                            <h2 style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: '0.98rem', color: '#fff', margin: '0 0 3px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                                {userData.name}
                            </h2>
                            <p style={{ color: 'rgba(182,194,226,0.5)', fontSize: '0.73rem', fontWeight: 300, margin: 0 }}>
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
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
                            <button className="pd-mark-all" onClick={handleMarkAllRead}>
                                <CheckCheck size={11} />Mark all read
                            </button>
                        </div>
                    )}
                    {loadingNotifs ? (
                        [1, 2, 3].map(i => <div key={i} className="pd-skeleton" style={{ animationDelay: `${i * 0.08}s` }} />)
                    ) : notifications.length === 0 ? (
                        <div className="pd-empty">
                            <Bell size={34} className="pd-bell-anim" style={{ color: 'rgba(33,158,188,0.35)', display: 'block', margin: '0 auto 12px' }} />
                            <p style={{ fontFamily: "'Cinzel',serif", color: 'rgba(182,194,226,0.4)', fontSize: '0.86rem', fontWeight: 700, margin: '0 0 5px' }}>All caught up</p>
                            <p style={{ color: 'rgba(182,194,226,0.25)', fontSize: '0.73rem', fontWeight: 300, margin: 0 }}>No notifications yet</p>
                        </div>
                    ) : notifications.map((n, i) => {
                        const c = getNotifColors(n.type);
                        return (
                            <div
                                key={n.id}
                                className="pd-notif"
                                onClick={() => !n.isRead && handleMarkOneRead(n.id)}
                                style={{
                                    background: n.isRead ? 'rgba(255,255,255,0.03)' : c.badge,
                                    border: `1px solid ${n.isRead ? 'rgba(255,255,255,0.07)' : c.border}`,
                                    boxShadow: n.isRead ? 'none' : `0 3px 12px ${c.glow}`,
                                    animationDelay: `${i * 0.05}s`,
                                }}
                            >
                                <div className="pd-notif-bar" style={{ background: n.isRead ? 'rgba(255,255,255,0.07)' : c.dot }} />
                                <div style={{ paddingLeft: 10 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                                            <span style={{ fontSize: '0.82rem' }}>{getNotifEmoji(n.type)}</span>
                                            <span style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: '0.78rem', color: n.isRead ? 'rgba(182,194,226,0.5)' : '#fff' }}>
                                                {n.title}
                                            </span>
                                        </div>
                                        {!n.isRead && <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.dot, boxShadow: `0 0 5px ${c.dot}`, flexShrink: 0 }} />}
                                    </div>
                                    <p style={{ color: 'rgba(182,194,226,0.6)', fontSize: '0.74rem', lineHeight: 1.6, fontWeight: 300, margin: '0 0 4px' }}>{n.message}</p>
                                    <p style={{ color: 'rgba(182,194,226,0.26)', fontSize: '0.64rem', margin: 0 }}>{n.createdAt}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="pd-footer">
                    <button className="pd-logout" onClick={handleLogout}>
                        <LogOut size={14} />Logout
                    </button>
                </div>
            </div>
        </>,
        document.body
    );
}