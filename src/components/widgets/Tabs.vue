<template>
    <div :class="['tab-group', { 'flex': isVertical }, rootClass]">
      <!-- Tab List -->
      <div
        role="tablist"
        :class="[
          'relative bg-slate-100 rounded-lg p-1',
          isVertical ? 'flex flex-col' : 'flex',
          tabListClass
        ]"
      >
        <slot name="tabs" :activeTab="computedActiveTab" :setActiveTab="setActiveTab"></slot>
      </div>
  
      <!-- Tab Content -->
      <div class="tab-content-container" :class="contentContainerClass">
        <slot name="content" :activeTab="computedActiveTab"></slot>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed, watch } from 'vue';
  
  const props = defineProps({
    modelValue: String, // Nama tab aktif
    tabItems: { // Daftar tab untuk memilih tab pertama
      type: Array,
      required: true
    },
    orientation: {
      type: String,
      default: 'horizontal', // Bisa 'horizontal' atau 'vertical'
      validator: value => ['horizontal', 'vertical'].includes(value)
    },
    rootClass: String,
    tabListClass: String,
    contentContainerClass: String
  });
  
  const emit = defineEmits(['update:modelValue']);
  
  const computedActiveTab = computed(() => {
    return props.modelValue || (props.tabItems.length ? props.tabItems[0].name : '');
  });
  
  const setActiveTab = (tab) => {
    emit('update:modelValue', tab);
  };
  
  // Jika modelValue kosong saat pertama kali, set default tab
  watch(() => props.modelValue, (newVal) => {
    if (!newVal && props.tabItems.length) {
      emit('update:modelValue', props.tabItems[0].name);
    }
  }, { immediate: true });
  </script>
  