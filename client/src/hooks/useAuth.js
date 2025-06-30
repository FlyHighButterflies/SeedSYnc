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
        onSuccess: (data) => {
            console.log("Login response:", data);

            setAuthUser(data);
            navigate("/home");
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
