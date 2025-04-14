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
  /** Identificador único para el filtro */
  filterId?: string;
  /** Si el dropdown está abierto (controlado externamente) */
  isDropdownOpen?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showCount: true,
  selectedSectors: () => [],
  placeholder: 'Select sectors',
  disabled: false,
  filterId: 'sector',
  isDropdownOpen: false
});

// Emits
const emit = defineEmits<{
  /** Emitido cuando cambia la selección de sectores */
  (e: 'update:selectedSectors', sectors: number[]): void;
  /** Emitido cuando se aplica el filtro */
  (e: 'filter', sectors: number[]): void;
  /** Emitido cuando se cambia el estado del dropdown */
  (e: 'toggle-dropdown', isOpen: boolean, filterId: string): void;
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

// Manejar el evento de toggle del dropdown
const handleToggleDropdown = (isOpen: boolean, filterId: string) => {
  emit('toggle-dropdown', isOpen, filterId);
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
    :filter-id="filterId"
    :is-dropdown-open="isDropdownOpen"
    loading-message="Loading sectors..."
    empty-message="No sectors available"
    @update:selection="handleUpdateSelection"
    @apply="handleApplyFilter"
    @toggle-dropdown="handleToggleDropdown"
  />
</template> 
