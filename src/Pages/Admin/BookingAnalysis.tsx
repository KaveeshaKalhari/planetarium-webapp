import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AdminSidebar } from '../../components/AdminSidebar';

export function BookingAnalysis() {
    const [dateRange, setDateRange] = useState('7days');

    const trendData = [
        { date: 'Jan 20', bookings: 18 },
        { date: 'Jan 21', bookings: 22 },
        { date: 'Jan 22', bookings: 25 },
        { date: 'Jan 23', bookings: 20 },
        { date: 'Jan 24', bookings: 28 },
        { date: 'Jan 25', bookings: 32 }
    ];

    const recentBookings = [
        { id: 'PB126', customer: 'Alice Johnson', email: 'alice@email.com', seats: 3, date: 'Jan 26, 2026', time: '7:00 PM', amount: '$45.00', status: 'Confirmed' },
        { id: 'PB125', customer: 'Bob Smith', email: 'bob@email.com', seats: 2, date: 'Jan 26, 2026', time: '3:00 PM', amount: '$36.00', status: 'Confirmed' },
        { id: 'PB124', customer: 'Carol White', email: 'carol@email.com', seats: 4, date: 'Jan 25, 2026', time: '5:00 PM', amount: '$48.00', status: 'Confirmed' },
        { id: 'PB123', customer: 'David Lee', email: 'david@email.com', seats: 2, date: 'Jan 25, 2026', time: '8:00 PM', amount: '$40.00', status: 'Pending' },
        { id: 'PB122', customer: 'Emma Davis', email: 'emma@email.com', seats: 5, date: 'Jan 24, 2026', time: '7:00 PM', amount: '$75.00', status: 'Confirmed' }
    ];

    return (
        <div className="flex min-h-screen bg-[#FEFCFB]">
            <AdminSidebar />

            <div className="flex-1 p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#0A1128] mb-2">Booking Analysis</h1>
                    <p className="text-[#0A1128]/70">Track and analyze booking patterns</p>
                </div>

                {/* Filters */}
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
                                className={`px-4 py-2 rounded-md transition-colors ${
                                    dateRange === range
                                        ? 'bg-[#1282A2] text-white'
                                        : 'bg-[#0A1128]/5 text-[#0A1128] hover:bg-[#0A1128]/10'
                                }`}
                            >
                                {range === '7days' ? 'Last 7 Days' : range === '30days' ? 'Last 30 Days' : range === '3months' ? 'Last 3 Months' : 'This Year'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold text-[#0A1128] mb-4">Daily Booking Trends</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="bookings" stroke="#1282A2" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#0A1128]/70 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#0A1128]/70 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#0A1128]/70 uppercase tracking-wider">Date & Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#0A1128]/70 uppercase tracking-wider">Seats</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#0A1128]/70 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#0A1128]/70 uppercase tracking-wider">Status</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-[#0A1128]/10">
                            {recentBookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-[#0A1128]/5">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0A1128]">{booking.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-[#0A1128]">{booking.customer}</div>
                                        <div className="text-xs text-[#0A1128]/60">{booking.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-[#0A1128]">{booking.date}</div>
                                        <div className="text-xs text-[#0A1128]/60">{booking.time}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0A1128]">{booking.seats}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#1282A2]">{booking.amount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status}
                      </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
