import { useState, useEffect } from "react";
import { Bell, Ticket, Clock, Volume2, X, Eye } from "lucide-react";

interface Alert {
    id: string;
    title: string;
    message: string;
    timestamp: string;
    icon: string;
    type?: 'info' | 'success' | 'warning';
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
        { id: '1', title: 'Booking Confirmation', message: 'Your booking for Solar Eclipse Viewing on July 6 is confirmed. Seats A12–A14 reserved.', timestamp: '2 hours ago', icon: 'ticket', type: 'success' },
        { id: '2', title: 'Show Reminder', message: 'Your Lunar Eclipse show starts in 1 hour. Please arrive 15 minutes early.', timestamp: '45 minutes ago', icon: 'clock', type: 'warning' },
        { id: '3', title: 'New Show Available', message: 'Halley\'s Comet Watch Night has been added. Limited seats — book early!', timestamp: '1 day ago', icon: 'volume', type: 'info' },
    ]);
    const [dismissing, setDismissing] = useState<string[]>([]);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    }, []);

    const handleDismiss = (id: string) => {
        setDismissing(d => [...d, id]);
        setTimeout(() => {
            setAlerts(a => a.filter(x => x.id !== id));
            setDismissing(d => d.filter(x => x !== id));
        }, 350);
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Raleway:wght@300;400;600&display=swap');

                @keyframes nebulaDrift { 0%{transform:translate(0,0) scale(1)} 33%{transform:translate(22px,-16px) scale(1.04)} 66%{transform:translate(-16px,12px) scale(0.97)} 100%{transform:translate(0,0) scale(1)} }
                @keyframes twinkle     { 0%,100%{opacity:0.2} 50%{opacity:0.85} }
                @keyframes lineExpand  { from{width:0;opacity:0} to{width:48px;opacity:1} }
                @keyframes alertSlideIn { from{opacity:0;transform:translateX(-24px)} to{opacity:1;transform:translateX(0)} }
                @keyframes bellFloat    { 0%,100%{transform:translateY(0) rotate(0deg)} 25%{transform:translateY(-6px) rotate(-8deg)} 75%{transform:translateY(-3px) rotate(6deg)} }
                @keyframes emptyPulse   { 0%,100%{opacity:0.35} 50%{opacity:0.65} }

                .nebula-blob { position:fixed;border-radius:50%;filter:blur(88px);pointer-events:none;z-index:0;animation:nebulaDrift 22s ease-in-out infinite; }
                .star-dot    { position:fixed;border-radius:50%;background:rgba(210,235,255,0.9);pointer-events:none;z-index:0;animation:twinkle var(--dur,3s) ease-in-out infinite;animation-delay:var(--delay,0s); }

                .divider-line { display:inline-block;height:1px;background:linear-gradient(90deg,transparent,rgba(33,158,188,0.7),transparent);animation:lineExpand 1s cubic-bezier(.22,1,.36,1) 0.5s both;width:48px; }
                .eyebrow { font-family:'Raleway',sans-serif;font-size:0.65rem;letter-spacing:0.28em;text-transform:uppercase;color:#219EBC;border:1px solid rgba(33,158,188,0.35);border-radius:40px;padding:3px 14px;display:inline-block;margin-bottom:12px;background:rgba(33,158,188,0.07); }

                .alert-card {
                    background: rgba(10,18,44,0.80);
                    border-radius: 18px;
                    backdrop-filter: blur(14px);
                    -webkit-backdrop-filter: blur(14px);
                    padding: 22px 24px;
                    position: relative; overflow: hidden;
                    animation: alertSlideIn 0.5s cubic-bezier(.22,1,.36,1) both;
                    transition: transform 0.3s cubic-bezier(.22,1,.36,1),
                                box-shadow 0.3s,
                                border-color 0.3s,
                                opacity 0.35s,
                                max-height 0.35s;
                }
                .alert-card::before { content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(33,158,188,0.3),transparent); }
                .alert-card:hover { transform:translateX(5px); }
                .alert-card.dismissing { opacity:0;transform:translateX(40px) !important; }

                .alert-icon-box {
                    width:40px;height:40px;border-radius:12px;flex-shrink:0;
                    display:flex;align-items:center;justify-content:center;
                    transition:transform 0.3s;
                }
                .alert-card:hover .alert-icon-box { transform:scale(1.1) rotate(-5deg); }

                .view-btn {
                    padding:8px 20px;border-radius:30px;border:none;
                    background:linear-gradient(135deg,#219EBC,#126782);
                    color:#fff;font-family:'Raleway',sans-serif;font-weight:600;
                    font-size:0.75rem;letter-spacing:0.12em;text-transform:uppercase;
                    cursor:pointer;display:flex;align-items:center;gap:6px;
                    transition:transform 0.2s,box-shadow 0.2s,background 0.25s;
                }
                .view-btn:hover { transform:translateY(-2px);box-shadow:0 6px 20px rgba(33,158,188,0.4);background:linear-gradient(135deg,#27b8dc,#1a88a8); }

                .dismiss-btn {
                    padding:8px 18px;border-radius:30px;
                    background:rgba(255,255,255,0.06);
                    border:1px solid rgba(255,255,255,0.1);
                    color:rgba(182,194,226,0.65);font-family:'Raleway',sans-serif;font-weight:600;
                    font-size:0.75rem;letter-spacing:0.12em;text-transform:uppercase;
                    cursor:pointer;display:flex;align-items:center;gap:6px;
                    transition:background 0.2s,border-color 0.2s,color 0.2s,transform 0.2s;
                }
                .dismiss-btn:hover { background:rgba(239,68,68,0.12);border-color:rgba(239,68,68,0.35);color:#f87171;transform:translateY(-2px); }

                .empty-bell { animation:bellFloat 3s ease-in-out infinite; }
                .empty-ring { animation:emptyPulse 3s ease-in-out infinite; }

                .badge {
                    display:inline-flex;align-items:center;
                    font-size:0.62rem;letter-spacing:0.14em;text-transform:uppercase;
                    padding:2px 10px;border-radius:30px;font-weight:600;
                    font-family:'Raleway',sans-serif;
                }
            `}</style>

            <div style={{ flex: 1, minHeight: '100vh', background: '#0A1128', position: 'relative', overflow: 'hidden', fontFamily: "'Raleway',sans-serif", padding: '40px 32px 60px' }}>

                {/* Nebula blobs */}
                <div className="nebula-blob" style={{ width: 400, height: 340, top: '-8%', left: '-5%', background: 'rgba(33,158,188,0.08)', animationDelay: '0s' }} />
                <div className="nebula-blob" style={{ width: 340, height: 280, bottom: '0', right: '-5%', background: 'rgba(18,103,130,0.09)', animationDelay: '-8s' }} />

                {/* Stars */}
                {[
                    { top: '5%', left: '5%', s: 2, dur: '3s', dl: '0s' },
                    { top: '15%', left: '94%', s: 1.5, dur: '3.8s', dl: '-1s' },
                    { top: '65%', left: '3%', s: 2, dur: '4s', dl: '-2s' },
                    { top: '88%', left: '92%', s: 1.5, dur: '2.8s', dl: '-0.5s' },
                ].map((s, i) => (
                    <div key={i} className="star-dot" style={{ top: s.top, left: s.left, width: s.s, height: s.s, '--dur': s.dur, '--delay': s.dl } as React.CSSProperties} />
                ))}

                <div style={{
                    maxWidth: 720, position: 'relative', zIndex: 10,
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(24px)',
                    transition: 'opacity 0.65s cubic-bezier(.22,1,.36,1), transform 0.65s cubic-bezier(.22,1,.36,1)',
                }}>

                    {/* Header */}
                    <div style={{ marginBottom: 36 }}>
                        <span className="eyebrow">Notifications</span>
                        <h1 style={{ fontFamily: "'Cinzel',serif", fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900, color: '#fff', letterSpacing: '0.04em', margin: '0 0 6px' }}>
                            My <span style={{ color: '#219EBC' }}>Alerts</span>
                        </h1>
                        <div style={{ display: 'flex', margin: '8px 0 10px' }}><span className="divider-line" /></div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                            <p style={{ color: 'rgba(182,194,226,0.6)', fontSize: '0.85rem', fontWeight: 300, margin: 0 }}>
                                Notifications and updates for your bookings
                            </p>
                            {alerts.length > 0 && (
                                <span style={{
                                    background: 'rgba(33,158,188,0.12)', border: '1px solid rgba(33,158,188,0.3)',
                                    borderRadius: 30, padding: '3px 14px',
                                    fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase',
                                    color: '#219EBC', fontWeight: 600,
                                }}>
                                    {alerts.length} unread
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Alert list */}
                    {alerts.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {alerts.map((alert, i) => {
                                const colors = TYPE_COLORS[alert.type || 'info'];
                                const isDismissing = dismissing.includes(alert.id);
                                return (
                                    <div
                                        key={alert.id}
                                        className={`alert-card${isDismissing ? ' dismissing' : ''}`}
                                        style={{
                                            border: `1px solid ${colors.border}`,
                                            boxShadow: `0 4px 24px ${colors.glow}`,
                                            animationDelay: `${i * 0.08}s`,
                                        }}
                                    >
                                        {/* Left accent bar */}
                                        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, borderRadius: '3px 0 0 3px', background: colors.icon }} />

                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, paddingLeft: 8 }}>
                                            {/* Icon */}
                                            <div className="alert-icon-box" style={{ background: colors.badge, border: `1px solid ${colors.border}`, color: colors.icon }}>
                                                {ICON_MAP[alert.icon] || ICON_MAP.bell}
                                            </div>

                                            {/* Content */}
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5, flexWrap: 'wrap' }}>
                                                    <h3 style={{ fontFamily: "'Cinzel',serif", fontWeight: 700, fontSize: '1rem', color: '#fff', margin: 0 }}>
                                                        {alert.title}
                                                    </h3>
                                                    {alert.type && (
                                                        <span className="badge" style={{ background: colors.badge, border: `1px solid ${colors.border}`, color: colors.icon }}>
                                                            {alert.type}
                                                        </span>
                                                    )}
                                                </div>
                                                <p style={{ color: 'rgba(182,194,226,0.75)', fontSize: '0.85rem', lineHeight: 1.65, fontWeight: 300, margin: '0 0 14px' }}>
                                                    {alert.message}
                                                </p>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                                                    <div style={{ display: 'flex', gap: 10 }}>
                                                        <button className="view-btn"><Eye size={13} />View</button>
                                                        <button className="dismiss-btn" onClick={() => handleDismiss(alert.id)}><X size={13} />Dismiss</button>
                                                    </div>
                                                    <span style={{ color: 'rgba(182,194,226,0.38)', fontSize: '0.72rem', letterSpacing: '0.08em' }}>
                                                        {alert.timestamp}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* Empty state */
                        <div style={{ textAlign: 'center', padding: '72px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                <div className="empty-ring" style={{ width: 90, height: 90, borderRadius: '50%', border: '1px solid rgba(33,158,188,0.2)', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
                                <div className="empty-ring" style={{ width: 60, height: 60, borderRadius: '50%', border: '1px solid rgba(33,158,188,0.15)', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', animationDelay: '-1.5s' }} />
                                <Bell size={44} className="empty-bell" style={{ color: 'rgba(33,158,188,0.4)', position: 'relative', zIndex: 1 }} />
                            </div>
                            <p style={{ fontFamily: "'Cinzel',serif", color: 'rgba(182,194,226,0.5)', fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>All caught up!</p>
                            <p style={{ color: 'rgba(182,194,226,0.35)', fontSize: '0.83rem', fontWeight: 300, margin: 0 }}>No alerts right now. We'll notify you of any updates.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}