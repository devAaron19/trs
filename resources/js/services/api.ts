import router from "@/router";
import { useAuthStore } from "@/stores/auth";
import axios from "axios";

const api = axios.create({
    baseURL: "http://trs.test",
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Check if error is 401 (Unauthorized)
        if (error.response && error.response.status === 401) {
            const authStore = useAuthStore();
            authStore.logout();
        }

        return Promise.reject(error);
    }
);

export default api;
