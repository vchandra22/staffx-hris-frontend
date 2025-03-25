<script setup>
import { reactive, computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/state/pinia";
import { useColorMode } from "@vueuse/core";
import { Toaster, toast } from "vue-sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const showPassword = ref(false);
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
const userStore = useUserStore();
const statusCode = computed(() => userStore.response.status);

const formModel = reactive({
    name: "",
    email: "",
    password: "",
});
const toggleTheme = () => {
    mode.value = mode.value === "dark" ? "light" : "dark";
};
const togglePassword = () => {
    showPassword.value = !showPassword.value;
};
const register = async () => {
    await userStore.register(formModel);
    if (statusCode.value !== 200) {
        toast.error("Register Failed", {
            description: "Please try again later",
            position: "bottom-right",
            duration: 3000,
            class: "bg-red-600 text-white border-none shadow-lg",
        });
    } else {
        toast.success("Register Success", {
            description: "Login to continue",
            position: "bottom-right",
            duration: 3000,
            class: "bg-green-500 text-white border-none shadow-lg",
        });
        router.push("/login");
    }
};
</script>

<template>
    <div
        class="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10"
    >
        <Button
            variant="secondary"
            class="absolute top-6 right-6"
            @click="toggleTheme"
        >
            <Moon
                class="h-[1.2rem] w-[1.2rem] transition-all transform dark:-rotate-90 dark:scale-0"
            />
            <Sun
                class="h-[1.2rem] w-[1.2rem] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
            />
            <span class="sr-only">Toggle theme</span>
        </Button>
        <div class="flex w-full max-w-md flex-col gap-6">
            <a href="#" class="flex items-center gap-2 self-center font-medium">
                <div
                    class="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground"
                >
                    <HeartHandshake class="size-4" />
                </div>
                venturo.ida>
            <Card>
                <CardHeader class="text-center">
                    <CardTitle class="text-xl">Create your account</CardTitle>
                    <CardDescription
                        >Register with your email or Google to get
                        started</CardDescription
                    >
                </CardHeader>
                <CardContent>
                    <form @submit.prevent="register">
                        <div class="grid gap-6">
                            <router-link to="#">
                                <Button
                                    variant="outline"
                                    class="w-full flex items-center gap-2 font-bold"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        class="h-5 w-5"
                                    >
                                        <path
                                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    Continue with Google
                                </Button>
                            </router-link>
                            <div
                                class="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border"
                            >
                                <span
                                    class="relative z-10 bg-background px-2 text-muted-foreground"
                                >
                                    Or continue with
                                </span>
                            </div>
                            <div class="grid gap-4">
                                <div class="grid gap-2">
                                    <Label for="email">Fullname</Label>
                                    <Input
                                        v-model="formModel.name"
                                        id="fullname"
                                        type="text"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                                <div class="grid gap-2">
                                    <Label for="email">Email</Label>
                                    <Input
                                        v-model="formModel.email"
                                        id="email"
                                        type="email"
                                        placeholder="mail@venturo.id"
                                        required
                                    />
                                </div>
                                <div class="grid gap-2">
                                    <div class="flex items-center">
                                        <Label for="password">Password</Label>
                                    </div>
                                    <div class="relative">
                                        <Input
                                            v-model="formModel.password"
                                            id="password"
                                            :type="
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            "
                                            placeholder="••••••••"
                                            required
                                        />
                                        <Button
                                            variant="icon"
                                            class="absolute right-2 top-1/2 transform -translate-y-1/2 justify-center items-center"
                                            @click="togglePassword"
                                            type="button"
                                        >
                                            <template v-if="showPassword">
                                                <EyeOff class="h-5 w-5" />
                                            </template>
                                            <template v-else>
                                                <Eye class="h-5 w-5" />
                                            </template>
                                        </Button>
                                    </div>
                                </div>
                                <Button type="submit" class="w-full font-bold"
                                    >Register</Button
                                >
                            </div>
                            <div class="text-center text-sm">
                                Already have an account?
                                <router-link
                                    to="/login"
                                    class="underline-offset-4 hover:underline"
                                >
                                    Login
                                </router-link>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <div class="text-center text-xs text-muted-foreground">
                By clicking continue, you agree to our
                <a href="#" class="underline">Terms of Service</a> and
                <a href="#" class="underline">Privacy Policy</a>.
            </div>
        </div>
    </div>
    <Toaster />
</template>
