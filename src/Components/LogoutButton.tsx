import { LogOut } from "lucide-react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

interface LogoutButtonProps {
    className?: string;
}

export default function LogoutButton({ className = "" }: LogoutButtonProps) {
    const navigate = useNavigate();

    const handleLogout = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out from your account.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, Log out",
        }).then((result) => {
            if (result.isConfirmed) {
                // remove token or user data
                localStorage.removeItem("accessToken");

                // redirect to landing page
                navigate("/");

                Swal.fire({
                    title: "Logged out",
                    text: "You have been successfully logged out.",
                    icon: "success",
                    timer: 1200,
                    showConfirmButton: false,
                });
            }
        });
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
