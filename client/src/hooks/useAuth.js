import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { authService } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

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
            setAuthUser(data.user);
            navigate("/home");
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
        },
    });

    // Register mutation
    const register = useMutation({
        mutationFn: (credentials) => authService.register(credentials),
        onSuccess: () => {
            navigate("/login");
        },
        onError: (error) => {
            console.error("Registration failed:", error);
        },
    });

    return {
        ...context, // Provides access to `user`, `isAuthenticated`, etc.
        login,
        logout,
        register,
    };
};
