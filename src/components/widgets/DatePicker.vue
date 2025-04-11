<script setup lang="ts">
import { ref, computed } from "vue";
import Datepicker from "vue-tailwind-datepicker";
interface DatePickerProps {
  modelValue?: string | string[] | Date;
  label?: string;
  placeholder?: string;
  format?: string; // default: "YYYY-MM-DD"
  range?: boolean; // default: false
  weekStart?: number; // default: 0
  autoApply?: boolean; // default: true
  i18n?: {
    language: string;
    months: string[];
    weekdays: string[];
    cancel: string;
    clear: string;
    done: string;
  }; // default: bahasa Indonesia
  errors?: any[]; // bisa ditambahkan typing lebih spesifik kalau perlu
}

const props = withDefaults(defineProps<DatePickerProps>(), {
  format: "YYYY-MM-DD",
  range: false,
  weekStart: 0,
  autoApply: true,
  i18n: () => ({
    language: "id",
    months: [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember",
    ],
    weekdays: ["Ming", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
    cancel: "Batal",
    clear: "Bersihkan",
    done: "Selesai",
  })
});

const emit = defineEmits(["update:modelValue"]);

const selectedDate = computed({
    get: () => props.modelValue ?? (props.range ? [] : ""),
    set: (val) => emit("update:modelValue", val),
});
</script>

<template>
    <div class="space-y-1.5">
        <label v-if="label" class="text-sm text-slate-800 font-bold capitalize">{{ label }}</label>
        
        <div class="relative">
            <Datepicker
                v-model="selectedDate"
                :placeholder="placeholder"
                :format="format"
                :autoApply="autoApply"
                :weekStart="weekStart"
                :i18n="i18n"
                v-bind="range ? { asRange: true } : { asSingle: true }"
                class="w-full border border-gray-300 rounded-md text-sm shadow-sm hover:border-gray-600 focus:border-gray-600 focus:ring focus:ring-gray-600/10"
            />
        </div>
        <div v-if="errors && errors.length" class="text-red-500 text-xs mt-1">
            <span v-for="(err, index) in errors" :key="index">{{ err }}</span>
        </div>
    </div>
</template>
