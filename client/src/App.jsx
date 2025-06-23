import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home.jsx";
import SignUp from "@/pages/auth/SignUp";
import Footer from "@/components/Footer";
import Login from "@/pages/auth/Login";

function App() {
    return (
        <Router>
            <div className="flex flex-col h-screen w-screen">
                <Routes>
                    {/* <Route path="/" element={<Home />} /> */}
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
