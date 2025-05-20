<template>
    <div v-if="isModalOpen" class="fixed inset-0 bg-slate-950/50 flex justify-center items-center z-[9999]">
        <div ref="modalContent"
             class="bg-white rounded-xl shadow-2xl shadow-slate-950/5 scale-95 transition-transform duration-300 ease-out"
             :class="modalWidth">

            <!-- Header Modal -->
            <div class="pt-4 px-4 flex justify-between items-start">
                <div class="flex flex-col">
                    <slot name="title">Default Title</slot>
                </div>
            </div>

            <!-- Body Modal -->
            <div class="p-4 overflow-y-auto max-h-[60vh]">
                <slot name="body">Isi default modal</slot>
            </div>

            <!-- Footer Modal -->
            <div class="px-4 py-4 flex justify-end gap-2">
                <slot name="footer"></slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";

const isModalOpen = ref(false);
const emit = defineEmits(["close"]);
type SizeOption = "sm" | "md" | "lg" | "xl" | "full";

interface ModalProps {
    size?: SizeOption; // default: "md"
}

// Definisi props
const props = withDefaults(defineProps<ModalProps>(), {
    size: "md"
});

// Mapping ukuran modal ke class Tailwind
const modalWidth = computed(() => {
    return {
        sm: "w-3/12",
        md: "w-5/12",
        lg: "w-7/12",
        xl: "w-9/12",
        full: "w-11/12",
    }[props.size] || "w-5/12";
});

// Fungsi untuk membuka dan menutup modal
const openModal = () => {
    isModalOpen.value = true;
};
const closeModal = () => {
    isModalOpen.value = false;
    emit("close");
};

// Mengekspos fungsi agar bisa dipanggil dari luar
defineExpose({openModal, closeModal});
</script>
