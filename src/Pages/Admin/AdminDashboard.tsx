import { Users, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AdminSidebar } from '../../components/AdminSidebar';

export function AdminDashboard() {
    const stats = [
        { label: 'Total Bookings', value: '1,248', icon: Calendar, color: 'bg-[#1282A2]' },
        { label: 'Total Revenue', value: '$18,720', icon: DollarSign, color: 'bg-[#034078]' },
        { label: 'Active Users', value: '856', icon: Users, color: 'bg-[#001F54]' },
        { label: 'Growth Rate', value: '+12.5%', icon: TrendingUp, color: 'bg-[#1282A2]' }
    ];

    const bookingData = [
        { month: 'Aug', bookings: 85 },
        { month: 'Sep', bookings: 92 },
        { month: 'Oct', bookings: 108 },
        { month: 'Nov', bookings: 125 },
        { month: 'Dec', bookings: 142 },
        { month: 'Jan', bookings: 156 }
    ];

    const revenueData = [
        { month: 'Aug', revenue: 1200 },
        { month: 'Sep', revenue: 1450 },
        { month: 'Oct', revenue: 1680 },
        { month: 'Nov', revenue: 1920 },
        { month: 'Dec', revenue: 2250 },
        { month: 'Jan', revenue: 2640 }
    ];

    const recentBookings = [
        { id: 'PB001', customer: 'John Doe', date: 'Jan 26', time: '7:00 PM', amount: '$45' },
        { id: 'PB002', customer: 'Jane Smith', date: 'Jan 26', time: '3:00 PM', amount: '$54' },
        { id: 'PB003', customer: 'Mike Johnson', date: 'Jan 25', time: '5:00 PM', amount: '$36' },
        { id: 'PB004', customer: 'Sarah Williams', date: 'Jan 25', time: '8:00 PM', amount: '$60' },
        { id: 'PB005', customer: 'Tom Brown', date: 'Jan 25', time: '7:00 PM', amount: '$45' }
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`${stat.color} p-3 rounded-lg`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-[#0A1128] mb-1">{stat.value}</p>
                            <p className="text-sm text-[#0A1128]/60">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold text-[#0A1128] mb-4">Booking Trends</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={bookingData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="bookings" fill="#1282A2" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold text-[#0A1128] mb-4">Revenue Growth</h3>
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#0A1128]/70 uppercase tracking-wider">Booking ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#0A1128]/70 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#0A1128]/70 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#0A1128]/70 uppercase tracking-wider">Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#0A1128]/70 uppercase tracking-wider">Amount</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-[#0A1128]/10">
                            {recentBookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-[#0A1128]/5">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0A1128]">{booking.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0A1128]">{booking.customer}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0A1128]">{booking.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0A1128]">{booking.time}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#1282A2]">{booking.amount}</td>
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