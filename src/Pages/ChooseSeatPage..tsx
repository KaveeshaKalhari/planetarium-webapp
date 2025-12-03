import React from "react";

const steps = [
    { label: "Select Show", path: "/booking" },
    { label: "Choose Seats", path: "/choose-seats" },
    { label: "Review Order", path: "/review-order" },
    { label: "Payment", path: "/payment" },
];

const ChooseSeatPage: React.FC = () => (
    <div className="min-h-screen bg-[#0a1121] flex flex-col items-center pt-12">
        <h1 className="text-4xl font-bold text-white text-center mb-3">Choose Your Seats</h1>
        <p className="text-center text-gray-300 mb-10">
            Select your preferred seats from the map below. Click on available seats to add them to your booking.
        </p>
        {/* Stepper */}
        <div className="flex justify-center items-center gap-16 mb-12 w-full max-w-3xl">
            {steps.map((step, idx) => (
                <div key={step.label} className="flex flex-col items-center w-32">
                    <div className="relative flex items-center">
                        <button
                            className={`w-16 h-16 rounded-full border-2 flex items-center justify-center text-2xl font-bold transition ${
                                idx === 1
                                    ? "bg-gray-300 border-cyan-400 text-[#0a1121] shadow-lg"
                                    : "bg-[#0a1121] border-white text-white"
                            }`}
                            disabled
                        >
                            {idx + 1}
                        </button>
                        {idx < steps.length - 1 && (
                            <span className="absolute right-[-64px] top-1/2 w-32 h-0.5 bg-white"></span>
                        )}
                    </div>
                    <span
                        className={`mt-3 text-base font-semibold ${
                            idx === 1 ? "text-white" : "text-gray-300"
                        }`}
                    >
                        {step.label}
                    </span>
                </div>
            ))}
        </div>
        {/* Seat map would go here */}
    </div>
);

export default ChooseSeatPage;