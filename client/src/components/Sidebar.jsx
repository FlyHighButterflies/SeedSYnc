import {
    Home,
    User,
    List,
    MessageCircle,
    Backpack,
    LogOut,
    ArrowLeftFromLine,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const SidebarLink = ({ icon, text, to, onClick }) => (
    <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) =>
            `flex items-center p-2 px-3 text-lg rounded-lg transition-colors duration-200 ${
                isActive
                    ? "bg-gray-700 text-white"
                    : "hover:bg-gray-700 hover:text-white"
            }`
        }
    >
        {icon}
        <span className="ml-4">{text}</span>
    </NavLink>
);

function Sidebar({ isOpen, onClose }) {
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        onClose();
    };

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/60 z-30 ${
                    isOpen ? "block" : "hidden"
                }`}
                onClick={onClose}
            ></div>

            <div
                className={`fixed top-0 left-0 h-full w-64 bg-[#F5F5F5] p-4 z-40
                flex flex-col
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="flex justify-between items-center mb-10 p-4">
                    <div className="text-2xl font-bold">Dashboard</div>
                    <button onClick={onClose} className="p-1">
                        <ArrowLeftFromLine size={24} />
                    </button>
                </div>
                <nav className="flex flex-col gap-2">
                    <SidebarLink
                        icon={<Home />}
                        text="Home"
                        to="/home"
                        onClick={onClose}
                    />
                    <SidebarLink
                        icon={<User />}
                        text="Profile"
                        to="/profile"
                        onClick={onClose}
                    />
                    <SidebarLink
                        icon={<List />}
                        text="Listings"
                        to="/listings"
                        onClick={onClose}
                    />
                    <SidebarLink
                        icon={<MessageCircle />}
                        text="Messages"
                        to="/messages"
                        onClick={onClose}
                    />
                    <SidebarLink
                        icon={<Backpack />}
                        text="Inventory"
                        to="/inventory"
                        onClick={onClose}
                    />
                </nav>
                <div className="mt-auto">
                    <button
                        onClick={handleLogout}
                        className="flex items-center p-2 px-3 text-lg rounded-lg transition-colors duration-200 hover:bg-gray-700 hover:text-white w-full text-left"
                    >
                        <LogOut />
                        <span className="ml-4">Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
}

export default Sidebar;
