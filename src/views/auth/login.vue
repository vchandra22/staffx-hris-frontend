<script setup>
import { reactive, computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/state/pinia";
import { useColorMode } from "@vueuse/core";
import { Toaster, toast } from "vue-sonner";
import { mdiEye, mdiEyeOff, mdiGoogle } from "@mdi/js";

const showPassword = ref(false);
const mode = useColorMode();
const router = useRouter();
const authStore = useAuthStore();
const statusCode = computed(() => authStore.response.status);

const formModel = reactive({
    email: "",
    password: "",
});

const errorList = reactive({
    email: null,
    password: null,
});

const toggleTheme = () => {
    mode.value = mode.value === "dark" ? "light" : "dark";
};

const togglePassword = () => {
    showPassword.value = !showPassword.value;
};

const login = async () => {
    const user = await authStore.login(formModel);

    if (statusCode.value !== 200) {
        toast.error("Login Failed", {
            description: "Invalid credentials. Please check your email and password.",
            position: "bottom-right",
            duration: 3000,
            class: "bg-red-600 text-white border-none shadow-lg",
        });
    } else {
        toast.success("Welcome Back!", {
            description: "You have successfully logged in.",
            position: "bottom-right",
            duration: 3000,
            class: "bg-green-500 text-white border-none shadow-lg",
        });
        setTimeout(function() {
            console.log("Hello World!");
            if (user.role === "user") {
                router.push("/");
            } else {
                router.push("/dashboard");
            }
        }, 1000); // 3000 milisecond = 3 detik
    }
};
</script>

<template>
    <div class="flex min-h-screen items-center justify-center bg-gray-100 p-6">
        <div class="w-full max-w-md bg-white shadow-md rounded-lg p-6">
            <div class="flex items-center gap-2 justify-center mb-6">
                <h1 class="text-xl font-bold text-gray-800">Venturo.</h1>
            </div>

            <h2 class="text-lg font-semibold text-center text-gray-700 mb-4">Welcome back</h2>
            <!-- <p class="text-sm text-center text-gray-500 mb-6">Login with your account or Google account</p>

            <button class="w-full flex items-center justify-center gap-2 p-2 border border-gray-300 rounded-md shadow-sm text-gray-700 hover:bg-gray-100">
                <svg class="h-5 w-5" viewBox="0 0 24 24">
                    <path :d="mdiGoogle" fill="currentColor" />
                </svg>
                Login with Google
            </button>

            <div class="relative text-center text-sm my-6">
                <span class="relative bg-white px-2 text-gray-500">Or continue with</span>
            </div> -->

            <form @submit.prevent="login">
                <div class="mb-4 space-y-1.5">
                    <label class="text-sm text-slate-800 font-bold">Email</label>
                    <input v-model="formModel.email" type="email" placeholder="Masukkan Email"
                        class="w-full border border-slate-200 rounded-md py-2 px-2.5 text-sm shadow-sm hover:border-slate-800 focus:border-slate-800 focus:ring focus:ring-slate-800/10" />
                    <div v-if="errorList?.email" class="text-red-500 text-xs">
                        <span v-for="(err, index) in errorList.email" :key="index">
                            {{ err }}
                        </span>
                    </div>
                </div>

                <div class="mb-4 space-y-1.5">
                    <label class="text-sm text-slate-800 font-bold">Password</label>
                    <div class="relative">
                        <input v-model="formModel.password" :type="showPassword ? 'text' : 'password'" placeholder="Masukkan Password"
                            class="w-full border border-slate-200 rounded-md py-2 px-2.5 text-sm shadow-sm hover:border-slate-800 focus:border-slate-800 focus:ring focus:ring-slate-800/10" />
                        <button type="button" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600" @click="togglePassword">
                            <svg class="h-5 w-5" viewBox="0 0 24 24">
                                <path :d="showPassword ? mdiEyeOff : mdiEye" fill="currentColor" />
                            </svg>
                        </button>
                    </div>
                    <div v-if="errorList?.password" class="text-red-500 text-xs">
                        <span v-for="(err, index) in errorList.password" :key="index">
                            {{ err }}
                        </span>
                    </div>
                </div>

                <div class="flex items-center justify-between text-sm">
                    <router-link to="/forgot-password" class="text-primary hover:underline">Forgot Password?</router-link>
                </div>

                <button type="submit" class="w-full bg-primary text-white font-bold py-2 rounded-md mt-4">
                    Login
                </button>
            </form>

            <!-- <div class="text-center text-sm mt-4">
                Don't have an account?
                <router-link to="/register" class="text-primary hover:underline">Register</router-link>
            </div>

            <div class="text-center text-xs text-gray-500 mt-6">
                By clicking continue, you agree to our
                <a href="#" class="underline">Terms of Service</a> and
                <a href="#" class="underline">Privacy Policy</a>.
            </div> -->
        </div>
    </div>

    <Toaster />
</template>