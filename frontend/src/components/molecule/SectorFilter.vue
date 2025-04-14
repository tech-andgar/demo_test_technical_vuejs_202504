<script setup lang="ts">
import BaseFilter from './BaseFilter.vue';
import { useLoan } from '@/composables/useLoan';

/**
 * Component for filtering loans by sector
 * 
 * Uses the generic base component BaseFilter to display
 * a dropdown list of available sectors
 */

// Props
interface Props {
  /** Show the loan counter next to the sector name */
  showCount?: boolean;
  /** List of preselected sectors by ID */
  selectedSectors?: number[];
  /** Text to display when no sectors are selected */
  placeholder?: string;
  /** If the component is disabled */
  disabled?: boolean;
  /** Unique identifier for the filter */
  filterId?: string;
  /** If the dropdown is open (externally controlled) */
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
  /** Emitted when the sector selection changes */
  (e: 'update:selectedSectors', sectors: number[]): void;
  /** Emitted when the filter is applied */
  (e: 'filter', sectors: number[]): void;
  /** Emitted when the dropdown state changes */
  (e: 'toggle-dropdown', isOpen: boolean, filterId: string): void;
}>();

// Composable to access loan functionality
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

// Handle dropdown toggle event
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
