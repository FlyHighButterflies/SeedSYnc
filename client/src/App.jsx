import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home, SignUp, Login } from "@/pages";
import { Footer } from "@/components";

function App() {
    return (
        <Router>
            {/* Use w-full to prevent horizontal overflow */}
            <div className="flex flex-col h-screen w-full">
                {/* This wrapper will grow and handle scrolling */}
                <div className="flex-1 overflow-y-auto">
                    <Routes>
                        <Route path="/home" element={<Home />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/login" element={<Login />} />
                    </Routes>
                </div>
                {/* The footer is outside the scrollable area and will not shrink */}
                <Footer />
            </div>
        </Router>
    );
}

export default App;
