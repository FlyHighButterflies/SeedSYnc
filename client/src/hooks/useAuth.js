import { api } from "@/services";
import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export function useLogin() {
    return useMutation({
        mutationFn: async (credentials) => {
            const response = await api.post("/auth/login", credentials);
            return response.data;
        },
    });
}

export function useRegister() {
    return useMutation({
        mutationFn: async (credentials) => {
            const response = await api.post("/auth/register", credentials);
            return response.data;
        },
    });
}
