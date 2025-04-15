<script setup lang="ts">
/**
 * Componente de spinner para indicar carga
 *
 * Proporciona una indicación visual de que se está cargando contenido
 */

// Props
interface Props {
  /** Tamaño del spinner (sm, md, lg, xl) */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Color del spinner */
  color?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: '#10b981', // Verde Kiva
});

// Calcular el tamaño en píxeles
const sizeMap = {
  sm: 16,
  md: 24,
  lg: 36,
  xl: 48,
};

const pixelSize = sizeMap[props.size] || sizeMap.md;
</script>

<template>
  <div class="spinner-container" role="status" aria-label="Loading" :style="{ width: `${pixelSize}px`, height: `${pixelSize}px` }">
    <div class="spinner" :style="{ borderTopColor: props.color }"></div>
  </div>
</template>

<style scoped>
.spinner-container {
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

.spinner {
  width: 100%;
  height: 100%;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: currentColor;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 
