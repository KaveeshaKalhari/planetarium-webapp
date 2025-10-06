import React from "react";
import { Link, useLocation } from "react-router-dom";
import PlanetariumLogo from "../Assets/PlanetariumLogo.png";

const Navbar: React.FC = () => {
    const location = useLocation();

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Events", path: "/events" },
        { name: "Blogs", path: "/blog" },
        { name: "About Us", path: "/about-us" },
        { name: "Contact Us", path: "/contact-us" },
    ];

    return (
        <nav className="flex items-center justify-between px-8 w-full absolute top-0 left-0 z-10 bg-transparent">
            {/* Logo */}
            <div>
                <Link to="/">
                    <img
                        src={PlanetariumLogo}
                        alt="Sri Lanka Planetarium Logo"
                        className="h-14 w-auto object-contain"
                    />
                </Link>
            </div>

            {/* Links */}
            <div className="flex-1 flex justify-center">
                <ul className="hidden md:flex space-x-8 text-sm font-semibold">
                    {navLinks.map((link) => (
                        <li key={link.name} className="relative">
                            <Link
                                to={link.path}
                                className={`${
                                    location.pathname === link.path
                                        ? "text-[#219EBC]"
                                        : "text-white hover:text-[#219EBC]"
                                } transition`}
                            >
                                {link.name}
                            </Link>
                            {location.pathname === link.path && (
                                <div className="absolute left-1/2 -bottom-1 w-8 h-0.5 bg-[#219EBC] -translate-x-1/2 rounded"></div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Auth Buttons */}
            <div className="space-x-2">
                <Link
                    to="/login"
                    className="px-4 py-1 bg-[#219EBC] rounded text-white text-sm font-semibold hover:bg-[#126782] transition"
                >
                    Login
                </Link>
                <Link
                    to="/sign-up"
                    className="px-4 py-1 bg-[#219EBC] rounded text-white text-sm font-semibold hover:bg-[#126782] transition"
                >
                    Sign Up
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;