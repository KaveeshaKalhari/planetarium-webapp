import React from "react";
import Navbar from "../Components/Navbar";

const LandingPage: React.FC = () => {
    return (
        <div
            className="relative min-h-screen w-full flex flex-col bg-cover bg-center"
            style={{
                backgroundImage:
                    "linear-gradient(rgba(10,17,40,0.7), rgba(10,17,40,0.7)), url('/src/assets/planetarium-AI.png')",
            }}
        >
            <Navbar />
            <main className="flex flex-col items-center justify-center flex-grow text-center">
                <p className="text-[90px] font-medium text-white mt-10">Sri Lanka</p>
                <p className="text-[100px] font-bold text-white mb-12 -mt-7">PLANETARIUM</p>
            </main>
            <div className="flex flex-col items-center justify-center flex-grow text-center">
                <p className="max-w-2xl mb-5 text-gray-100 font-semibold drop-shadow-lg">
                    Follow the steps below to complete your booking for an unforgettable journey through the planetarium
                </p>
                <a
                    href="/sign-up"
                    className="bg-[#219EBC] hover:bg-[#126782] text-white font-bold px-8 py-3 rounded-lg transition text-lg shadow-lg"
                >
                    Get Started
                </a>
            </div>
        </div>
    );
};

export default LandingPage;