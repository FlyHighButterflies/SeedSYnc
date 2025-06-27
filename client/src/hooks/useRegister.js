import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services";
import { useNavigate } from "react-router-dom";

export const useRegister = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (credentials) => authService.register(credentials),
        onSuccess: () => {
            navigate("/login");
        },
        onError: (error) => {
            console.error("Registration failed:", error);
        },
    });
};
