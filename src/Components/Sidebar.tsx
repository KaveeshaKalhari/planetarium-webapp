import { User, Calendar, Bell} from 'lucide-react';
import LogoutButton from "./LogoutButton.tsx";

export type PageType = 'profile' | 'reservations' | 'alerts';

interface SidebarProps {
    activeTab: PageType;
    onTabChange: (tab: PageType) => void;
    onLogout?: () => void;
    userName?: string;
    userInitials?: string;
}

export default function Sidebar({
                                    activeTab,
                                    onTabChange,
                                    userName = 'Sophia Carter',
                                    userInitials = 'SC',
                                }: SidebarProps) {
    return (
 <div className="w-72 p-4 flex flex-col min-h-screen border-r-2 border-blue-400">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-blue-800">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
                    <span className="text-white font-semibold">{userInitials}</span>
                </div>
                <span className="text-white text-sm font-medium">{userName}</span>
            </div>

            <nav className="flex-1 space-y-3">
                <button
                    onClick={() => onTabChange('profile')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium ${
                        activeTab === 'profile'
                            ? 'bg-[#89C1D1] text-slate-900'
                            : 'bg-blue-800/50 text-slate-300 hover:bg-blue-800/70'
                    }`}
                >
                    <User size={18} /> <span className="text-sm">Profile</span>
                </button>

                <button
                    onClick={() => onTabChange('reservations')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium ${
                        activeTab === 'reservations'
                            ? 'bg-[#89C1D1] text-slate-900'
                            : 'bg-blue-800/50 text-slate-300 hover:bg-blue-800/70'
                    }`}
                >
                    <Calendar size={18} /> <span className="text-sm">Reservations</span>
                </button>

                <button
                    onClick={() => onTabChange('alerts')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium ${
                        activeTab === 'alerts'
                            ? 'bg-[#89C1D1] text-slate-900'
                            : 'bg-blue-800/50 text-slate-300 hover:bg-blue-800/70'
                    }`}
                >
                    <Bell size={18} /> <span className="text-sm">Alerts</span>
                </button>
            </nav>

            <LogoutButton />
        </div>
    );
}
