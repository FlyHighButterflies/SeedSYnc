import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

function Onboarding() {
    return (
            <div className="flex flex-col min-h-screen h-screen w-full" style={{ backgroundColor: "#e6f3ec" }}>
            {/* Hero Section */}
            <div className="flex flex-col lg:flex-row items-center justify-between w-full px-6 py-12 lg:py-0 lg:h-[90vh]">
                {/* Left: Logo and Text */}
                <div className="flex flex-col gap-6 max-w-xl w-full">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-2">
    <div className="w-20 h-20 flex items-center justify-center">
        <img
            src="/images/seedsync-logo.png"
            alt="SeedSync Logo"
            className="w-16 h-16 object-contain"
        />
    </div>
    <span className="text-4xl font-semibold text-gray-800">SeedSync</span>
</div>
                    {/* Heading */}
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                        Where Farming Meets the Future
                    </h1>
                    {/* Intro Box */}
                    <div className="bg-[#A7F3D0] rounded-xl p-5 text-gray-900 font-medium text-base shadow mb-2 text-justify leading-relaxed w-80 h-80 flex items-center justify-center">
                    <p>
                    Welcome to SeedSync, the smart digital platform revolutionizing the way farmers and buyers connect. At its core, SeedSync is more than just a marketplace – it’s a movement toward smarter, fairer, and more transparent agricultural trade.
                    </p>
                    </div>
                    {/* Feature Bubbles */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-2">
                    <span className="rounded-full border-2 border-green-700 text-green-700 bg-white px-6 py-2 text-lg font-semibold shadow">
                    Intelligent matchmaking
                    </span>
                    <span className="rounded-full border-2 border-green-700 text-green-700 bg-white px-6 py-2 text-lg font-semibold shadow">
                    Sustainability is built in
                    </span>
                    </div>

                    {/* Arrow Button */}
                    <div className="mt-8">
                        <Link to="/signup">
                            <button className="w-16 h-16 rounded-full bg-green-700 flex items-center justify-center shadow-lg hover:bg-green-800 transition">
                                <ChevronRight className="text-white w-8 h-8" />
                            </button>
                        </Link>
                    </div>
                </div>
                {/* Right: Illustration */}
                <div className="md:flex justify-center items-center hidden bg-lighterGreen w-2/5 flex-shrink-0">
                    <img
                        src="/images/auth-farmer.png"
                        alt="farmer png"
                        className="w-auto h-5/6"
                    />
                </div>
            </div>
            {/* Footer */}
            <footer className="w-full bg-green-700 text-white flex flex-col sm:flex-row items-center justify-between px-6 py-3 mt-auto">
            </footer>
        </div>
    );
}

export default Onboarding;