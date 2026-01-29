import React from "react";
import { Link, useLocation } from "react-router-dom";
import PlanetariumLogo from "../assets/PlanetariumLogo.png";
import { User } from "lucide-react";
import { useState } from "react";
import {ProfileDropdown} from "./ProfileDropdown.tsx";

const Navbar: React.FC = () => {
    const location = useLocation();

    const navLinks = [
        { name: "Home", path: "/user-home-page" },
        { name: "Events", path: "/user-events" },
        { name: "Blogs", path: "/user-blog" },
        { name: "About Us", path: "/user-about-us" },
        { name: "Contact Us", path: "/user-contact-us" },
    ];

    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <>
        <nav className="flex items-center justify-between w-full absolute top-0 left-0 z-10 bg-transparent">
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
                <ul className="hidden md:flex space-x-8 font-semibold">
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

            {/* Profile Icon */}
            <div className="pr-6">
                <button
                    onClick={() => setIsProfileOpen(true)}
                    className="w-10 h-10 bg-[#1282A2] hover:bg-[#034078] rounded-full flex items-center justify-center transition-colors"
                    title="Profile"
                >
                    <User className="w-5 h-5" />
                </button>
            </div>
        </nav>

    {/* Profile Dropdown */}
    <ProfileDropdown isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
</>
);
};

export default Navbar;