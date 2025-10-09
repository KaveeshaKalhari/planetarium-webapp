import React, { useState } from "react";
import {Link} from "react-router-dom";
import PlanetariumLogo from "../assets/PlanetariumLogo.png";

const ForgotPasswordPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#A3BBC6]">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        {/* Logo */}
        <div className="mb-6 flex justify-start">
            <Link to="/">
                <img
                    src={PlanetariumLogo}
                    alt="Sri Lanka Planetarium Logo"
                    className="h-14 w-auto object-contain"
                />
            </Link>
        </div>
        {/* Back to login */}
        <div className="mb-2">
          <a href="/login" className="text-sm text-black hover:underline">
            &lt; Back to login
          </a>
        </div>
        {/* Title */}
        <h2 className="text-2xl font-bold text-[#0082A1] mb-6">
          Forgot Your Password?
        </h2>
        {/* Email */}
        <label className="block text-gray-700 mb-1">E-mail</label>
        <input
          type="email"
          className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#0082A1]"
          placeholder=""
        />
        {/* Send OTP Button */}
        <button className="w-full bg-[#00698C] text-white py-2 rounded mb-4 font-medium hover:bg-[#005a78] transition">
          Send OTP
        </button>
        {/* New Password */}
        <label className="block text-gray-700 mb-1">New Password</label>
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#0082A1]"
            placeholder=""
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={-1}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-9 0a9 9 0 0118 0 9 9 0 01-18 0z"
              />
            </svg>
          </button>
        </div>
        {/* Confirm Password */}
        <label className="block text-gray-700 mb-1">Confirm Password</label>
        <div className="relative mb-6">
          <input
            type={showConfirm ? "text" : "password"}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#0082A1]"
            placeholder=""
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            onClick={() => setShowConfirm((v) => !v)}
            tabIndex={-1}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-9 0a9 9 0 0118 0 9 9 0 01-18 0z"
              />
            </svg>
          </button>
        </div>
        {/* Update Password Button */}
        <button className="w-full bg-[#00698C] text-white py-2 rounded font-medium hover:bg-[#005a78] transition">
          Update Password
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;