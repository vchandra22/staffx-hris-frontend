<template>
  <div :class="['tab-group', { 'flex': isVertical }, rootClass]">
    <!-- Tab List -->
    <div role="tablist" :class="[
      'relative bg-slate-100 rounded-lg p-1',
      isVertical ? 'flex flex-col' : 'flex',
      tabListClass
    ]">
      <slot name="tabs" :activeTab="computedActiveTab" :setActiveTab="setActiveTab"></slot>
    </div>

    <!-- Tab Content -->
    <div class="tab-content-container" :class="contentContainerClass">
      <slot name="content" :activeTab="computedActiveTab"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
type Orientation = "horizontal" | "vertical";

interface TabItem {
  label: string;
  value: string;
  // Bisa ditambah properti lain jika ada (icon, disabled, dsb)
}

interface TabsProps {
  modelValue?: string;                    // Nama tab aktif
  tabItems: TabItem[];                    // Daftar tab
  orientation?: Orientation;              // 'horizontal' | 'vertical'
  rootClass?: string;                     // Kelas root container
  tabListClass?: string;                  // Kelas untuk list tab
  contentContainerClass?: string;        // Kelas untuk konten tab
}
const props = withDefaults(defineProps<TabsProps>(), {
  orientation: "horizontal"
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