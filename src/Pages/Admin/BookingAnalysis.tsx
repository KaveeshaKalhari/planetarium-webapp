import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AdminSidebar } from "../../components/AdminSidebar.tsx";
import api from '../../services/api';

const rangeMap: Record<string, number> = {
    '7days': 7,
    '30days': 30,
    '3months': 90,
    'year': 365,
};

export function BookingAnalysis() {
    const [dateRange, setDateRange] = useState('7days');
    const [trendData, setTrendData] = useState<any[]>([]);
    const [recentBookings, setRecentBookings] = useState<any[]>([]);
    const [totalThisMonth, setTotalThisMonth] = useState(0);
    const [loading, setLoading] = useState(true);
    const [viewingForm, setViewingForm] = useState<any | null>(null);

    useEffect(() => {
        setLoading(true);
        const days = rangeMap[dateRange];
        Promise.all([
            api.get(`/analytics/bookings?days=${days}`),
            api.get('/bookings/admin/all'),
        ]).then(([analyticsRes, bookingsRes]) => {
            setTrendData(analyticsRes.data.trend || []);
            setTotalThisMonth(analyticsRes.data.totalThisMonth || 0);

            // Only show bookings for shows that haven't happened yet
            const now = new Date();
            const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
            const upcoming = (bookingsRes.data || []).filter((b: any) => b.showDate && b.showDate >= todayStr);

            setRecentBookings(upcoming.slice(0, 10));
        }).catch(console.error)
            .finally(() => setLoading(false));
    }, [dateRange]);

    return (
        <div className="flex min-h-screen bg-[#FEFCFB]">
            <AdminSidebar />

            <div className="flex-1 p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#0A1128] mb-2">Booking Analysis</h1>
                    <p className="text-[#0A1128]/70">Track and analyze booking patterns</p>
                </div>

                {/* Summary Card */}
                <div className="bg-white p-6 rounded-lg shadow-lg mb-6 inline-block">
                    <p className="text-sm text-[#0A1128]/60 mb-1">Total Bookings This Month</p>
                    <p className="text-3xl font-bold text-[#1282A2]">
                        {loading ? '...' : totalThisMonth}
                    </p>
                </div>

                {/* Date Range Filter */}
                <div className="bg-white p-4 rounded-lg shadow-lg mb-6 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-[#1282A2]" />
                        <span className="font-medium text-[#0A1128]">Date Range:</span>
                    </div>
                    <div className="flex gap-2">
                        {['7days', '30days', '3months', 'year'].map((range) => (
                            <button
                                key={range}
                                onClick={() => setDateRange(range)}
                                className={`px-4 py-2 rounded-md transition-colors ${dateRange === range
                                    ? 'bg-[#1282A2] text-white'
                                    : 'bg-[#0A1128]/5 text-[#0A1128] hover:bg-[#0A1128]/10'
                                    }`}
                            >
                                {range === '7days' ? 'Last 7 Days'
                                    : range === '30days' ? 'Last 30 Days'
                                        : range === '3months' ? 'Last 3 Months'
                                            : 'This Year'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chart */}
                <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                    <h3 className="text-lg font-semibold text-[#0A1128] mb-4">Daily Booking Trends</h3>
                    {loading ? (
                        <div className="h-[300px] flex items-center justify-center text-[#0A1128]/40">
                            Loading chart...
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="bookings" stroke="#1282A2" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Recent Bookings Table */}
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0A1128]/70 uppercase tracking-wider">Form</th>
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
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {booking.schoolForm ? (
                                                        <button
                                                            onClick={() => setViewingForm(booking)}
                                                            className="text-[#1282A2] font-medium hover:underline"
                                                        >
                                                            View Form
                                                        </button>
                                                    ) : (
                                                        <span className="text-[#0A1128]/30">—</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* School Form Modal */}
                {viewingForm && (
                    <div
                        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
                        onClick={() => setViewingForm(null)}
                    >
                        <div
                            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-[#0A1128]">School Booking Form</h3>
                                <button
                                    onClick={() => setViewingForm(null)}
                                    className="text-[#0A1128]/40 hover:text-[#0A1128] text-xl leading-none"
                                >
                                    &times;
                                </button>
                            </div>
                            <p className="text-xs text-[#0A1128]/50 mb-4">
                                Booking Ref: {viewingForm.bookingReference}
                            </p>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <p className="text-[#0A1128]/50 text-xs">School Name</p>
                                    <p className="font-medium text-[#0A1128]">{viewingForm.schoolForm?.schoolName || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-[#0A1128]/50 text-xs">School Address</p>
                                    <p className="font-medium text-[#0A1128]">{viewingForm.schoolForm?.schoolAddress || '—'}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-[#0A1128]/50 text-xs">Contact Person</p>
                                        <p className="font-medium text-[#0A1128]">{viewingForm.schoolForm?.teacherName || '—'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[#0A1128]/50 text-xs">Contact Number</p>
                                        <p className="font-medium text-[#0A1128]">{viewingForm.schoolForm?.contactNumber || '—'}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[#0A1128]/50 text-xs">Email</p>
                                    <p className="font-medium text-[#0A1128]">{viewingForm.schoolForm?.email || '—'}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-[#0A1128]/50 text-xs">Number of Students</p>
                                        <p className="font-medium text-[#0A1128]">{viewingForm.schoolForm?.studentCount ?? '—'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[#0A1128]/50 text-xs">Grade Level</p>
                                        <p className="font-medium text-[#0A1128]">{viewingForm.schoolForm?.gradeLevel || '—'}</p>
                                    </div>
                                </div>
                                {viewingForm.schoolForm?.otherInfo && (
                                    <div>
                                        <p className="text-[#0A1128]/50 text-xs">Additional Notes</p>
                                        <p className="font-medium text-[#0A1128]">{viewingForm.schoolForm.otherInfo}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}