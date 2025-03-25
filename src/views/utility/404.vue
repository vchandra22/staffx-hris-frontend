<template>
    <div class="flex items-center bg-white min-h-screen px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div class="w-full text-center">
            <div class="space-y-6">
                <h1 class="text-6xl text-gray-900 font-extrabold tracking-tight sm:text-8xl transition-transform hover:scale-110">
                    404
                </h1>
                <p class="text-gray-600 text-lg sm:text-xl font-medium">
                    Oops! Looks like you took a wrong turn. 🛤️ <br />
                    Let's get you back on track.
                </p>
            </div>
            <div class="mt-6">
                <Button class="me-2" color="primary" variant="ghost" href="/">Go Home</Button>
            </div>
        </div>
    </div>
</template>
<script setup>
import Button from "@/components/widgets/Button";

</script>