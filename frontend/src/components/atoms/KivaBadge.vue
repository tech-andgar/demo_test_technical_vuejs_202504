<template>
  <div class="kiva-badge">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  size?: 'small' | 'medium' | 'large';
}>();
</script>

<style scoped>
.kiva-badge {
  display: inline-flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 9999px;
  padding: 0.35rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  white-space: nowrap;
}
</style> 
