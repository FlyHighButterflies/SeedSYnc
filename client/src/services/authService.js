import api from "@/services/api";

const authService = {
    async register(credentials) {
        const response = await api.post("/auth/register", credentials);
        return response.data;
    },

    async login(credentials) {
        const response = await api.post("/auth/login", credentials);
        return response.data;
    },

    async logout() {
        const response = await api.post("/auth/logout");
        return response.data;
    },
};

export default authService;
