import { DollarSign, TrendingUp } from 'lucide-react';
import {LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import { AdminSidebar } from "../../components/AdminSidebar.tsx";

export function RevenueAnalysis() {
    const dailyRevenue = [
        { date: 'Jan 20', revenue: 450 },
        { date: 'Jan 21', revenue: 680 },
        { date: 'Jan 22', revenue: 720 },
        { date: 'Jan 23', revenue: 590 },
        { date: 'Jan 24', revenue: 820 },
        { date: 'Jan 25', revenue: 950 }
    ];

    const monthlyRevenue = [
        { month: 'Aug', revenue: 12500 },
        { month: 'Sep', revenue: 14800 },
        { month: 'Oct', revenue: 16200 },
        { month: 'Nov', revenue: 18400 },
        { month: 'Dec', revenue: 21000 },
        { month: 'Jan', revenue: 24600 }
    ];

    const stats = [
        { label: 'Total Revenue', value: '$24,600', change: '+15.2%', icon: DollarSign },
        { label: 'Monthly Growth', value: '+17.1%', change: '+2.3%', icon: TrendingUp },
        { label: 'Average Booking Value', value: '$42.50', change: '+5.8%', icon: DollarSign }
    ];

    return (
        <div className="flex min-h-screen bg-[#FEFCFB]">
            <AdminSidebar />

            <div className="flex-1 p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#0A1128] mb-2">Revenue Analysis</h1>
                    <p className="text-[#0A1128]/70">Track financial performance and trends</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <div className="bg-[#1282A2] p-3 rounded-lg">
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-green-600 text-sm font-medium">{stat.change}</span>
                            </div>
                            <p className="text-2xl font-bold text-[#0A1128] mb-1">{stat.value}</p>
                            <p className="text-sm text-[#0A1128]/60">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold text-[#0A1128] mb-4">Daily Revenue</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={dailyRevenue}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="revenue" stroke="#1282A2" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold text-[#0A1128] mb-4">Monthly Revenue Trends</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={monthlyRevenue}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="revenue" fill="#034078" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}