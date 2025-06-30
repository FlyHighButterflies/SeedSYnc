import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";
import { authService } from "@/services";

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    const { login: setAuthUser, logout: clearAuthUser } = context;
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Login mutation
    const login = useMutation({
        mutationFn: (credentials) => authService.login(credentials),
        onSuccess: (response) => {
            // Backend returns: { token, user: { id, email, role } }
            console.log("Login response:", response.data);

            // Pass the response data to context (only user data will be saved)
            setAuthUser(response.data);

            // Navigate based on user role
            const userRole = response.data.user.role;
            if (userRole === "farmer" || userRole === "buyer") {
                navigate("/home");
            } else {
                navigate("/dashboard");
            }
        },
        onError: (error) => {
            console.error("Login failed:", error);
        },
    });

    // Registration mutation
    const register = useMutation({
        mutationFn: (credentials) => authService.register(credentials),
        onSuccess: (response) => {
            console.log("Registration successful:", response.data);
            navigate("/login");
        },
        onError: (error) => {
            console.error("Registration failed:", error);
        },
    });

    // Logout mutation
    const logout = useMutation({
        mutationFn: authService.logout,
        onSuccess: () => {
            clearAuthUser();
            queryClient.clear();
            navigate("/login");
        },
        onError: (error) => {
            console.error("Logout failed:", error);
            // Even if logout fails on server, clear local state
            clearAuthUser();
            queryClient.clear();
            navigate("/login");
        },
    });

    return {
        ...context,
        login,
        register,
        logout,
    };
};
