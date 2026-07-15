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