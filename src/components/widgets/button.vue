<template>
    <component
      :is="href ? 'a' : 'button'"
      :href="href"
      :type="href ? null : type"
      :disabled="isLoading"
      :class="computedClasses"
      class="inline-flex items-center border font-sans font-medium text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed text-sm rounded-md py-2 px-4"
    >
      <svg
        v-if="isLoading"
        fill="none"
        class="animate-spin h-4 w-4 mr-2"
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke="currentColor"
          stroke-width="5"
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
        ></path>
        <path
          stroke-width="5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="text-slate-800"
          d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
          stroke="currentColor"
        ></path>
      </svg>
      <slot />
    </component>
  </template>
  
  <script setup>
  import { computed } from "vue";
  
  const props = defineProps({
    variant: {
      type: String,
      default: "solid",
      validator: (value) =>
        ["ghost", "solid", "gradient", "outline"].includes(value),
    },
    color: {
      type: String,
      default: "primary",
      validator: (value) =>
        ["primary", "secondary", "info", "success", "warning", "error"].includes(
          value
        ),
    },
    href: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: "button",
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    class: {
        type: String,
        default :"",
    }
  });
  
  // Warna dasar
  const baseColors = {
    primary: { bg: "bg-primary", text: "text-primary", border: "border-primary" },
    secondary: { bg: "bg-secondary", text: "text-secondary", border: "border-secondary" },
    info: { bg: "bg-info", text: "text-info", border: "border-info" },
    success: { bg: "bg-success", text: "text-success", border: "border-success" },
    warning: { bg: "bg-warning", text: "text-warning", border: "border-warning" },
    error: { bg: "bg-danger", text: "text-danger", border: "border-danger" },
  };
  
  // Variasi warna berdasarkan varian
  const computedClasses = computed(() => {
    const colorStyles = baseColors[props.color] || baseColors["primary"]; // Default ke "primary" jika warna tidak ditemukan
    const { bg, text, border } = colorStyles;
  
    const variants = {
      solid: `${bg} text-white hover:brightness-90`,
      outline: `border ${border} ${text} bg-white hover:bg-gray-100`,
      ghost: `bg-transparent ${text} border-transparent hover:${border} hover:bg-opacity-10`,
      gradient: `bg-gradient-to-tr from-${props.color}-600 to-${props.color}-400 text-white hover:brightness-105`,
    };
    
    return [props.class, props.customClass, variants[props.variant]];
  });
  </script>
  