import React, { useState } from 'react';
import { EyeOff, Eye } from 'lucide-react';
import {Link} from "react-router-dom";
import PlanetariumLogo from "../assets/PlanetariumLogo.png";

const LoginPage: React.FC = () => {
    const [formData, setFormData] = useState({
        usernameOrEmail: '',
        password: ''
    });

    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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

    const handleLogin = () => {
        console.log('Login submitted:', formData, 'Remember me:', rememberMe);
    };

    const handleGoogleLogin = () => {
        console.log('Google login clicked');
    };

    return (
        <div className="min-h-screen bg-[#0A1128] flex items-center justify-center p-4">
            <div className="bg-slate-100 rounded-3xl p-5 w-full max-w-md shadow-2xl">
                {/* Logo */}
                <div className="flex justify-start">
                    <div className="w-16 h-16">
                        <Link to="/">
                            <img
                                src= {PlanetariumLogo}
                                alt="Planetarium logo"
                                className="w-full h-full object-cover" />
                        </Link>
                    </div>
                </div>

                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-slate-900">
                        Welcome Back!
                    </h1>
                    <p className="text-slate-600 text-sm">
                        Log in to continue your cosmic journey.
                    </p>
                </div>

                {/* Login Form */}
                <div className="space-y-4 mb-4">
                    {/* Username or Email Input */}
                    <div>
                        <label className="block text-slate-700 text-sm font-medium mb-2">
                            Username or Email
                        </label>
                        <input
                            type="text"
                            name="usernameOrEmail"
                            value={formData.usernameOrEmail}
                            onChange={handleChange}
                            onFocus={() => handleFocus('usernameOrEmail')}
                            onBlur={() => handleBlur('usernameOrEmail')}
                            placeholder={showPlaceholder('usernameOrEmail') ? 'example@gmail.com' : ''}
                            className="w-full px-4 py-3 bg-[#B8DAE3] border-2 border-[#2A8FAB] rounded-full text-slate-800 placeholder-slate-500 focus:outline-none focus:border-[#2A8FAB] transition-colors"
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block text-slate-700 text-sm font-medium mb-2">
                            Password
                        </label>
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

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 rounded border-2 border-teal-600 text-teal-600 focus:ring-teal-500"
                            />
                            <span className="text-slate-700">Remember me</span>
                        </label>
                        <Link to="/forgot-password" className="text-slate-700 hover:text-teal-700 transition-colors">
                            Forgot password?
                        </Link>
                    </div>

                    {/* Login Button */}
                    <button
                        onClick={handleLogin}
                        className="w-full py-3 bg-[#1C5386] hover:bg-[#2D6192] text-white font-semibold rounded-full transition-colors text-lg mt-2"
                    >
                        Login
                    </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 border-t-2 border-dotted border-slate-400"></div>
                    <span className="text-slate-500 text-sm">or login with</span>
                    <div className="flex-1 border-t-2 border-dotted border-slate-400"></div>
                </div>

                {/* Google Login Button */}
                <div className="flex justify-center mb-4">
                    <button
                        onClick={handleGoogleLogin}
                        className="w-12 h-12 bg-white hover:bg-slate-50 rounded-full flex items-center justify-center shadow-md transition-colors border border-slate-300"
                        aria-label="Login with Google"
                    >
                        <svg viewBox="0 0 24 24" className="w-6 h-6">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                    </button>
                </div>

                {/* Footer */}
                <div className="text-center">
                    <p className="text-slate-600 text-sm">
                        Don't have an account?{' '}
                        <Link to="/sign-up" className="text-slate-700 hover:text-teal-700 font-semibold transition-colors">
                            Create account.
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;