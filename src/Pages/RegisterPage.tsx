import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import PlanetariumLogo from "../assets/PlanetariumLogo.png";
import { Link, useNavigate } from "react-router-dom";
import { signUp, googleAuth } from '../services/api';
import {type CredentialResponse, GoogleLogin} from "@react-oauth/google";

const SignUpPage: React.FC = () => {
    const navigate = useNavigate();

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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    // Validation states
    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        // Clear error for this field
        setErrors({
            ...errors,
            [e.target.name]: ''
        });
        setError('');
    };

    const validateForm = (): boolean => {
        const newErrors = {
            username: '',
            email: '',
            password: ''
        };

        // Username validation
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        } else if (formData.username.length > 50) {
            newErrors.username = 'Username must be less than 50 characters';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        setErrors(newErrors);
        return !newErrors.username && !newErrors.email && !newErrors.password;
    };

    const handleSignUp = async () => {
        // Clear previous messages
        setError('');
        setSuccess('');

        // Validate form
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await signUp(formData);

            if (response.success) {
                //Store the token in localStorage
                if (response.token) {
                    localStorage.setItem('authToken', response.token);
                }

                if (response.user) {
                    localStorage.setItem('user', JSON.stringify(response.user));
                }

                setSuccess('Account created successfully! Redirecting to login...');
                setFormData({ username: '', email: '', password: '' });

                // Redirect to login page after 2 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 2000);

            } else {
                setError(response.message || 'Registration failed. Please try again.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            console.error('Sign up error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            if (!credentialResponse.credential) {
                setError('Google authentication failed');
                return;
            }

            const response = await googleAuth(credentialResponse.credential);

            if (response.success) {
                // Store token and user data
                if (response.token) {
                    localStorage.setItem('authToken', response.token);
                }

                if (response.user) {
                    localStorage.setItem('user', JSON.stringify(response.user));
                }

                setSuccess('Google sign up successful! Redirecting...');

                setTimeout(() => {
                    navigate('/');
                }, 1000);
            } else {
                setError(response.message || 'Google authentication failed');
            }
        } catch (err) {
            setError('An unexpected error occurred with Google sign up.');
            console.error('Google sign up error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleError = () => {
        setError('Google sign up failed. Please try again.');
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
                                src={PlanetariumLogo}
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

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
                        <XCircle size={20} />
                        <span className="text-sm">{error}</span>
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2">
                        <CheckCircle size={20} />
                        <span className="text-sm">{success}</span>
                    </div>
                )}

                {/* Sign Up Form */}
                <div className="space-y-4 mb-6">
                    {/* Username Input */}
                    <div>
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
                                className={`w-full pl-12 pr-4 py-3 bg-[#B8DAE3] border-2 ${
                                    errors.username ? 'border-red-500' : 'border-[#2A8FAB]'
                                } rounded-full text-[#343A40] placeholder-[#343A40] focus:outline-none focus:border-[#2A8FAB] transition-colors`}
                                disabled={loading}
                            />
                        </div>
                        {errors.username && (
                            <p className="text-red-500 text-xs mt-1 ml-4">{errors.username}</p>
                        )}
                    </div>

                    {/* Email Input */}
                    <div>
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
                                className={`w-full pl-12 pr-4 py-3 bg-[#B8DAE3] border-2 ${
                                    errors.email ? 'border-red-500' : 'border-[#2A8FAB]'
                                } rounded-full text-[#343A40] placeholder-[#343A40] focus:outline-none focus:border-teal-700 transition-colors`}
                                disabled={loading}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1 ml-4">{errors.email}</p>
                        )}
                    </div>

                    {/* Password Input */}
                    <div>
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
                                className={`w-full pl-12 pr-12 py-3 bg-[#B8DAE3] border-2 ${
                                    errors.password ? 'border-red-500' : 'border-[#2A8FAB]'
                                } rounded-full text-slate-800 placeholder-[#343A40] focus:outline-none focus:border-teal-700 transition-colors`}
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowPassword(!showPassword);
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-800 cursor-pointer z-10"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                disabled={loading}
                            >
                                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1 ml-4">{errors.password}</p>
                        )}
                    </div>

                    {/* Sign Up Button */}
                    <button
                        onClick={handleSignUp}
                        disabled={loading}
                        className={`w-full py-3 bg-[#1C5386] hover:bg-[#2D6192] text-white font-semibold rounded-full transition-colors text-lg ${
                            loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
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
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        useOneTap
                        theme="outline"
                        size="large"
                        shape="circle"
                    />
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