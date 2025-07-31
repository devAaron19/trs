import { defineStore } from "pinia";
import api from "../services/api";
import type { User, LoginData, RegisterData, AuthResponse } from "../types";
import router from "@/router";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: null as User | null,
        token: localStorage.getItem("token") || null,
        loading: false,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        currentUser: (state) => state.user,
    },

    actions: {
        async login(credentials: LoginData) {
            this.loading = true;
            try {
                const response = await api.post<AuthResponse>(
                    "api/auth/login",
                    credentials
                );

                this.user = response.data.user;
                this.token = response.data.access_token;

                localStorage.setItem("token", response.data.access_token);
                localStorage.setItem(
                    "user",
                    JSON.stringify(response.data.user)
                );

                return { success: true };
            } catch (error: any) {
                return {
                    success: false,
                    errors: error.response?.data?.errors || {
                        general: ["Login failed."],
                    },
                };
            } finally {
                this.loading = false;
            }
        },
        async register(userData: RegisterData) {
            this.loading = true;
            try {
                const response = await api.post<AuthResponse>(
                    "api/auth/register",
                    userData
                );

                this.token = response.data.access_token;
                this.user = response.data.user;

                localStorage.setItem("token", response.data.access_token);
                localStorage.setItem(
                    "user",
                    JSON.stringify(response.data.user)
                );

                return { success: true };
            } catch (error: any) {
                return {
                    success: false,
                    errors: error.response?.data?.errors || {
                        general: ["Registration failed."],
                    },
                };
            } finally {
                this.loading = false;
            }
        },
        async fetchUser() {
            if (!this.token) return;

            try {
                const response = await api.get<User>("api/users/me");
                this.user = response.data;
                localStorage.setItem("user", JSON.stringify(response.data));
            } catch (error: any) {
                this.logout();
            }
        },
        async logout() {
            const response = await api.post("api/logout");
            this.user = null;
            this.token = null;
            localStorage.removeItem("user");
            localStorage.removeItem("token");

            router.push({ name: "login" });
        },

        initialize() {
            const token = localStorage.getItem("token");
            const user = localStorage.getItem("user");

            if (token && user) {
                this.token = token;
                this.user = JSON.parse(user);
            }
        },
    },
});
