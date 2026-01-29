import { useState, useRef, useEffect } from 'react';
import { User, Bell, Calendar, LogOut, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfileDropdownProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ProfileDropdown({ isOpen, onClose }: ProfileDropdownProps) {
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState<'notifications' | 'reservations'>('notifications');

    // Sample data - replace with real data later
    const notifications = [
        {
            id: 1,
            title: 'Booking Confirmed',
            message: 'Your reservation for "Journey to the Stars" is confirmed',
            time: '2 hours ago',
            read: false
        },
        {
            id: 2,
            title: 'Upcoming Show',
            message: 'Your show starts in 24 hours. Don\'t forget!',
            time: '5 hours ago',
            read: false
        },
        {
            id: 3,
            title: 'Payment Successful',
            message: 'Payment of $45.00 received successfully',
            time: '1 day ago',
            read: true
        }
    ];

    const reservations = [
        {
            id: 'PB001',
            show: 'Journey to the Stars',
            date: 'Jan 28, 2026',
            time: '7:00 PM',
            seats: 2,
            status: 'Confirmed',
            amount: '$45.00'
        },
        {
            id: 'PB002',
            show: 'Cosmic Wonders',
            date: 'Feb 05, 2026',
            time: '3:00 PM',
            seats: 3,
            status: 'Confirmed',
            amount: '$54.00'
        },
        {
            id: 'PB003',
            show: 'Solar System Adventure',
            date: 'Jan 15, 2026',
            time: '5:00 PM',
            seats: 2,
            status: 'Completed',
            amount: '$36.00'
        }
    ];

    const userData = {
        name: 'John Doe',
        email: 'john.doe@email.com',
        avatar: null
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen, onClose]);

    const handleLogout = () => {
        // Clear any session data
        sessionStorage.clear();
        localStorage.clear();
        onClose();
        navigate('/');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-end pt-16 pr-4">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/20" onClick={onClose}></div>

            {/* Dropdown */}
            <div
                ref={dropdownRef}
                className="relative bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[calc(100vh-5rem)] overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-[#0A1128] to-[#001F54] text-white p-6">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-[#1282A2] rounded-full flex items-center justify-center">
                            <User className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{userData.name}</h2>
                            <p className="text-sm text-white/80">{userData.email}</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-[#0A1128]/10">
                    <button
                        onClick={() => setActiveTab('notifications')}
                        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                            activeTab === 'notifications'
                                ? 'text-[#1282A2] border-b-2 border-[#1282A2]'
                                : 'text-[#0A1128]/60 hover:text-[#0A1128]'
                        }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <Bell className="w-4 h-4" />
                            Notifications
                            {notifications.filter(n => !n.read).length > 0 && (
                                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {notifications.filter(n => !n.read).length}
                </span>
                            )}
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('reservations')}
                        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                            activeTab === 'reservations'
                                ? 'text-[#1282A2] border-b-2 border-[#1282A2]'
                                : 'text-[#0A1128]/60 hover:text-[#0A1128]'
                        }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Reservations
                        </div>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {activeTab === 'notifications' && (
                        <div className="space-y-3">
                            {notifications.length === 0 ? (
                                <div className="text-center py-8 text-[#0A1128]/60">
                                    <Bell className="w-12 h-12 mx-auto mb-3 text-[#0A1128]/30" />
                                    <p>No notifications</p>
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 rounded-lg border transition-colors ${
                                            notification.read
                                                ? 'bg-white border-[#0A1128]/10'
                                                : 'bg-[#1282A2]/5 border-[#1282A2]/20'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between mb-1">
                                            <h4 className="font-semibold text-[#0A1128]">{notification.title}</h4>
                                            {!notification.read && (
                                                <span className="w-2 h-2 bg-[#1282A2] rounded-full"></span>
                                            )}
                                        </div>
                                        <p className="text-sm text-[#0A1128]/70 mb-2">{notification.message}</p>
                                        <p className="text-xs text-[#0A1128]/50">{notification.time}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'reservations' && (
                        <div className="space-y-3">
                            {reservations.length === 0 ? (
                                <div className="text-center py-8 text-[#0A1128]/60">
                                    <Calendar className="w-12 h-12 mx-auto mb-3 text-[#0A1128]/30" />
                                    <p>No reservations yet</p>
                                </div>
                            ) : (
                                reservations.map((reservation) => (
                                    <div
                                        key={reservation.id}
                                        className="p-4 rounded-lg border border-[#0A1128]/10 hover:border-[#1282A2]/30 transition-colors"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h4 className="font-semibold text-[#0A1128]">{reservation.show}</h4>
                                                <p className="text-xs text-[#0A1128]/50">ID: {reservation.id}</p>
                                            </div>
                                            <span
                                                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                                    reservation.status === 'Confirmed'
                                                        ? 'bg-green-100 text-green-800'
                                                        : reservation.status === 'Completed'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                }`}
                                            >
                        {reservation.status}
                      </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-sm text-[#0A1128]/70">
                                            <div>
                                                <p className="text-xs text-[#0A1128]/50">Date</p>
                                                <p className="font-medium">{reservation.date}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-[#0A1128]/50">Time</p>
                                                <p className="font-medium">{reservation.time}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-[#0A1128]/50">Seats</p>
                                                <p className="font-medium">{reservation.seats}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-[#0A1128]/50">Amount</p>
                                                <p className="font-medium text-[#1282A2]">{reservation.amount}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Footer - Logout Button */}
                <div className="border-t border-[#0A1128]/10 p-4">
                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors flex items-center justify-center gap-2 font-semibold"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
