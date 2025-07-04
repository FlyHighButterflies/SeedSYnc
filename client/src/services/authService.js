import api from "@/services/api";

const authService = {
    async register(credentials) {
        const response = await api.post("/auth/register", credentials);
        return response.data;
    },

    async login(credentials) {
        // Accept a single object
        const { email, password } = credentials; // Destructure here
        const response = await api.post("/auth/login", { email, password });
        if (response.data && response.data.token) {
            localStorage.setItem("token", response.data.token);
        }
        return response.data;
    },

    async logout() {
        const response = await api.post("/auth/logout");
        return response.data;
    },
};

export default authService;
