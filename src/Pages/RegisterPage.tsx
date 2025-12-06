import React, { useState } from 'react';
import {User, Mail, Lock, Eye, EyeOff} from 'lucide-react';
import PlanetariumLogo from "../assets/PlanetariumLogo.png";
import {Link} from "react-router-dom";

const SignUpPage: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const [focused, setFocused] = useState({
        username: false,
        email: false,
        password: false
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSignUp = () => {
        console.log('Sign up submitted:', formData);
    };

    const handleGoogleSignUp = () => {
        console.log('Google sign up clicked');
    };

    const handleFocus = (field: 'username' | 'email' | 'password') => {
        setFocused({
            ...focused,
            [field]: true
        });
    };

    const handleBlur = (field: 'username' | 'email' | 'password') => {
        setFocused({
            ...focused,
            [field]: false
        });
    };

    const showPlaceholder = (field: 'username' | 'email' | 'password') => {
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
                                src= {PlanetariumLogo}
                                alt="Planetarium logo"
                                className="w-full h-full object-cover" />
                        </Link>
                    </div>
                </div>

                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-slate-900">
                        Create Your Account
                    </h1>
                    <p className="text-slate-600 text-sm">
                        Join our community of space enthusiasts!
                    </p>
                </div>

                {/* Sign Up Form */}
                <div className="space-y-4 mb-6">
                    {/* Username Input */}
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#343A40]">
                            <User size={20} />
                        </div>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            onFocus={() => handleFocus('username')}
                            onBlur={() => handleBlur('username')}
                            placeholder={showPlaceholder('username') ? 'Username' : ''}
                            className="w-full pl-12 pr-4 py-3 bg-[#B8DAE3] border-2 border-[#2A8FAB] rounded-full text-[#343A40] placeholder-[#343A40] focus:outline-none focus:border-[#2A8FAB] transition-colors"/>
                    </div>

                    {/* Email Input */}
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#343A40]">
                            <Mail size={20} />
                        </div>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder={showPlaceholder('email') ? 'Email' : ''}
                            onFocus={() => handleFocus('email')}
                            onBlur={() => handleBlur('email')}
                            className="w-full pl-12 pr-4 py-3 bg-[#B8DAE3] border-2 border-[#2A8FAB] rounded-full text-[#343A40] placeholder-[#343A40] focus:outline-none focus:border-teal-700 transition-colors"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#343A40]">
                            <Lock size={20} />
                        </div>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder={showPlaceholder('password') ? 'Password' : ''}
                            onFocus={() => handleFocus('password')}
                            onBlur={() => handleBlur('password')}
                            className="w-full pl-12 pr-12 py-3 bg-[#B8DAE3] border-2 border-[#2A8FAB] rounded-full text-slate-800 placeholder-[#343A40] focus:outline-none focus:border-teal-700 transition-colors"
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

                    {/* Sign Up Button */}
                    <button
                        onClick={handleSignUp}
                        className="w-full py-3 bg-[#1C5386] hover:bg-[#2D6192] text-white font-semibold rounded-full transition-colors text-lg"
                    >
                        Sign Up
                    </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 border-t-2 border-dotted border-slate-400"></div>
                    <span className="text-slate-500 text-sm">or sign up with</span>
                    <div className="flex-1 border-t-2 border-dotted border-slate-400"></div>
                </div>

                {/* Google Sign Up Button */}
                <div className="flex justify-center mb-4">
                    <button
                        onClick={handleGoogleSignUp}
                        className="w-12 h-12 bg-white hover:bg-slate-50 rounded-full flex items-center justify-center shadow-md transition-colors border border-slate-300"
                        aria-label="Sign up with Google"
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
                        Already have an account?{' '}
                        <Link to="/login" className="text-teal-700 hover:text-teal-800 font-semibold transition-colors">
                            login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;