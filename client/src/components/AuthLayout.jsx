import { Outlet } from "react-router-dom";
import { Footer } from "@/components";

function AuthLayout() {
    return (
        <div className="flex flex-col h-screen w-full">
            <div className="flex-1 overflow-y-auto">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}

export default AuthLayout;
