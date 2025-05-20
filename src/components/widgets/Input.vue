<script setup lang="ts">
import { ref, computed } from "vue";
import { mdiEye, mdiEyeOff } from "@mdi/js";
interface InputFieldProps {
  modelValue?: string | number | boolean | any[];
  label?: string;
  type?: string; // e.g., "textarea", "checkbox", "select", "radio", "password"
  placeholder?: string;
  options?: any[]; // bisa diperjelas jika kamu tahu bentuk opsinya (e.g., { label: string, value: any }[])
  errors?: any[]; // bisa juga diperjelas tergantung struktur error-nya
}
const props = defineProps<InputFieldProps>();

const emit = defineEmits(["update:modelValue"]);
const showPassword = ref(false);
const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
};

const computedModelValue = computed(() => {
    return Array.isArray(props.modelValue) ? props.modelValue : [];
});
</script>

<template>
    <div class="space-y-1.5">
        <label class="text-sm text-slate-800 font-regular capitalize" v-if="label">{{ label }}</label>
        <div class="relative">

            <!-- Textarea -->
            <textarea v-if="type === 'textarea'" :placeholder="placeholder" :value="modelValue"
                @input="emit('update:modelValue', $event.target.value)"
                class="w-full border border-slate-200 rounded-md py-2 px-2.5 text-sm shadow-none hover:border-slate-800 focus:border-slate-800 focus:ring focus:ring-slate-800/10"></textarea>

            <!-- Checkbox (Multiple) -->
            <div v-else-if="type === 'checkbox' && options" class="flex flex-col gap-1">
                <label v-for="(option, index) in options" :key="index" class="flex items-center gap-2">
                    <input type="checkbox" :value="option.value" :checked="computedModelValue.includes(option.value)"
                        @change="
                            $event.target.checked
                                ? emit('update:modelValue', [...computedModelValue, option.value])
                                : emit('update:modelValue', computedModelValue.filter(v => v !== option.value))
                            " class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-500" />
                    <span class="text-base">{{ option.label }}</span>
                </label>
            </div>

            <!-- Checkbox (Single) -->
            <div v-else-if="type === 'checkbox'" class="flex items-center gap-2">
                <input type="checkbox" :checked="modelValue" @change="emit('update:modelValue', $event.target.checked)"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-500" />
                <span class="text-base">{{ label }}</span>
            </div>

            <!-- Select -->
            <select v-else-if="type === 'select'" :value="modelValue"
                @change="emit('update:modelValue', $event.target.value)"
                class="w-full border border-slate-200 rounded-md py-2 px-2.5 text-sm shadow-none hover:border-slate-800 focus:border-slate-800 focus:ring focus:ring-slate-800/10">
                <option disabled selected value="">Pilih salah satu</option>
                <option v-for="(option, index) in options" :key="index" :value="option.value">{{ option.label }}
                </option>
            </select>

            <!-- Radio -->
            <div v-else-if="type === 'radio'" class="flex flex-col gap-1">
                <label v-for="(option, index) in options" :key="index" class="flex items-center gap-2">
                    <input type="radio" :value="option.value" :checked="modelValue === option.value"
                        @change="emit('update:modelValue', option.value)"
                        class="w-4 h-4 text-blue-600 border-gray-300 focus:ring focus:ring-blue-500" />
                    <span class="text-base">{{ option.label }}</span>
                </label>
            </div>

            <!-- Password Input -->
            <div v-else-if="type === 'password'" class="relative">
                <input :type="showPassword ? 'text' : 'password'" :placeholder="placeholder" :value="modelValue"
                    @input="emit('update:modelValue', $event.target.value)"
                    class="w-full border border-slate-200 rounded-md py-2 px-2.5 text-sm shadow-none hover:border-slate-800 focus:border-slate-800 focus:ring focus:ring-slate-800/10" />
                <button type="button" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                    @click="togglePasswordVisibility">
                    <svg class="h-5 w-5" viewBox="0 0 24 24">
                        <path :d="showPassword ? mdiEyeOff : mdiEye" fill="currentColor" />
                    </svg>
                </button>
            </div>

            <!-- Default Input -->
            <input v-else :type="type" :placeholder="placeholder" :value="modelValue"
                @input="emit('update:modelValue', $event.target.value)"
                class="w-full border border-slate-200 rounded-md py-2 px-2.5 text-sm shadow-none hover:border-slate-800 focus:border-slate-800 focus:ring focus:ring-slate-800/10" />
        </div>

        <!-- Error Messages -->
        <div v-if="errors && errors.length" class="text-red-500 text-xs mt-1">
            <span v-for="(err, index) in errors" :key="index">{{ err }}</span>
        </div>
    </div>
</template>