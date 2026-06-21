import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AlertsPage from "../Pages/AlertsPage.tsx";
import UserNavbar from "../components/UserNavbar.tsx";

type PageType = 'alerts';

export default function ProfileLayout() {
    const [currentPage, setCurrentPage] = useState<PageType>('alerts');
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    }, []);

    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userName = storedUser.username || storedUser.name || 'User';
    const userEmail = storedUser.email || '';
    const userInitial = userName.charAt(0).toUpperCase();

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        navigate('/');
    };

    const navItems: { key: PageType; label: string; icon: React.ReactNode }[] = [
        {
            key: 'alerts',
            label: 'Alerts',
            icon: (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 01-3.46 0" />
                </svg>
            ),
        },
    ];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Raleway:wght@300;400;600&display=swap');

                @keyframes nebulaDrift  { 0%{transform:translate(0,0) scale(1)} 33%{transform:translate(22px,-16px) scale(1.04)} 66%{transform:translate(-16px,12px) scale(0.97)} 100%{transform:translate(0,0) scale(1)} }
                @keyframes twinkle      { 0%,100%{opacity:0.18} 50%{opacity:0.8} }
                @keyframes shootAcross  { 0%{transform:translate(0,0) scaleX(1);opacity:0.85} 100%{transform:translate(300px,150px) scaleX(0);opacity:0} }
                @keyframes sidebarGlow  { 0%,100%{box-shadow:inset -1px 0 0 rgba(33,158,188,0.12)} 50%{box-shadow:inset -1px 0 0 rgba(33,158,188,0.3)} }
                @keyframes avatarPulse  { 0%,100%{box-shadow:0 0 0 0 rgba(33,158,188,0.4)} 50%{box-shadow:0 0 0 6px rgba(33,158,188,0)} }

                .pl-nebula { position:fixed;border-radius:50%;filter:blur(88px);pointer-events:none;z-index:0;animation:nebulaDrift 22s ease-in-out infinite; }
                .pl-star   { position:fixed;border-radius:50%;background:rgba(210,235,255,0.9);pointer-events:none;z-index:0;animation:twinkle var(--dur,3s) ease-in-out infinite;animation-delay:var(--delay,0s); }
                .pl-shoot  { position:fixed;height:1.5px;background:linear-gradient(90deg,transparent,rgba(180,230,255,0.7),transparent);border-radius:2px;opacity:0;pointer-events:none;z-index:0;animation:shootAcross 3.2s ease-in infinite; }

                /* ── Sidebar ── */
                .pl-sidebar {
                    width: 230px;
                    flex-shrink: 0;
                    display: flex;
                    flex-direction: column;
                    background: rgba(7,13,34,0.94);
                    border-right: 1px solid rgba(33,158,188,0.14);
                    position: relative;
                    z-index: 5;
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    animation: sidebarGlow 5s ease-in-out infinite;
                    overflow: hidden;
                }
                .pl-sidebar::before {
                    content:'';
                    position:absolute;top:0;right:0;bottom:0;width:1px;
                    background:linear-gradient(180deg,transparent 0%,rgba(33,158,188,0.35) 40%,rgba(33,158,188,0.35) 60%,transparent 100%);
                    pointer-events:none;
                }
                /* Top shimmer line */
                .pl-sidebar::after {
                    content:'';
                    position:absolute;top:0;left:0;right:0;height:1px;
                    background:linear-gradient(90deg,transparent,rgba(33,158,188,0.4),transparent);
                    pointer-events:none;
                }

                /* Avatar */
                .pl-avatar {
                    width:52px;height:52px;border-radius:50%;
                    background:linear-gradient(135deg,#219EBC,#126782);
                    display:flex;align-items:center;justify-content:center;
                    border:2px solid rgba(33,158,188,0.5);
                    animation:avatarPulse 3s ease-in-out infinite;
                    flex-shrink:0;
                    font-family:'Cinzel',serif;font-size:1.2rem;font-weight:900;color:#fff;
                }

                /* Nav items */
                .pl-nav-item {
                    display:flex;align-items:center;gap:11px;
                    padding:11px 18px;margin:2px 10px;border-radius:12px;
                    font-family:'Raleway',sans-serif;font-size:0.78rem;font-weight:600;
                    letter-spacing:0.08em;text-transform:uppercase;
                    color:rgba(182,194,226,0.5);
                    border:1px solid transparent;
                    cursor:pointer;background:none;width:calc(100% - 20px);
                    text-align:left;position:relative;
                    transition:background 0.22s,color 0.22s,border-color 0.22s,box-shadow 0.22s,transform 0.22s;
                }
                .pl-nav-item:hover {
                    background:rgba(33,158,188,0.08);
                    color:rgba(182,194,226,0.9);
                    border-color:rgba(33,158,188,0.18);
                    transform:translateX(2px);
                }
                .pl-nav-item.active {
                    background:rgba(33,158,188,0.13);
                    color:#219EBC;
                    border-color:rgba(33,158,188,0.38);
                    box-shadow:0 4px 20px rgba(33,158,188,0.1), inset 0 0 0 1px rgba(33,158,188,0.08);
                }
                .pl-nav-item.active::before {
                    content:'';
                    position:absolute;left:0;top:18%;bottom:18%;
                    width:3px;border-radius:0 3px 3px 0;
                    background:#219EBC;
                    box-shadow:0 0 10px rgba(33,158,188,0.7);
                }

                /* Section label */
                .pl-section-lbl {
                    font-family:'Raleway',sans-serif;font-size:0.58rem;font-weight:600;
                    letter-spacing:0.22em;text-transform:uppercase;
                    color:rgba(182,194,226,0.25);padding:0 18px;margin-bottom:6px;
                }

                /* Divider */
                .pl-divider { height:1px;background:linear-gradient(90deg,rgba(33,158,188,0.15),transparent);margin:12px 18px; }

                /* Logout button */
                .pl-logout {
                    display:flex;align-items:center;gap:10px;
                    padding:11px 18px;margin:2px 10px;border-radius:12px;
                    font-family:'Raleway',sans-serif;font-size:0.78rem;font-weight:600;
                    letter-spacing:0.08em;text-transform:uppercase;
                    color:rgba(248,113,113,0.6);
                    border:1px solid transparent;
                    cursor:pointer;background:none;width:calc(100% - 20px);
                    text-align:left;
                    transition:all 0.22s;
                }
                .pl-logout:hover {
                    background:rgba(239,68,68,0.1);
                    border-color:rgba(239,68,68,0.3);
                    color:#f87171;
                    transform:translateX(2px);
                }

                /* ── Content pane ── */
                .pl-content {
                    flex:1;
                    overflow-y:auto;
                    position:relative;
                    z-index:5;
                    scrollbar-width:thin;
                    scrollbar-color:rgba(33,158,188,0.22) transparent;
                }
                .pl-content::-webkit-scrollbar { width:4px; }
                .pl-content::-webkit-scrollbar-thumb { background:rgba(33,158,188,0.22);border-radius:4px; }
                .pl-content::-webkit-scrollbar-track { background:transparent; }
            `}</style>

            {/* Root — full page */}
            <div style={{
                minHeight: '100vh',
                background: '#0A1128',
                display: 'flex',
                flexDirection: 'column',
                fontFamily: "'Raleway',sans-serif",
                position: 'relative',
                overflow: 'hidden',
            }}>

                {/* ── Atmosphere ── */}
                <div className="pl-nebula" style={{ width: 500, height: 400, top: '-8%', left: '-6%', background: 'rgba(33,158,188,0.07)', animationDelay: '0s' }} />
                <div className="pl-nebula" style={{ width: 400, height: 340, bottom: '0', right: '-5%', background: 'rgba(18,103,130,0.08)', animationDelay: '-9s' }} />
                <div className="pl-nebula" style={{ width: 260, height: 260, top: '44%', left: '50%', background: 'rgba(33,158,188,0.04)', animationDelay: '-4s' }} />

                {[
                    { top: '5%', left: '3%', s: 2, dur: '3.1s', dl: '0s' },
                    { top: '13%', left: '94%', s: 1.5, dur: '3.8s', dl: '-1s' },
                    { top: '68%', left: '2%', s: 2, dur: '4.2s', dl: '-2s' },
                    { top: '88%', left: '93%', s: 1.5, dur: '2.7s', dl: '-0.5s' },
                    { top: '40%', left: '97%', s: 1, dur: '3.5s', dl: '-1.5s' },
                ].map((s, i) => (
                    <div key={i} className="pl-star" style={{ top: s.top, left: s.left, width: s.s, height: s.s, '--dur': s.dur, '--delay': s.dl } as React.CSSProperties} />
                ))}
                <div className="pl-shoot" style={{ width: 110, top: '10%', left: '8%', animationDelay: '2.2s' }} />
                <div className="pl-shoot" style={{ width: 70, top: '60%', left: '4%', animationDelay: '7s' }} />

                {/* ── Navbar ── */}
                <div style={{ position: 'relative', zIndex: 10 }}>
                    <UserNavbar />
                </div>

                {/* ── Body: sidebar + content ── */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'opacity 0.6s cubic-bezier(.22,1,.36,1), transform 0.6s cubic-bezier(.22,1,.36,1)',
                    minHeight: 0,
                }}>

                    {/* ── Sidebar ── */}
                    <aside className="pl-sidebar">

                        {/* User block */}
                        <div style={{ padding: '28px 18px 22px', borderBottom: '1px solid rgba(33,158,188,0.1)' }}>
                            <div className="pl-avatar" style={{ marginBottom: 14 }}>{userInitial}</div>
                            <p style={{ fontFamily: "'Cinzel',serif", fontSize: '0.92rem', fontWeight: 700, color: '#fff', margin: '0 0 3px', letterSpacing: '0.03em', lineHeight: 1.2 }}>
                                {userName}
                            </p>
                            <p style={{ color: 'rgba(182,194,226,0.4)', fontSize: '0.7rem', margin: 0, fontWeight: 300, wordBreak: 'break-all' }}>
                                {userEmail}
                            </p>
                        </div>

                        {/* Nav */}
                        <div style={{ padding: '16px 0 0', flex: 1 }}>
                            <p className="pl-section-lbl">Menu</p>

                            {navItems.map(item => (
                                <button
                                    key={item.key}
                                    className={`pl-nav-item${currentPage === item.key ? ' active' : ''}`}
                                    onClick={() => setCurrentPage(item.key)}
                                >
                                    {item.icon}
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        {/* Divider + logout */}
                        <div style={{ padding: '0 0 20px' }}>
                            <div className="pl-divider" />
                            <button className="pl-logout" onClick={handleLogout}>
                                <LogOut size={15} />
                                Logout
                            </button>
                        </div>
                    </aside>

                    {/* ── Page content ── */}
                    <main className="pl-content">
                        {currentPage === 'alerts' && <AlertsPage />}
                    </main>
                </div>
            </div>
        </>
    );
}