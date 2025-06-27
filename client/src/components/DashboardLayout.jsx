import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Footer, Input, Sidebar } from "@/components";
import { Menu, Search } from "lucide-react";

function DashboardLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div>
            <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

            <div className="flex flex-col h-screen">
                <header className="flex items-center justify-between bg-lighterGreen shadow-md h-16 px-4 md:px-6">
                    <div className="flex items-center gap-2 md:gap-3">
                        <button
                            onClick={toggleSidebar}
                            className="p-2 rounded-md hover:bg-gray-200"
                        >
                            <Menu size={24} color="#56B280" />
                        </button>
                        <img
                            src="/images/seedsync-logo.png"
                            alt="seedsync logo"
                            className="w-auto h-8 md:h-10 hidden sm:block"
                        />
                        <div className="text-lg md:text-2xl font-bold text-darkGreen">
                            SeedSync
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 rounded-md hover:bg-gray-200 sm:hidden">
                            <Search size={20} color="#56B280" />
                        </button>
                        <div className="flex-1 max-w-xs md:max-w-sm lg:w-80 lg:flex-none relative hidden sm:block">
                            <Input
                                type="text"
                                placeholder="Search"
                                className="rounded-2xl pl-10 pr-4 w-full"
                            />
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                size={20}
                            />
                        </div>
                    </div>
                </header>

                <div className="flex-1 flex flex-col overflow-hidden">
                    <main className="flex-1 overflow-y-auto no-scrollbar-arrows">
                        <Outlet />
                    </main>
                    <Footer />
                </div>
            </div>
        </div>
    );
}

export default DashboardLayout;
