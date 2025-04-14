<script setup lang="ts">
defineProps<{
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'label';
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'muted';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right' | 'justify';
  truncate?: boolean;
  clamp?: number;
}>();
</script>

<template>
  <component
    :is="variant || 'p'"
    :class="[
      'kiva-text',
      `kiva-text--${color || 'default'}`,
      `kiva-text--${size || 'md'}`,
      `kiva-text--${weight || 'normal'}`,
      `kiva-text--${align || 'left'}`,
      { 'kiva-text--truncate': truncate },
      { 'kiva-text--clamp': clamp }
    ]"
    :style="clamp ? { '--clamp-lines': clamp } : {}"
  >
    <slot></slot>
  </component>
</template>

<style scoped>
.kiva-text {
  margin: 0;
  padding: 0;
  line-height: 1.5;
}

/* Colors */
.kiva-text--default {
  color: #111827;
}

.kiva-text--primary {
  color: #26b6a1;
}

.kiva-text--secondary {
  color: #4faf4e;
}

.kiva-text--success {
  color: #10b981;
}

.kiva-text--warning {
  color: #f59e0b;
}

.kiva-text--error {
  color: #ef4444;
}

.kiva-text--muted {
  color: #6b7280;
}

/* Sizes */
.kiva-text--xs {
  font-size: 0.75rem;
}

.kiva-text--sm {
  font-size: 0.875rem;
}

.kiva-text--md {
  font-size: 1rem;
}

.kiva-text--lg {
  font-size: 1.125rem;
}

.kiva-text--xl {
  font-size: 1.25rem;
}

.kiva-text--2xl {
  font-size: 1.5rem;
}

/* Weights */
.kiva-text--normal {
  font-weight: 400;
}

.kiva-text--medium {
  font-weight: 500;
}

.kiva-text--semibold {
  font-weight: 600;
}

.kiva-text--bold {
  font-weight: 700;
}

/* Alignments */
.kiva-text--left {
  text-align: left;
}

.kiva-text--center {
  text-align: center;
}

.kiva-text--right {
  text-align: right;
}

.kiva-text--justify {
  text-align: justify;
}

/* Truncation */
.kiva-text--truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Line clamping */
.kiva-text--clamp {
  display: -webkit-box;
  -webkit-line-clamp: var(--clamp-lines);
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 
