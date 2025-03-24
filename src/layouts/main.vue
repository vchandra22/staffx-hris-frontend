<script setup>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useColorMode } from "@vueuse/core";
import { useAuthStore } from "@/state/pinia";
import {
    mdiHome,
    mdiAccountGroup,
    mdiShopping,
    mdiAccountCircle,
    mdiWeatherNight,
    mdiWhiteBalanceSunny
} from "@mdi/js";

const mode = useColorMode({
  emitAuto: false, // Supaya tidak otomatis pakai sistem OS
  modes: {
    light: "light",
    dark: "dark",
  },
});

if (!mode.value) {
  mode.value = "light"; // Set default ke "light"
}
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const showMenu = ref(false);
const userRole = computed(() => authStore.getUser()?.role || "user");

const toggleTheme = () => {
    console.log(mode.value)
    mode.value = mode.value === "dark" ? "light" : "dark";
};
const logout = async () => {
    await authStore.logout();
    router.push({ name: "login" });
};
</script>

<template>
    <div class="grid min-h-screen w-full grid-rows-[auto_auto_1fr]">
        <!-- Navbar Baris 1 -->
        <header class="flex h-14 lg:h-[60px] items-center justify-between border-b bg-gray-100 dark:bg-gray-900 px-4 lg:px-6">
            <!-- Logo -->
            <a href="/dashboard" class="flex items-center gap-2 font-semibold">
                <img src="../assets/logo-venturo.webp" class="w-32 h-auto">
            </a>

            <!-- Right Section (Theme Toggle + User Menu) -->
            <div class="flex items-center gap-4">
                <!-- Toggle Theme -->
                <button @click="toggleTheme" class="p-2 rounded-full bg-gray-300 dark:bg-gray-700">
                    <svg class="h-5 w-5" viewBox="0 0 24 24">
                        <path :d="mode === 'light' ? mdiWeatherNight : mdiWhiteBalanceSunny" />
                    </svg>
                </button>

                <!-- User Dropdown -->
                <div class="dropdown relative">
                    <button data-toggle="dropdown" aria-expanded="false"
                        class="p-2 rounded-full bg-gray-300 dark:bg-gray-700">
                        <svg class="h-5 w-5" viewBox="0 0 24 24">
                            <path :d="mdiAccountCircle" />
                        </svg>
                    </button>
                    <div data-role="menu"
                        class="hidden absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl p-1 z-10">
                        <a href="#" class="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-md">My Account</a>
                        <a href="#" class="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-md">Settings</a>
                        <button @click="logout"
                            class="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-md">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <!-- Navbar Baris 2 (Menu Navigasi) -->
        <div class="flex h-14 lg:h-[60px] items-center justify-start border-b bg-primary dark:bg-gray-900 px-4 lg:px-6">
            <nav class="flex gap-6 text-sm font-semibold text-white">
                <router-link to="/dashboard"
                    class="flex items-center gap-2 px-3 py-2 rounded-lg transition"
                    :class="{ 'bg-gray-300 dark:bg-gray-700 text-primary': route.path === '/dashboard' }">
                    <svg class="h-5 w-5 text-white" viewBox="0 0 24 24">
                        <path :d="mdiHome" />
                    </svg> Dashboard
                </router-link>
                <router-link to="/user"
                    class="flex items-center gap-2 px-3 py-2 rounded-lg transition"
                    :class="{ 'bg-gray-200 dark:bg-gray-700 text-primary': route.path === '/user' }">
                    <svg class="h-5 w-5 text-white" viewBox="0 0 24 24">
                        <path :d="mdiAccountGroup" />
                    </svg> Users
                </router-link>
            </nav>
        </div>
        <!-- Main Content -->
        <main class="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <slot />
        </main>
    </div>
</template>
