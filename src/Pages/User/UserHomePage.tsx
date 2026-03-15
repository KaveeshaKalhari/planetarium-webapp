import React from "react";
import { Calendar, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';
import UserNavbar from "../../components/UserNavbar.tsx";

const LandingPage: React.FC = () => {
    return (
        <div
            className="relative min-h-screen w-full flex flex-col bg-cover bg-center"
            style={{
                backgroundImage:
                    "linear-gradient(rgba(10,17,40,0.7), rgba(10,17,40,0.7)), url('/src/assets/planetarium-AI.png')",
            }}
        >
            <UserNavbar />
            <div className="text-center mt-28 mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Plan Your Visit</h2>
                <p className="text-lg text-white">Choose the best way to explore our planetarium shows</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                {/* Show Availability Card */}
                <div className="bg-white border-2 border-[#034078]/20 rounded-xl p-8 hover:border-[#1282A2] hover:shadow-xl transition-all">
                    <div className="bg-[#1282A2]/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                        <Calendar className="w-8 h-8 text-[#1282A2]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#0A1128] mb-3">Show Availability</h3>
                    <p className="text-[#001F54] mb-6 leading-relaxed">
                        Browse available dates and show times with language options. Perfect for planning your first visit or checking upcoming available slots.
                    </p>
                    <ul className="space-y-2 mb-6 text-sm text-[#001F54]/80">
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-[#1282A2] rounded-full"></div>
                            View calendar of available dates
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-[#1282A2] rounded-full"></div>
                            Check show times (10:00 AM & 01:00 PM)
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-[#1282A2] rounded-full"></div>
                            See language medium options
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-[#1282A2] rounded-full"></div>
                            Real-time seat availability
                        </li>
                    </ul>
                    <Link
                        to="/show-availability"
                        className="block w-full text-center px-6 py-3 bg-[#1282A2] hover:bg-[#034078] text-white rounded-lg transition-colors font-semibold"
                    >
                        View Show Availability
                    </Link>
                </div>

            {/* Scheduled Sessions Card */}
                {/* Book Now Card */}
                <div className="bg-white border-2 border-[#034078]/20 rounded-xl p-8 hover:border-[#1282A2] hover:shadow-xl transition-all">
                    <div className="bg-[#0A1128]/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                        <Ticket className="w-8 h-8 text-[#0A1128]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#0A1128] mb-3">Book Now</h3>
                    <p className="text-[#001F54] mb-6 leading-relaxed">
                        Ready to secure your seat? Start the complete booking process with our simple, step-by-step flow. From session selection to payment confirmation.
                    </p>
                    <ul className="space-y-2 mb-6 text-sm text-[#001F54]/80">
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-[#0A1128] rounded-full"></div>
                            Select scheduled session (date, time, content, language)
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-[#0A1128] rounded-full"></div>
                            Choose your preferred seats
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-[#0A1128] rounded-full"></div>
                            Review booking details and pricing
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-[#0A1128] rounded-full"></div>
                            Complete secure payment and receive confirmation
                        </li>
                    </ul>
                    <Link
                    to="/select-datetime"
                    className="block w-full text-center px-6 py-3 bg-[#034078] hover:bg-[#1282A2] text-white rounded-lg transition-colors font-semibold"
                >
                    Start Booking
                </Link>
            </div>
            </div>
        </div>
    );
};

export default LandingPage;