import { useState } from "react";
import { NavLink } from "react-router-dom";
import api from "../api/axios";
import { Bell } from "lucide-react";

function ProviderNavbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const navItemClass = ({ isActive }) =>
        `relative text-sm font-medium transition-all duration-300 px-4 py-2 rounded-lg hover:text-white ${isActive
            ? "text-white bg-gray-900 shadow-sm shadow-white/5"
            : "text-gray-400 hover:bg-gray-900/50"
        }`;

    const fetchUnreadCount = async () => {
        try {
            const response = await api.get("/notifications/unread-count/");
            setUnreadCount(response.data.unread_count);
        } catch (error) {
            console.log("Failed to fetch unread notifications count:", error);
        }
    };

    fetchUnreadCount();

    return (
        <div className="w-full px-4 sm:px-6 py-4 bg-white">
            <nav className="mx-auto max-w-7xl bg-black text-white rounded-4xl border border-gray-900 px-10 py-4">
                <div className="flex items-center justify-between">

                    {/* Logo */}
                    <div className="text-2xl font-black tracking-tight text-white">
                        <h2>Nimble</h2>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-2">
                        <NavLink
                            to="/provider/dashboard"
                            className={navItemClass}
                        >
                            Dashboard
                        </NavLink>

                        <NavLink
                            to="/provider/requests"
                            className={navItemClass}
                        >
                            Requests
                        </NavLink>

                        <NavLink
                            to="/provider/analytics"
                            className={navItemClass}
                        >
                            Analytics
                        </NavLink>

                        <NavLink
                            to="/provider/profile"
                            className={navItemClass}
                        >
                            Profile
                        </NavLink>
                        <NavLink
                            to="/notifications"
                            className={navItemClass}
                        >  
                        <div className="relative flex items-center justify-center">
                            <Bell className="w-5 h-5  text-gray-400" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-mono font-bold text-white tracking-tighter">
                                    {unreadCount}
                                </span>
                            )}
                        </div>
                        </NavLink>
                    </div>

                    {/* Mobile Toggle */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-400 hover:text-white p-1"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {isOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`md:hidden transition-all duration-300 overflow-hidden ${isOpen
                            ? "max-h-60 opacity-100 mt-4 pt-4 border-t border-gray-900"
                            : "max-h-0 opacity-0"
                        }`}
                >
                    <div className="flex flex-col space-y-2 pb-2">
                        <NavLink
                            to="/provider/dashboard"
                            className={navItemClass}
                            onClick={() => setIsOpen(false)}
                        >
                            Dashboard
                        </NavLink>

                        <NavLink
                            to="/provider/requests"
                            className={navItemClass}
                            onClick={() => setIsOpen(false)}
                        >
                            Requests
                        </NavLink>

                        <NavLink
                            to="/provider/analytics"
                            className={navItemClass}
                            onClick={() => setIsOpen(false)}
                        >
                            Analytics
                        </NavLink>

                        <NavLink
                            to="/provider/profile"
                            className={navItemClass}
                            onClick={() => setIsOpen(false)}
                        >
                            Profile
                        </NavLink>
                        <NavLink
                            to="/notifications"
                            // 1. Wrapped all positioning utilities cleanly inside the template string or template variable
                            className={`${navItemClass} relative flex flex-row items-center justify-between w-full`}
                            onClick={() => setIsOpen(false)}
                        >
                            {/* Text Label element */}
                            <span>Notifications</span>

                            {/* 2. Isolated Wrapper Container to anchor the relative badge position strictly onto the Bell */}
                            <div className="relative flex items-center justify-center">
                                <Bell className="w-5 h-5 text-gray-700" />

                                {/* 3. Balanced Badge Element Layer */}
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[9px] font-mono font-bold text-white tracking-tighter">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                        </NavLink>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default ProviderNavbar;