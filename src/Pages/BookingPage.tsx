import React, { useState } from "react";

const steps = [
    { label: "Select Show", path: "/booking" },
    { label: "Choose Seats", path: "/choose-seats" },
    { label: "Review Order", path: "/review-order" },
    { label: "Payment", path: "/payment" },
];

const show = {
    title: "Galaxies Nebulae",
    description:
        "Explore the vibrant clouds of gas and dust where stars are born.",
    image:
        "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80",
};

const times = [
    "10.00 AM",
    "12.00 PM",
    "2.00 AM",
    "4.00 AM",
    "6.00 AM",
];

const TicketBooking: React.FC = () => {
    const [selectedStep, setSelectedStep] = useState(0);
    const [selectedTime, setSelectedTime] = useState(times[0]);
    const [selectedDate, setSelectedDate] = useState("2028-07-28");

    return (
        <div className="min-h-screen bg-[#08132a] flex flex-col items-center pt-10">
            <div className="bg-[#16244a] rounded-lg shadow-lg w-full max-w-3xl px-8 py-8 border border-white">
                <h1 className="text-3xl font-bold text-white text-center mb-2">Ticket Booking</h1>
                <p className="text-center text-cyan-300 mb-8">
                    Follow the steps below to complete your booking for an unforgettable journey through the planetarium
                </p>
                {/* Stepper */}
                <div className="flex justify-center items-center mb-10 gap-8">
                    {steps.map((step, idx) => (
                        <div key={step.label} className="flex flex-col items-center">
                            <button
                                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg font-bold mb-2 ${
                                    selectedStep === idx
                                        ? "bg-[#16244a] border-cyan-400 text-cyan-300"
                                        : "bg-[#16244a] border-gray-400 text-white"
                                }`}
                                onClick={() => setSelectedStep(idx)}
                            >
                                {idx + 1}
                            </button>
                            <span
                                className={`text-xs ${
                                    selectedStep === idx ? "text-cyan-300" : "text-white"
                                }`}
                            >
                {step.label}
              </span>
                        </div>
                    ))}
                </div>
                {/* Booking Card */}
                <div className="flex gap-6 items-start bg-[#dbeafe] rounded-lg p-6">
                    <img
                        src={show.image}
                        alt={show.title}
                        className="w-40 h-32 object-cover rounded"
                    />
                    <div className="flex-1">
                        <div className="bg-white rounded shadow p-3 mb-4">
                            <h2 className="font-semibold text-lg text-[#16244a]">{show.title}</h2>
                            <p className="text-sm text-gray-700">{show.description}</p>
                        </div>
                        <div>
                            <label className="block text-[#16244a] font-semibold mb-2">
                                Select Date &amp; Showtime
                            </label>
                            <div className="flex items-center gap-2 mb-3">
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={e => setSelectedDate(e.target.value)}
                                    className="px-2 py-1 rounded bg-white text-[#16244a] border border-gray-300"
                                />
                                <span>
                  <svg className="w-5 h-5 text-[#16244a]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                </span>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {times.map(time => (
                                    <button
                                        key={time}
                                        type="button"
                                        onClick={() => setSelectedTime(time)}
                                        className={`px-4 py-2 rounded bg-white text-[#16244a] border ${
                                            selectedTime === time
                                                ? "border-cyan-400 font-bold"
                                                : "border-gray-300"
                                        }`}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketBooking;
