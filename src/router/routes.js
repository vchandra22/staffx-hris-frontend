import { useAuthStore } from "@/state/pinia";
export default [
    {
        path: "/",
        name: "home",
        beforeEnter(to, from, next) {
            const auth = useAuthStore();
            if (auth.getToken) {
                next({ name: "dashboard" });
            } else {
                next({ name: "login" });
            }
        },
    },
    {
        path: "/dashboard",
        name: "dashboard",
        meta: { title: "Dashboard", authRequired: true },
        component: () => import("../views/dashboard"),
    },
    {
        path: "/user",
        name: "user",
        meta: { title: "User Page", authRequired: true },
        component: () => import("../views/user"),
    },
    {
        path: "/login",
        name: "login",
        component: () => import("../views/auth/login"),
        meta: {
            title: "Login",
            beforeResolve(routeTo, routeFrom, next) {
                const auth = useAuthStore();
                if (auth.getToken) {
                    next({ name: "default" });
                } else {
                    next();
                }
            },
        },
    },
    {
        path: "/register",
        name: "Register",
        component: () => import("../views/auth/register"),
        meta: {
            title: "Register",
            beforeResolve(routeTo, routeFrom, next) {
                const auth = useAuthStore();
                if (auth.getToken) {
                    next({ name: "default" });
                } else {
                    next();
                }
            },
        },
    },
    {
        path: "/forgot-password",
        name: "Forgot password",
        component: () => import("../views/auth/forgot-password"),
        meta: {
            title: "Forgot password",
            beforeResolve(routeTo, routeFrom, next) {
                const auth = useAuthStore();
                if (auth.getToken) {
                    next({ name: "default" });
                } else {
                    next();
                }
            },
        },
    },
    {
        path: "/404",
        name: "NotFound",
        component: () => import("../views/utility/404.vue"),
        meta: {
            title: "404 Not Found",
        },
    },
    {
        path: "/:catchAll(.*)",
        redirect: { name: "NotFound" },
    },
];
