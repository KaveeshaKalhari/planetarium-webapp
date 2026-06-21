import { useState, useEffect } from "react";
import { Bell, Ticket, Clock, Volume2, X, Eye, CheckCheck } from "lucide-react";

interface Alert {
    id: string;
    title: string;
    message: string;
    timestamp: string;
    icon: string;
    type?: 'info' | 'success' | 'warning';
    read?: boolean;
}

const ICON_MAP: Record<string, React.ReactNode> = {
    ticket: <Ticket size={18} />,
    clock: <Clock size={18} />,
    volume: <Volume2 size={18} />,
    bell: <Bell size={18} />,
};

const TYPE_COLORS: Record<string, { border: string; glow: string; icon: string; badge: string }> = {
    info: { border: 'rgba(33,158,188,0.45)', glow: 'rgba(33,158,188,0.12)', icon: '#219EBC', badge: 'rgba(33,158,188,0.15)' },
    success: { border: 'rgba(16,185,129,0.45)', glow: 'rgba(16,185,129,0.12)', icon: '#10b981', badge: 'rgba(16,185,129,0.15)' },
    warning: { border: 'rgba(234,179,8,0.45)', glow: 'rgba(234,179,8,0.12)', icon: '#eab308', badge: 'rgba(234,179,8,0.15)' },
};

