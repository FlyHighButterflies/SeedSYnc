import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { Home, SignUp, Login } from "@/pages";
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
                    {/* Public routes (redirect if authenticated) */}
                    <Route
                        path="/signup"
                        element={
                            <PublicRoute>
                                <AuthLayout>
                                    <SignUp />
                                </AuthLayout>
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            <PublicRoute>
                                <AuthLayout>
                                    <Login />
                                </AuthLayout>
                            </PublicRoute>
                        }
                    />

                    {/* Protected routes (require authentication) */}
                    <Route
                        path="/home"
                        element={
                            <ProtectedRoute>
                                <DashboardLayout>
                                    <Home />
                                </DashboardLayout>
                            </ProtectedRoute>
                        }
                    />

                    {/* Add more protected routes here */}
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <DashboardLayout>
                                    <div>Profile Page</div>
                                </DashboardLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/listings"
                        element={
                            <ProtectedRoute>
                                <DashboardLayout>
                                    <div>Listings Page</div>
                                </DashboardLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/messages"
                        element={
                            <ProtectedRoute>
                                <DashboardLayout>
                                    <div>Messages Page</div>
                                </DashboardLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/inventory"
                        element={
                            <ProtectedRoute>
                                <DashboardLayout>
                                    <div>Inventory Page</div>
                                </DashboardLayout>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
