import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, DollarSign, FileText, MessageSquare, Rocket, CalendarDays, LogOut } from 'lucide-react';

export function AdminSidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const isActive = (path: string) => location.pathname === path;

    const menuItems = [
        { path: '/admin-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/booking-analysis', icon: TrendingUp, label: 'Booking Analysis' },
        { path: '/revenue-analysis', icon: DollarSign, label: 'Revenue Analysis' },
        { path: '/event-management', icon: CalendarDays, label: 'Event Management' },
        { path: '/admin-blog', icon: FileText, label: 'Blog Approval' },
        { path: '/admin-chat', icon: MessageSquare, label: 'Chat Moderation' }
    ];

    const handleLogout = () => {
        // Clear any session data
        sessionStorage.clear();
        localStorage.clear();
        // Navigate to home page
        navigate('/');
    };

    return (
        <div className="w-64 bg-[#001F54] text-white min-h-screen flex flex-col">
            <div className="p-6">
                <Link to="/" className="flex items-center gap-2">
                    <Rocket className="w-8 h-8 text-[#1282A2]" />
                    <div>
                        <h2 className="text-lg font-bold">Smart Planetarium</h2>
                        <p className="text-xs text-white/70">Admin Panel</p>
                    </div>
                </Link>
            </div>

            <nav className="px-3 flex-1">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                            isActive(item.path)
                                ? 'bg-[#1282A2] text-white'
                                : 'text-white/80 hover:bg-[#034078]'
                        }`}
                    >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>

            {/* Logout Button */}
            <div className="p-3 border-t border-white/10">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-white/80 hover:bg-[#034078] transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}