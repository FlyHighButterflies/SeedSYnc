import { useAuth } from "@/hooks";
import { authService } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
    const { logout: clearAuthUser } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
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
};
