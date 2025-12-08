import React, { useState } from 'react';
import { EyeOff, Eye, CheckCircle, XCircle } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import PlanetariumLogo from "../assets/PlanetariumLogo.png";
import { login, googleAuth } from "../services/api";
import {type CredentialResponse, GoogleLogin} from "@react-oauth/google";

const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        usernameOrEmail: '',
        password: ''
    });

    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    const [focused, setFocused] = useState({
        usernameOrEmail: false,
        password: false
    });

    // Validation states
    const [errors, setErrors] = useState({
        usernameOrEmail: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Clear error for this field
        setErrors({
            ...errors,
            [name]: ''
        });
        setError('');
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

    const validateForm = (): boolean => {
        const newErrors = {
            usernameOrEmail: '',
            password: ''
        };

        if (!formData.usernameOrEmail.trim()) {
            newErrors.usernameOrEmail = 'Username or email is required';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return !newErrors.usernameOrEmail && !newErrors.password;
    };

    const handleLogin = async () => {
        // Clear previous messages
        setError('');
        setSuccess('');

        // Validate form
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await login(formData);

            if (response.success) {
                setSuccess('Login successful! Redirecting...');

                // Store user data if remember me is checked
                if (rememberMe && response.user) {
                    localStorage.setItem('user', JSON.stringify(response.user));
                }

                // Redirect to home/dashboard after 1 second
                setTimeout(() => {
                    navigate('/'); // Change to your dashboard route
                }, 1000);
            } else {
                setError(response.message || 'Login failed. Please try again.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            console.error('Login error:', err);
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

                setSuccess('Google login successful! Redirecting...');

                setTimeout(() => {
                    navigate('/');
                }, 1000);
            } else {
                setError(response.message || 'Google authentication failed');
            }
        } catch (err) {
            setError('An unexpected error occurred with Google login.');
            console.error('Google login error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleError = () => {
        setError('Google login failed. Please try again.');
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
                        Welcome Back!
                    </h1>
                    <p className="text-slate-600 text-sm">
                        Log in to continue your cosmic journey.
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
                            className={`w-full px-4 py-3 bg-[#B8DAE3] border-2 ${
                                errors.usernameOrEmail ? 'border-red-500' : 'border-[#2A8FAB]'
                            } rounded-full text-slate-800 placeholder-slate-500 focus:outline-none focus:border-[#2A8FAB] transition-colors`}
                            disabled={loading}
                        />
                        {errors.usernameOrEmail && (
                            <p className="text-red-500 text-xs mt-1 ml-4">{errors.usernameOrEmail}</p>
                        )}
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
                                className={`w-full px-4 py-3 bg-[#B8DAE3] border-2 ${
                                    errors.password ? 'border-red-500' : 'border-[#2A8FAB]'
                                } rounded-full text-slate-800 placeholder-slate-500 focus:outline-none focus:border-[#2A8FAB] transition-colors`}
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

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 rounded border-2 border-teal-600 text-teal-600 focus:ring-teal-500"
                                disabled={loading}
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
                        disabled={loading}
                        className={`w-full py-3 bg-[#1C5386] hover:bg-[#2D6192] text-white font-semibold rounded-full transition-colors text-lg mt-2 ${
                            loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {loading ? 'Logging in...' : 'Login'}
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