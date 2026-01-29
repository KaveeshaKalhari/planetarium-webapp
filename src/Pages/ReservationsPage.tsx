import { Calendar, Clock, Ticket } from "lucide-react";
import {Link} from "react-router-dom";

export default function ReservationsPage() {
    const upcomingReservations = [
        {
            id: '1',
            title: 'Journey Through the Cosmos',
            date: 'December 25, 2025',
            time: '7:30 PM',
            tickets: 2,
        },
    ];

    const pastReservations = [
        {
            id: '3',
            title: 'Black Holes: The Other Side of Infinity',
            date: 'August 25, 2025',
        },
    ];

    return (
        <div className="flex-1 p-12">
            <div className="max-w-4xl">
                <h1 className="text-white text-3xl font-bold mb-2">My Reservations</h1>
                <p className="text-slate-400 mb-8">Manage your upcoming and past experiences</p>

                <Link
                    to="/booking"
                    className="flex-1 px-4 py-2  bg-[#248277] text-white rounded-lg"
                >
                    Order New Tickets
                </Link>

                <h2 className="text-white text-xl font-semibold mb-4 mt-8">Upcoming</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {upcomingReservations.map(res => (
                        <div key={res.id} className="bg-slate-800/40 p-5 rounded-lg border border-slate-700/50">
                            <h3 className="text-white text-lg font-medium mb-4">{res.title}</h3>

                            <div className="space-y-2 text-slate-300 text-sm">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} /> {res.date}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={16} /> {res.time}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Ticket size={16} /> {res.tickets} Tickets
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4">
                                <button className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg">
                                    View Tickets
                                </button>
                                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg">
                                    Modify
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <h2 className="text-white text-xl font-semibold my-6">Past</h2>
                <div className="space-y-3">
                    {pastReservations.map(res => (
                        <div key={res.id} className="bg-slate-800/40 p-5 rounded-lg border border-slate-700/50 flex items-center justify-between">
                            <div>
                                <h3 className="text-white font-medium">{res.title}</h3>
                                <p className="text-slate-400 text-sm">{res.date}</p>
                            </div>

                            <button className="px-5 py-2 bg-slate-700 text-white rounded-lg">
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
