import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LogoutButtonProps {
    className?: string;
}

export default function LogoutButton({ className = "" }: LogoutButtonProps) {
    const navigate = useNavigate();

    const handleLogout = () => {
        if (confirm("Are you sure? You will be logged out from your account.")) {
            // remove token or user data
            localStorage.removeItem("accessToken");

            // redirect to landing page
            navigate("/");

            alert("You have been successfully logged out.");
        }
    };

    return (
        <button
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-[#D02224] text-white hover:bg-red-600 font-medium ${className}`}
        >
            <LogOut size={18} />
            <span className="text-sm">Log out</span>
        </button>
    );
}
