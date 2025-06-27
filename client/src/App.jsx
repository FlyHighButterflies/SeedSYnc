import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import {
    Home,
    SignUp,
    Login,
    Listings,
    Inventory,
    Profile,
    OnboardingPage1,
    OnboardingPage2,
    Messages,
} from "@/pages";
import {
    AuthLayout,
    DashboardLayout,
    ProtectedRoute,
    PublicRoute,
} from "@/components";
import { AuthProvider } from "@/contexts/AuthContext";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route
                        element={
                            <PublicRoute>
                                <AuthLayout />
                            </PublicRoute>
                        }
                    >
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/login" element={<Login />} />
                        {/* <Route
                            path="/Onboarding2"
                            element={<OnboardingPage2 />}
                        /> */}
                    </Route>

                    <Route
                        element={
                            <ProtectedRoute>
                                <DashboardLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="/home" element={<Home />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/listings" element={<Listings />} />
                        <Route path="/inventory" element={<Inventory />} />
                        <Route path="/messages" element={<Messages />} />
                    </Route>

                    {/* Default routes */}
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route path="*" element={<Navigate to="/home" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
