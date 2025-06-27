import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { Home,OnboardingPage2, SignUp, Login, Listings, Inventory, Profile, OnboardingPage3 } from "@/pages";
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
                    </Route>
                         {/* OnboardingPage2 without DashboardLayout */}
    <Route
        path="/Onboarding2"
        element={
            <ProtectedRoute>
                <OnboardingPage2 />
            </ProtectedRoute>
        }
    />
    <Route
        path="/Onboarding3"
        element={
            <ProtectedRoute>
                <OnboardingPage3 />
            </ProtectedRoute>
        }
    />

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
                        <Route
                            path="/messages"
                            element={<div>Messages Page</div>}
                        />
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
