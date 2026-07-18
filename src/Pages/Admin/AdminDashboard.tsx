import { useState, useEffect } from 'react';
import { DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AdminSidebar } from "../../components/AdminSidebar.tsx";
import api from '../../services/api';

export function AdminDashboard() {
    const [summary, setSummary] = useState({ bookingsToday: 0, bookingsThisMonth: 0, revenueThisMonth: 0 });
    const [bookingData, setBookingData] = useState<any[]>([]);
    const [revenueData, setRevenueData] = useState<any[]>([]);
    const [recentBookings, setRecentBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.allSettled([
            api.get('/analytics/dashboard'),
            api.get('/analytics/bookings?days=30'),
            api.get('/analytics/revenue'),
            api.get('/bookings/admin/all'),
        ]).then(([dashRes, bookingRes, revenueRes, allBookingsRes]) => {
            if (dashRes.status === 'fulfilled') {
                setSummary(dashRes.value.data);
            } else {
                console.error('Dashboard summary failed:', dashRes.reason);
            }

            if (bookingRes.status === 'fulfilled') {
                setBookingData(bookingRes.value.data.trend || []);
            } else {
                console.error('Booking trend failed:', bookingRes.reason);
            }

            if (revenueRes.status === 'fulfilled') {
                setRevenueData(revenueRes.value.data.monthly || []);
            } else {
                console.error('Revenue failed:', revenueRes.reason);
            }

            if (allBookingsRes.status === 'fulfilled') {
                // Show the most recently created bookings first
                const sorted = [...(allBookingsRes.value.data || [])]
                    .sort((a: any, b: any) => (b.id ?? 0) - (a.id ?? 0));
                setRecentBookings(sorted.slice(0, 5));
            } else {
                console.error('Recent bookings failed:', allBookingsRes.reason);
            }
        }).finally(() => setLoading(false));
    }, []);

    const stats = [
        { label: 'Bookings Today', value: summary.bookingsToday.toString(), icon: Calendar, color: 'bg-[#1282A2]' },
        { label: 'Bookings This Month', value: summary.bookingsThisMonth.toString(), icon: TrendingUp, color: 'bg-[#034078]' },
        { label: 'Revenue This Month', value: `Rs ${summary.revenueThisMonth.toFixed(2)}`, icon: DollarSign, color: 'bg-[#001F54]' },
    ];

    return (
        <div className="flex min-h-screen bg-[#FEFCFB]">
            <AdminSidebar />

            <div className="flex-1 p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#0A1128] mb-2">Dashboard Overview</h1>
                    <p className="text-[#0A1128]/70">Welcome to your admin control center</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`${stat.color} p-3 rounded-lg`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-[#0A1128] mb-1">
                                {loading ? '...' : stat.value}
                            </p>
                            <p className="text-sm text-[#0A1128]/60">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold text-[#0A1128] mb-4">Booking Trends (Last 30 Days)</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={bookingData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="bookings" fill="#1282A2" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold text-[#0A1128] mb-4">Revenue Growth (Monthly)</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="revenue" stroke="#034078" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Bookings */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-[#0A1128]/10">
                        <h3 className="text-lg font-semibold text-[#0A1128]">Recent Bookings</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#0A1128]/5">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0A1128]/70 uppercase tracking-wider">Booking Ref</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0A1128]/70 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0A1128]/70 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0A1128]/70 uppercase tracking-wider">Show Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0A1128]/70 uppercase tracking-wider">Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0A1128]/70 uppercase tracking-wider">Seats</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0A1128]/70 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0A1128]/70 uppercase tracking-wider">Booked On</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#0A1128]/10">
                                {loading ? (
                                    <tr>
                                        <td colSpan={9} className="px-6 py-8 text-center text-[#0A1128]/50">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : recentBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="px-6 py-8 text-center text-[#0A1128]/50">
                                            No bookings found.
                                        </td>
                                    </tr>
                                ) : (
                                    recentBookings.map((booking: any) => {
                                        return (
                                            <tr key={booking.id} className="hover:bg-[#0A1128]/5">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0A1128]">
                                                    {booking.bookingReference}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${booking.audienceType === 'School Program'
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : 'bg-blue-100 text-blue-700'
                                                        }`}>
                                                        {booking.audienceType === 'School Program' ? 'School' : 'Public'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0A1128]">
                                                    <div className="font-medium">{booking.customerName || '—'}</div>
                                                    <div className="text-xs text-[#0A1128]/50">{booking.customerEmail || ''}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0A1128]">
                                                    {booking.showDate?.toString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0A1128]">
                                                    {booking.showTime === 'morning' ? '10:00 AM' : '03:00 PM'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0A1128]">
                                                    {booking.numberOfSeats}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#1282A2]">
                                                    Rs {booking.totalAmount?.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0A1128]/60">
                                                    {booking.createdAt || '—'}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}