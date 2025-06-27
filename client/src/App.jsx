import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { Home, SignUp, Login, Listings, Inventory, Profile } from "@/pages";
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
                    {/* Public routes */}
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

                    {/* Protected routes */}
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
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <DashboardLayout>
                                    <Profile />
                                </DashboardLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/listings"
                        element={
                            <ProtectedRoute>
                                <DashboardLayout>
                                    <Listings />
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
                                    <Inventory />
                                </DashboardLayout>
                            </ProtectedRoute>
                        }
                    />

                    {/* Default route */}
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route path="*" element={<Navigate to="/home" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
