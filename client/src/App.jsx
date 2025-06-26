import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home, SignUp, Login } from "@/pages";
import { AuthLayout, DashboardLayout } from "@/components";

function App() {
    return (
        <Router>
            <Routes>
                {/* Auth routes use the AuthLayout */}
                <Route element={<AuthLayout />}>
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<Login />} />
                </Route>

                {/* Dashboard routes use the DashboardLayout */}
                <Route element={<DashboardLayout />}>
                    <Route path="/home" element={<Home />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
