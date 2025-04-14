<script setup lang="ts">
import BaseFilter from './BaseFilter.vue';
import { useLoan } from '@/composables/useLoan';

/**
 * Componente para filtrar préstamos por sector
 * 
 * Utiliza el componente base genérico BaseFilter para mostrar
 * una lista desplegable de sectores disponibles
 */

// Props
interface Props {
  /** Mostrar el contador de préstamos junto al nombre del sector */
  showCount?: boolean;
  /** Lista de sectores preseleccionados por ID */
  selectedSectors?: number[];
  /** Texto a mostrar cuando no hay sectores seleccionados */
  placeholder?: string;
  /** Si el componente está deshabilitado */
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showCount: true,
  selectedSectors: () => [],
  placeholder: 'Select sectors',
  disabled: false
});

// Emits
const emit = defineEmits<{
  /** Emitido cuando cambia la selección de sectores */
  (e: 'update:selectedSectors', sectors: number[]): void;
  /** Emitido cuando se aplica el filtro */
  (e: 'filter', sectors: number[]): void;
}>();

// Composable para acceder a la funcionalidad de préstamos
const { availableSectors, loadFilterOptions, loadingFilters } = useLoan();

// Función para transformar datos de sector al formato del filtro base
const transformDataForFilter = (sectors: any[]) => {
  return sectors.map(sector => ({
    id: sector.id,
    name: sector.name,
    count: sector.count
  }));
};

// Handling events from BaseFilter
const handleUpdateSelection = (selection: any[]) => {
  emit('update:selectedSectors', selection);
};

const handleApplyFilter = (selection: any[]) => {
  emit('filter', selection);
};
</script>

<template>
  <BaseFilter
    :items="transformDataForFilter(availableSectors)"
    :selected-items="selectedSectors"
    :placeholder="placeholder"
    :disabled="disabled"
    :loading="loadingFilters"
    :show-count="showCount"
    @update:selection="handleUpdateSelection"
    @apply="handleApplyFilter"
  />
</template> 
