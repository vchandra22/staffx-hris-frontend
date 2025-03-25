<script setup>
import { ref, watch } from "vue";
import { QuillEditor } from "@vueup/vue-quill";
import '@vueup/vue-quill/dist/vue-quill.snow.css';

const props = defineProps({
    modelValue: String, // Nilai teks dalam editor
    label: String, // Label input
    placeholder: String, // Placeholder dalam editor
    errors: Array, // Untuk menampilkan error
});

const emit = defineEmits(["update:modelValue"]);

// Menyimpan nilai teks editor
const editorContent = ref(props.modelValue || "");

// Menonton perubahan pada props.modelValue agar tetap sinkron
watch(() => props.modelValue, (newValue) => {
    if (newValue !== editorContent.value) {
        editorContent.value = newValue;
    }
});

// Mengupdate modelValue saat konten editor berubah
const updateContent = (newContent) => {
    editorContent.value = newContent;
    emit("update:modelValue", newContent);
};
</script>

<template>
    <div class="space-y-1.5">
        <!-- Label -->
        <label v-if="label" class="text-sm text-slate-800 font-bold capitalize">
            {{ label }}
        </label>

        <!-- Quill Editor -->
        <div class="border border-slate-200 rounded-md shadow-sm hover:border-slate-800 focus-within:border-slate-800 focus-within:ring focus-within:ring-slate-800/10">
            <QuillEditor 
                v-model:content="editorContent" 
                content-type="html" 
                theme="snow"
                :placeholder="placeholder"
                @update:content="updateContent"
                class="bg-white"
            />
        </div>

        <!-- Error Messages -->
        <div v-if="errors && errors.length" class="text-red-500 text-xs mt-1">
            <span v-for="(err, index) in errors" :key="index">{{ err }}</span>
        </div>
    </div>
</template>

