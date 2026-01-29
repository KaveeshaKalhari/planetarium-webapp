import { useState } from "react";
import { Bell, Ticket, Clock, Volume2 } from "lucide-react";

export default function AlertsPage() {
    const [alerts, setAlerts] = useState([
        {
            id: '1',
            title: 'Booking Confirmation',
            message: 'Your booking is confirmed.',
            timestamp: '2 hours ago',
            icon: 'ticket',
        }
    ]);

    const handleDismiss = (id: string) => {
        setAlerts(alerts.filter(a => a.id !== id));
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'ticket': return <Ticket size={20} />;
            case 'clock': return <Clock size={20} />;
            case 'volume': return <Volume2 size={20} />;
            default: return <Bell size={20} />;
        }
    };

    return (
        <div className="flex-1 p-12">
            <div className="max-w-3xl">
                <h1 className="text-white text-3xl font-bold mb-2">My Alerts</h1>
                <p className="text-slate-400 mb-8">Notifications and updates</p>

                <div className="space-y-4">
                    {alerts.map(alert => (
                        <div key={alert.id} className="bg-slate-800/40 p-6 rounded-lg border border-slate-700/50">
                            <div className="flex items-start justify-between">
                                <div className="flex gap-3">
                                    <div className="text-slate-400">{getIcon(alert.icon)}</div>
                                    <div>
                                        <h3 className="text-white font-semibold text-lg">{alert.title}</h3>
                                        <p className="text-slate-300 text-sm">{alert.message}</p>
                                    </div>
                                </div>
                                <span className="text-slate-500 text-xs">{alert.timestamp}</span>
                            </div>

                            <div className="flex gap-2 mt-4">
                                <button className="px-5 py-2 bg-blue-600 text-white rounded-lg">View</button>
                                <button
                                    onClick={() => handleDismiss(alert.id)}
                                    className="px-5 py-2 bg-slate-700 text-slate-300 rounded-lg"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    ))}

                    {alerts.length === 0 && (
                        <div className="text-center py-16">
                            <Bell size={48} className="mx-auto text-slate-600 mb-4" />
                            <p className="text-slate-400 text-lg">No alerts right now</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
