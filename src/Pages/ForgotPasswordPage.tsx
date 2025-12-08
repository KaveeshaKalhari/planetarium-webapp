import React, { useState } from "react";
import { Link } from "react-router-dom";
import PlanetariumLogo from "../assets/PlanetariumLogo.png";
import {Eye, EyeOff} from "lucide-react";

const ForgotPasswordPage: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        usernameOrEmail: '',
        password: ''
    });

    const [focused, setFocused] = useState({
        usernameOrEmail: false,
        password: false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFocus = (field: 'usernameOrEmail' | 'password') => {
        setFocused({
            ...focused,
            [field]: true
        });
    };

    const handleBlur = (field: 'usernameOrEmail' | 'password') => {
        setFocused({
            ...focused,
            [field]: false
        });
    };

    const showPlaceholder = (field: 'usernameOrEmail' | 'password') => {
        return !focused[field] && !formData[field];
    };

    return (
        <div className="min-h-screen bg-[#0A1128] flex items-center justify-center p-4">
            <div className="bg-slate-100 rounded-3xl p-5 w-full max-w-md shadow-2xl">
                {/* Logo */}
                <div className="flex justify-start">
                    <div className="w-16 h-16">
                        <Link to="/">
                            <img
                                src={PlanetariumLogo}
                                alt="Sri Lanka Planetarium Logo"
                                className="w-full h-full object-cover"
                            />
                        </Link>
                    </div>
                </div>

                {/* Back to login */}
                <div className="mb-2">
                    <a href="/login" className="text-sm text-black hover:underline">
                        &lt; Back to login
                    </a>
                </div>
                {/* Title */}
                <h1 className="text-3xl font-bold text-slate-900">
                    Forgot Your Password?
                </h1>

                <div className="space-y-4 mt-3 mb-4">
                    <div>
                        {/* Email */}
                        <label className="block text-gray-700 mb-1">E-mail</label>
                        <input
                            type="text"
                            name="Email"
                            value={formData.usernameOrEmail}
                            onChange={handleChange}
                            onFocus={() => handleFocus('usernameOrEmail')}
                            onBlur={() => handleBlur('usernameOrEmail')}
                            placeholder={showPlaceholder('usernameOrEmail') ? 'example@gmail.com' : ''}
                            className="w-full px-4 py-3 bg-[#B8DAE3] border-2 border-[#2A8FAB] rounded-full text-slate-800 placeholder-slate-500 focus:outline-none focus:border-[#2A8FAB] transition-colors"
                        />
                        {/* Send OTP Button */}
                        <button
                            type="button"
                            className="w-full py-3 bg-[#1C5386] hover:bg-[#2D6192] text-white font-semibold rounded transition-colors text-lg mt-3 mb-3">
                            Send OTP
                        </button>

                        {/* New Password */}
                        <label className="block text-gray-700 mb-1 mt-3">New Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                onFocus={() => handleFocus('password')}
                                onBlur={() => handleBlur('password')}
                                placeholder={showPlaceholder('password') ? '••••••••' : ''}
                                className="w-full px-4 py-3 bg-[#B8DAE3] border-2 border-[#2A8FAB] rounded-full text-slate-800 placeholder-slate-500 focus:outline-none focus:border-[#2A8FAB] transition-colors"
                            />
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowPassword(!showPassword);
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-800 cursor-pointer z-10"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                            </button>

                        </div>
                        {/* Confirm Password */}
                        <label className="block text-gray-700 mb-1 mt-3">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                onFocus={() => handleFocus('password')}
                                onBlur={() => handleBlur('password')}
                                placeholder={showPlaceholder('password') ? '••••••••' : ''}
                                className="w-full px-4 py-3 bg-[#B8DAE3] border-2 border-[#2A8FAB] rounded-full text-slate-800 placeholder-slate-500 focus:outline-none focus:border-[#2A8FAB] transition-colors"
                            />
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowPassword(!showPassword);
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-800 cursor-pointer z-10"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                            </button>
                        </div>

                    </div>
                    {/* Update Password Button */}
                    <button
                        type="button"
                        className="w-full py-3 bg-[#1C5386] hover:bg-[#2D6192] text-white font-semibold rounded transition-colors text-lg">
                        Update Password
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;