export default function AlertsPage() {
    const [alerts, setAlerts] = useState<Alert[]>([
        { id: '1', title: 'Booking Confirmation', message: 'Your booking for Solar Eclipse Viewing on July 6 is confirmed. Seats A12–A14 reserved.', timestamp: '2 hours ago', icon: 'ticket', type: 'success', read: false },
        { id: '2', title: 'Show Reminder', message: 'Your Lunar Eclipse show starts in 1 hour. Please arrive 15 minutes early.', timestamp: '45 min ago', icon: 'clock', type: 'warning', read: false },
        { id: '3', title: 'New Show Available', message: "Halley's Comet Watch Night has been added. Limited seats — book early!", timestamp: '1 day ago', icon: 'volume', type: 'info', read: true },
    ]);
    const [dismissing, setDismissing] = useState<string[]>([]);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const handleDismiss = (id: string) => {
        setDismissing(d => [...d, id]);
        setTimeout(() => {
            setAlerts(a => a.filter(x => x.id !== id));
            setDismissing(d => d.filter(x => x !== id));
        }, 380);
    };

    const handleMarkAllRead = () => setAlerts(a => a.map(x => ({ ...x, read: true })));

    const displayed = filter === 'unread' ? alerts.filter(a => !a.read) : alerts;
    const unreadCount = alerts.filter(a => !a.read).length;

    return (
        <>
            <style>{`
                @keyframes alertSlideIn { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
                @keyframes bellFloat    { 0%,100%{transform:translateY(0) rotate(0deg)} 25%{transform:translateY(-6px) rotate(-8deg)} 75%{transform:translateY(-3px) rotate(6deg)} }
                @keyframes emptyPulse   { 0%,100%{opacity:0.3} 50%{opacity:0.6} }
                @keyframes btnGlow      { 0%,100%{box-shadow:0 0 10px rgba(33,158,188,0.3)} 50%{box-shadow:0 0 22px rgba(33,158,188,0.55)} }

                .al-filter-tab {
                    padding:7px 18px;border-radius:30px;
                    border:1px solid rgba(255,255,255,0.1);
                    background:rgba(255,255,255,0.04);
                    color:rgba(182,194,226,0.5);
                    font-family:'Raleway',sans-serif;font-size:0.72rem;font-weight:600;
                    letter-spacing:0.12em;text-transform:uppercase;
                    cursor:pointer;transition:all 0.22s;
                }
                .al-filter-tab:hover { border-color:rgba(33,158,188,0.35);color:rgba(182,194,226,0.85); }
                .al-filter-tab.active { background:rgba(33,158,188,0.14);border-color:rgba(33,158,188,0.5);color:#219EBC;box-shadow:0 0 12px rgba(33,158,188,0.15); }

                .al-card {
                    background:rgba(10,18,44,0.82);
                    border-radius:16px;padding:18px 20px;
                    position:relative;overflow:hidden;
                    animation:alertSlideIn 0.42s cubic-bezier(.22,1,.36,1) both;
                    transition:transform 0.28s cubic-bezier(.22,1,.36,1),box-shadow 0.28s,opacity 0.35s;
                    backdrop-filter:blur(12px);
                    -webkit-backdrop-filter:blur(12px);
                }
                .al-card::before { content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(33,158,188,0.2),transparent); }
                .al-card:hover { transform:translateX(5px) translateY(-2px); }
                .al-card.dismissing { opacity:0;transform:translateX(44px) !important; }

                .al-icon-box {
                    width:40px;height:40px;border-radius:11px;flex-shrink:0;
                    display:flex;align-items:center;justify-content:center;
                    transition:transform 0.28s;
                }
                .al-card:hover .al-icon-box { transform:scale(1.1) rotate(-5deg); }

                .al-view-btn {
                    padding:7px 16px;border-radius:28px;border:none;
                    background:linear-gradient(135deg,#219EBC,#126782);
                    color:#fff;font-family:'Raleway',sans-serif;font-weight:600;
                    font-size:0.7rem;letter-spacing:0.11em;text-transform:uppercase;
                    cursor:pointer;display:flex;align-items:center;gap:5px;
                    transition:transform 0.2s,box-shadow 0.2s,background 0.22s;
                    animation:btnGlow 3.5s ease-in-out infinite;
                }
                .al-view-btn:hover { transform:translateY(-2px);box-shadow:0 5px 18px rgba(33,158,188,0.45);background:linear-gradient(135deg,#27b8dc,#1a88a8);animation:none; }

                .al-dismiss-btn {
                    padding:7px 14px;border-radius:28px;
                    background:rgba(255,255,255,0.05);
                    border:1px solid rgba(255,255,255,0.1);
                    color:rgba(182,194,226,0.55);font-family:'Raleway',sans-serif;font-weight:600;
                    font-size:0.7rem;letter-spacing:0.11em;text-transform:uppercase;
                    cursor:pointer;display:flex;align-items:center;gap:5px;
                    transition:all 0.2s;
                }
                .al-dismiss-btn:hover { background:rgba(239,68,68,0.1);border-color:rgba(239,68,68,0.4);color:#f87171;transform:translateY(-2px); }

                .al-mark-btn {
                    display:inline-flex;align-items:center;gap:5px;
                    font-family:'Raleway',sans-serif;font-size:0.68rem;font-weight:600;
                    letter-spacing:0.1em;text-transform:uppercase;
                    color:rgba(33,158,188,0.7);background:none;border:none;cursor:pointer;
                    padding:5px 10px;border-radius:18px;
                    transition:color 0.2s,background 0.2s;
                }
                .al-mark-btn:hover { color:#219EBC;background:rgba(33,158,188,0.1); }

                .al-badge { display:inline-flex;align-items:center;font-size:0.58rem;letter-spacing:0.14em;text-transform:uppercase;padding:2px 8px;border-radius:28px;font-weight:600;font-family:'Raleway',sans-serif; }
                .al-unread-dot { width:7px;height:7px;border-radius:50%;background:#219EBC;box-shadow:0 0 7px rgba(33,158,188,0.7);flex-shrink:0; }

                .al-empty { text-align:center;padding:60px 24px;background:rgba(10,18,44,0.5);border:1px solid rgba(33,158,188,0.1);border-radius:18px;backdrop-filter:blur(12px); }
                .al-empty-bell { animation:bellFloat 3s ease-in-out infinite; }
                .al-empty-ring { animation:emptyPulse 3s ease-in-out infinite; }
            `}</style>

            {/* Content panel — no full-page wrapper, lives inside ProfileLayout */}
            <div style={{ padding: '40px 32px 64px', fontFamily: "'Raleway',sans-serif", maxWidth: 720 }}>

                {/* Header */}
                <div style={{ marginBottom: 28 }}>
                    <span style={{ fontFamily: 'Raleway,sans-serif', fontSize: '0.65rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: '#219EBC', border: '1px solid rgba(33,158,188,0.35)', borderRadius: 40, padding: '3px 14px', display: 'inline-block', marginBottom: 12, background: 'rgba(33,158,188,0.07)' }}>
                        Notifications
                    </span>
                    <h1 style={{ fontFamily: "'Cinzel',serif", fontSize: 'clamp(1.6rem,3.5vw,2.4rem)', fontWeight: 900, color: '#fff', letterSpacing: '0.04em', margin: '0 0 6px' }}>
                        My <span style={{ color: '#219EBC' }}>Alerts</span>
                    </h1>
                    <div style={{ height: 1, width: 48, background: 'linear-gradient(90deg,transparent,rgba(33,158,188,0.7),transparent)', margin: '8px 0 12px' }} />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                        <p style={{ color: 'rgba(182,194,226,0.55)', fontSize: '0.83rem', fontWeight: 300, margin: 0 }}>
                            Notifications and updates for your bookings
                        </p>
                        {alerts.length > 0 && (
                            <span style={{ background: 'rgba(33,158,188,0.12)', border: '1px solid rgba(33,158,188,0.3)', borderRadius: 30, padding: '3px 12px', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#219EBC', fontWeight: 600 }}>
                                {unreadCount} unread
                            </span>
                        )}
                    </div>
                </div>

                {/* Toolbar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                        {(['all', 'unread'] as const).map(f => (
                            <button key={f} className={`al-filter-tab${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
                                {f === 'all' ? `All (${alerts.length})` : `Unread (${unreadCount})`}
                            </button>
                        ))}
                    </div>
                    {unreadCount > 0 && (
                        <button className="al-mark-btn" onClick={handleMarkAllRead}>
                            <CheckCheck size={12} />Mark all read
                        </button>
                    )}
                </div>

                {/* List */}
                {displayed.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {displayed.map((alert, i) => {
                            const c = TYPE_COLORS[alert.type || 'info'];
                            const isDismissing = dismissing.includes(alert.id);
                            return (
                                <div
                                    key={alert.id}
                                    className={`al-card${isDismissing ? ' dismissing' : ''}`}
                                    style={{ border: `1px solid ${alert.read ? 'rgba(255,255,255,0.07)' : c.border}`, boxShadow: `0 4px 24px ${alert.read ? 'rgba(0,0,0,0.15)' : c.glow}`, animationDelay: `${i * 0.07}s` }}
                                >
                                    {/* Accent bar */}
                                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, borderRadius: '3px 0 0 3px', background: alert.read ? 'rgba(255,255,255,0.08)' : c.icon, transition: 'background 0.3s' }} />

                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, paddingLeft: 10 }}>
                                        <div className="al-icon-box" style={{ background: alert.read ? 'rgba(255,255,255,0.05)' : c.badge, border: `1px solid ${alert.read ? 'rgba(255,255,255,0.08)' : c.border}`, color: alert.read ? 'rgba(182,194,226,0.4)' : c.icon }}>
                                            {ICON_MAP[alert.icon] || ICON_MAP.bell}
                                        </div>

                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                                                {!alert.read && <span className="al-unread-dot" />}
                                                <h3 style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: '0.92rem', color: alert.read ? 'rgba(182,194,226,0.7)' : '#fff', margin: 0 }}>
                                                    {alert.title}
                                                </h3>
                                                {alert.type && (
                                                    <span className="al-badge" style={{ background: c.badge, border: `1px solid ${c.border}`, color: c.icon, opacity: alert.read ? 0.6 : 1 }}>
                                                        {alert.type}
                                                    </span>
                                                )}
                                            </div>
                                            <p style={{ color: 'rgba(182,194,226,0.65)', fontSize: '0.82rem', lineHeight: 1.65, fontWeight: 300, margin: '0 0 12px' }}>
                                                {alert.message}
                                            </p>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                                                <div style={{ display: 'flex', gap: 8 }}>
                                                    <button className="al-view-btn"><Eye size={12} />View</button>
                                                    <button className="al-dismiss-btn" onClick={() => handleDismiss(alert.id)}><X size={12} />Dismiss</button>
                                                </div>
                                                <span style={{ color: 'rgba(182,194,226,0.32)', fontSize: '0.68rem', letterSpacing: '0.08em' }}>{alert.timestamp}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="al-empty">
                        <div style={{ position: 'relative', width: 70, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                            <div className="al-empty-ring" style={{ width: 70, height: 70, borderRadius: '50%', border: '1px solid rgba(33,158,188,0.18)', position: 'absolute' }} />
                            <div className="al-empty-ring" style={{ width: 46, height: 46, borderRadius: '50%', border: '1px solid rgba(33,158,188,0.12)', position: 'absolute', animationDelay: '-1.5s' }} />
                            <Bell size={30} className="al-empty-bell" style={{ color: 'rgba(33,158,188,0.45)', position: 'relative', zIndex: 1 }} />
                        </div>
                        <p style={{ fontFamily: "'Cinzel',serif", color: 'rgba(182,194,226,0.5)', fontSize: '1rem', fontWeight: 700, margin: '0 0 6px' }}>All caught up!</p>
                        <p style={{ color: 'rgba(182,194,226,0.3)', fontSize: '0.8rem', fontWeight: 300, margin: 0 }}>
                            {filter === 'unread' ? 'No unread alerts.' : "No alerts right now."}
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}