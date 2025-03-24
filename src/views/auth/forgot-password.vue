<script setup>
import { reactive, computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/state/pinia";
import { useColorMode } from "@vueuse/core";
import { Toaster, toast } from "vue-sonner";
import { mdiGoogle } from "@mdi/js";

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
const router = useRouter();
const authStore = useAuthStore();
const statusCode = computed(() => authStore.response.status);

const formModel = reactive({
    email: "",
});

const errorList = reactive({
    email: null,
});

const toggleTheme = () => {
    mode.value = mode.value === "dark" ? "light" : "dark";
};

const reset = async () => {
    await authStore.reset(formModel);
    if (statusCode.value !== 200) {
        toast.error("Reset Password Failed", {
            description: "Please check your email and try again later.",
            position: "bottom-right",
            duration: 3000,
            class: "bg-red-600 text-white border-none shadow-lg",
        });
    } else {
        toast.success("Reset Password Success", {
            description: "Check your email to reset your password.",
            position: "bottom-right",
            duration: 3000,
            class: "bg-green-500 text-white border-none shadow-lg",
        });
        router.push("/login");
    }
};
</script>

<template>
    <div class="flex min-h-screen items-center justify-center bg-gray-100 p-6">
        <div class="w-full max-w-md bg-white shadow-md rounded-lg p-6">
            <div class="flex items-center gap-2 justify-center mb-6">
                <h1 class="text-xl font-bold text-gray-800">Venturo.</h1>
            </div>

            <h2 class="text-lg font-semibold text-center text-gray-700 mb-4">Forgot Password</h2>
            <p class="text-sm text-center text-gray-500 mb-6">Enter your email to reset your password.</p>

            <form @submit.prevent="reset">
                <div class="mb-4 space-y-1.5">
                    <label class="text-sm text-slate-800 font-bold">Email</label>
                    <input v-model="formModel.email" type="email" placeholder="Masukkan Email"
                        class="w-full border border-slate-200 rounded-md py-2 px-2.5 text-sm shadow-sm hover:border-slate-800 focus:border-slate-800 focus:ring focus:ring-slate-800/10" required />
                    <div v-if="errorList?.email" class="text-red-500 text-xs">
                        <span v-for="(err, index) in errorList.email" :key="index">
                            {{ err }}
                        </span>
                    </div>
                </div>
                <button type="submit" class="w-full bg-primary text-white font-bold py-2 rounded-md mt-4">
                    Reset Password
                </button>
            </form>

            <div class="text-center text-sm mt-4">
                <router-link to="/login" class="text-primary hover:underline">Back to Login</router-link>
            </div>
        </div>
    </div>

    <Toaster />
</template>
