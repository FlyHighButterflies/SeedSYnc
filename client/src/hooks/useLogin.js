import { useAuth } from "@/hooks";
import { authService } from "@/services";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
    const { login: setAuthUser } = useAuth();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (credentials) => authService.login(credentials),
        onSuccess: (data) => {
            setAuthUser(data.user);
            navigate("/home");
        },
        onError: (error) => {
            console.error("Login failed:", error);
        },
    });
};
