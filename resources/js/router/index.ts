import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            redirect: "dashboard",
        },
        {
            path: "/login",
            name: "Login",
            component: () => import("../views/Login.vue"),
            meta: { requiresGuest: true },
        },
        {
            path: "/register",
            name: "Register",
            component: () => import("../views/Register.vue"),
            meta: { requireGuest: true },
        },
        {
            path: "/dashboard",
            name: "Dashboard",
            component: () => import("../views/Dashboard.vue"),
            meta: { requiresAuth: true },
        },
        {
            path: "/products",
            name: "Products",
            component: () => import("../views/Products.vue"),
            meta: { requiresAuth: true },
        },
        {
            path: "/profile",
            name: "Profile",
            component: () => import("../views/Profile.vue"),
            meta: { requiresAuth: true },
        },
    ],
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next("/login");
    } else if (to.meta.requireGuest && authStore.isAuthenticated) {
        next("/dashboard");
    } else {
        next();
    }
});
export default router;
