<script setup>
import { ref, computed } from "vue";
import Datepicker from "vue-tailwind-datepicker";

const props = defineProps({
    modelValue: [String, Array, Date],
    label: String,
    placeholder: String,
    format: {
        type: String,
        default: "YYYY-MM-DD",
    },
    range: {
        type: Boolean,
        default: false, // false = Single Date, true = Range Date
    },
    weekStart: {
        type: Number,
        default: 0, // 0 = Sunday, 1 = Monday
    },
    autoApply: {
        type: Boolean,
        default: true,
    },
    i18n: {
        type: Object,
        default: () => ({
            // Default bahasa Indonesia
            language: "id",
            months: [
                "Januari", "Februari", "Maret", "April", "Mei", "Juni",
                "Juli", "Agustus", "September", "Oktober", "November", "Desember",
            ],
            weekdays: ["Ming", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
            cancel: "Batal",
            clear: "Bersihkan",
            done: "Selesai",
        }),
    },
    errors: Array,
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
