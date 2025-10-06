import React from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

const RegisterPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#0A1128] flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-lg px-8 py-10 w-full max-w-md flex flex-col">
                <h2 className="text-2xl font-bold text-center mb-2">Create Your Account</h2>
                <p className="text-center text-gray-600 mb-6 text-sm">
                    Join our community of space enthusiasts!
                </p>
                <form className="flex flex-col gap-4">
                    <div className="flex items-center bg-[#C7E6F5] rounded-md px-3 py-2">
                        <FaUser className="text-gray-500 mr-3" />
                        <input
                            type="text"
                            placeholder="Username"
                            className="bg-transparent outline-none flex-1 text-gray-700 text-sm"
                        />
                    </div>
                    <div className="flex items-center bg-[#C7E6F5] rounded-md px-3 py-2">
                        <FaEnvelope className="text-gray-500 mr-3" />
                        <input
                            type="email"
                            placeholder="Email"
                            className="bg-transparent outline-none flex-1 text-gray-700 text-sm"
                        />
                    </div>
                    <div className="flex items-center bg-[#C7E6F5] rounded-md px-3 py-2">
                        <FaLock className="text-gray-500 mr-3" />
                        <input
                            type="password"
                            placeholder="Password"
                            className="bg-transparent outline-none flex-1 text-gray-700 text-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-[#1B2A41] text-white font-semibold rounded-md py-2 mt-2 hover:bg-[#16325c] transition"
                        onClick={(e) => {
                            e.preventDefault();
                            window.location.href = "/login";
                        }}
                    >
                        Sign Up
                    </button>
                </form>
                <p className="text-xs text-gray-500 mt-4 text-center">
                    By signing up, you agree to our <span className="font-semibold">Terms of Service</span> and <span className="font-semibold">Privacy Policy</span>.
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
