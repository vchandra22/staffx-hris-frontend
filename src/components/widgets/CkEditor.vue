<template>
    <div class="space-y-1.5">
        <label class="text-sm text-slate-800 font-bold capitalize" v-if="label">{{ label }}</label>
        <div class="relative">
            <component
                :is="CKEditorComponent"
                :editor="ClassicEditor"
                :model-value="editorData"
                :config="editorConfig"
                @update:model-value="handleEditorChange"
                class="w-full border border-slate-200 rounded-md shadow-sm hover:border-slate-800 focus:border-slate-800 focus:ring focus:ring-slate-800/10"
            />
        </div>
        <div v-if="errors && errors.length" class="text-red-500 text-xs mt-1">
            <span v-for="(err, index) in errors" :key="index">{{ err }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const CKEditorComponent = CKEditor.component;

interface CKEditorProps {
  modelValue?: string;
  label?: string;
  placeholder?: string;
  errors?: any[]; // Atau bisa diganti ke tipe error tertentu kalau kamu punya
  editorConfig?: Record<string, any>; // Bisa diganti dengan tipe spesifik CKEditor config kalau perlu
}

const props = defineProps<CKEditorProps>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const editorData = ref(props.modelValue || "");

watch(
    () => props.modelValue,
    (newValue) => {
        if (newValue !== editorData.value) {
            editorData.value = newValue;
        }
    }
);

const handleEditorChange = (data) => {
    emit("update:modelValue", data);
};
</script>
