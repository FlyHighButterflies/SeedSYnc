import { Footer } from "@/components";

function AuthLayout({ children }) {
    console.log("From auth layout");
    return (
        <div className="flex flex-col h-screen w-full">
            <div className="flex-1 overflow-y-auto">{children}</div>
            <Footer />
        </div>
    );
}

export default AuthLayout;
