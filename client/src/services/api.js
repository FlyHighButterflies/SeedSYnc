import axios from "axios";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api",
    withCredentials: true, // Allows sending cookies with cross-origin requests
});

// The request interceptor that used localStorage has been removed because
// authentication tokens are now expected to be in HttpOnly cookies,
// which the browser will handle automatically.

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve();
        }
    });
    failedQueue = [];
};

// Response interceptor to handle token refresh on 401 errors
axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check if the error is a 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // If a token refresh is already in progress, queue the request
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => axiosClient(originalRequest))
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Attempt to refresh the token by calling the /refresh endpoint
                await axiosClient.get("/refresh");

                // After a successful refresh, process the queue and retry the original request
                processQueue(null);
                return axiosClient(originalRequest);
            } catch (refreshError) {
                // If the token refresh fails, reject all queued requests
                processQueue(refreshError);

                // Redirect to the login page as the session is no longer valid
                window.location.href = "/login";
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
