import axios from "axios";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
});

// Add Authorization header with token from localStorage (if present)
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.debug(
                "[api.js] Sending Authorization header:",
                config.headers.Authorization
            );
        } else {
            console.warn("[api.js] No token found in localStorage");
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle 401 Unauthorized globally
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Optionally clear token and redirect to login
            localStorage.removeItem("token");
            // window.location.href = "/login"; // Uncomment if you want auto-redirect
            console.warn("[api.js] 401 Unauthorized, token cleared");
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
