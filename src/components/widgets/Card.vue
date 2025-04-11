<template>
    <div :class="['w-full max-w-xs overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg shadow-slate-950/5', $attrs.class]">
      <!-- Header -->
      <div v-if="$slots.header" :class="['bg-slate-100 px-4 py-3 border-b border-slate-200', headerClass]">
        <slot name="header"></slot>
      </div>
    
      <!-- Body -->
      <div v-if="$slots.body" :class="['px-4 py-3', bodyClass]">
        <slot name="body"></slot>
      </div>
    
      <!-- Footer -->
      <div v-if="$slots.footer" :class="['bg-slate-100 px-4 py-3 border-t border-slate-200 flex justify-end gap-2', footerClass]">
        <slot name="footer"></slot>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  
  interface CardProps {
  headerClass?: string;
  bodyClass?: string;
  footerClass?: string;
}
const props = defineProps<CardProps>();
  </script>
  