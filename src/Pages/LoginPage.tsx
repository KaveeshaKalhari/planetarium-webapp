import React, { useState } from "react";
import {Link} from "react-router-dom";

const LoginPage: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#070c23]">
            <div className="bg-white rounded-2xl shadow-lg px-8 py-6 w-[350px] flex flex-col">
                <h2 className="text-center font-bold text-xl mb-1">Welcome Back!</h2>
                <p className="text-center text-gray-700 text-sm mb-4">
                    Log in to continue your cosmic journey.
                </p>
                <div className="mb-3">
                    <label className="text-sm font-medium mb-1 block">Username or Email</label>
                    <input
                        type="email"
                        placeholder="example@gmail.com"
                        className="w-full px-3 py-2 rounded-md border border-blue-200 bg-blue-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                </div>
                <div className="mb-2">
                    <label className="text-sm font-medium mb-1 block">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="w-full px-3 py-2 rounded-md border border-blue-200 bg-blue-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                        <button
                            type="button"
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-lg"
                            onClick={() => setShowPassword((v) => !v)}
                            tabIndex={-1}
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </button>
                    </div>
                </div>
                <Link
                    to="/forgot-password"
                    className="text-right text-xs text-gray-500 mb-4 underline cursor-pointer block"
                >
                    Forgot Password?
                </Link>
                <Link
                    to="/user-profile"
                    className="bg-[#2176ae] text-white font-semibold rounded-md py-2 mb-3 text-sm hover:bg-blue-700 transition flex items-center justify-center"
                >
                    Login
                </Link>
                <div className="text-center text-sm text-gray-700">
                    Don&apos;t have an account?
                    <Link to="/sign-up" className="font-semibold text-[#2176ae] underline cursor-pointer ml-1">
                      Create account.
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
