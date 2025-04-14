<script setup lang="ts">
import { useLoan } from '@/composables/useLoan';
import type { LoanFilters } from '@/models/filters';
import { computed, onMounted, ref } from 'vue';
import { KivaText } from '../atoms';
import CountryFilter from './CountryFilter.vue';
import SectorFilter from './SectorFilter.vue';

/**
 * Filter panel for loans
 *
 * Contains all available filters and allows applying them to the loans list
 */

// Props
interface Props {
  /** Currently applied filters */
  filters?: LoanFilters;
  /** Filter panel title */
  title?: string;
  /** Counter of active loans by country */
  activeLoanCounts?: Record<string, number>;
}

const props = withDefaults(defineProps<Props>(), {
  filters: () => ({}),
  title: 'Filter Results',
  activeLoanCounts: () => ({}),
});

// Emits
const emit = defineEmits<{
  /** Emitted when new filters are applied */
  (e: 'update:filters', filters: LoanFilters): void;
  /** Emitted when filters are applied */
  (e: 'filter', filters: LoanFilters): void;
}>();

// Acceder a los sectores disponibles
const { loadFilterOptions, loadingFilters } = useLoan();

// Estado local
const currentFilters = ref<LoanFilters>(props.filters || {});
const isPanelOpen = ref(false);

// Estado temporal para mantener las selecciones antes de aplicar
const tempFilters = ref<{ sectors: number[]; countries: string[] }>({
  sectors: [],
  countries: [],
});

// Estado para controlar qué filtro está abierto
const activeFilterId = ref<string | null>(null);

// Inicializar selecciones basadas en los filtros iniciales
if (props.filters?.sectors) {
  tempFilters.value.sectors = [...props.filters.sectors];
}

if (props.filters?.countries) {
  tempFilters.value.countries = [...props.filters.countries];
}

// Carga las opciones de filtro al montar el componente
onMounted(() => {
  loadFilterOptions();
});

// Update temporary sector selection
const handleSectorSelection = (sectors: number[]) => {
  tempFilters.value.sectors = sectors;
};

// Update temporary country selection
const handleCountrySelection = (countries: string[]) => {
  tempFilters.value.countries = countries;
};

// Aplica los filtros cuando se presiona Apply en cualquier filtro
const applyFilters = () => {
  const newFilters: LoanFilters = {};

  if (tempFilters.value.sectors.length > 0) {
    newFilters.sectors = [...tempFilters.value.sectors];
  }

  if (tempFilters.value.countries.length > 0) {
    newFilters.countries = [...tempFilters.value.countries];
  }

  currentFilters.value = newFilters;
  emit('update:filters', newFilters);
  emit('filter', newFilters);
};

// Limpia todos los filtros
const clearAllFilters = () => {
  tempFilters.value = { sectors: [], countries: [] };
  currentFilters.value = {};
  emit('update:filters', {});
  emit('filter', {});
};

// Alterna la visibilidad del panel de filtros en móvil
const toggleFilterPanel = () => {
  isPanelOpen.value = !isPanelOpen.value;
};

// Gestiona qué filtro está abierto
const handleToggleDropdown = (isOpen: boolean, filterId: string) => {
  if (isOpen) {
    activeFilterId.value = filterId;
  } else if (activeFilterId.value === filterId) {
    activeFilterId.value = null;
  }
};

// Comprueba si un filtro está actualmente abierto
const isFilterOpen = (filterId: string): boolean => {
  return activeFilterId.value === filterId;
};

// Calculate a text that explains the current filters to show to the user
const appliedFiltersText = computed(() => {
  const filters = [];

  if (tempFilters.value.sectors.length > 0) {
    filters.push(`${tempFilters.value.sectors.length} sectors`);
  }

  if (tempFilters.value.countries.length > 0) {
    filters.push(`${tempFilters.value.countries.length} countries`);
  }

  if (filters.length === 0) {
    return 'No filters applied';
  }

  return `Applied filters: ${filters.join(' and ')}`;
});
</script>

<template>
  <div class="filter-panel">
    <!-- Mobile header -->
    <div class="filter-header-mobile" @click="toggleFilterPanel">
      <KivaText variant="h4" size="lg">{{ title }}</KivaText>
      <span class="toggle-icon">{{ isPanelOpen ? '▲' : '▼' }}</span>
    </div>
    
    <!-- Panel content (always visible on desktop, conditional on mobile) -->
    <div class="filter-content" :class="{ 'is-open': isPanelOpen }">
      <!-- Desktop header -->
      <div class="filter-header-desktop">
        <KivaText variant="h4" size="lg">{{ title }}</KivaText>
        <button 
          v-if="tempFilters.sectors.length > 0 || tempFilters.countries.length > 0"
          class="clear-all-btn" 
          @click="clearAllFilters"
        >
          Clear All
        </button>
      </div>
      
      <!-- Active loans indicator -->
      <div class="active-loans-notice">
        <small>Showing only active loans in fundraising. Counters may include loans in all statuses.</small>
      </div>
      
      <!-- Applied filters indicator -->
      <div v-if="tempFilters.sectors.length > 0 || tempFilters.countries.length > 0" class="filters-summary">
        <small>{{ appliedFiltersText }}</small>
        <small class="filters-note">* The top counter shows loans that meet all selected filters, while the numbers next to each country or sector indicate the total available in that category without applying other filters. That's why they may be different.</small>
      </div>
      
      <!-- Status messages -->
      <div v-if="loadingFilters" class="filter-status">
        <KivaText size="sm">Loading filter options...</KivaText>
      </div>
      
      <!-- Filter sections -->
      <div class="filter-section">
        <SectorFilter
          :selected-sectors="tempFilters.sectors"
          @update:selected-sectors="handleSectorSelection"
          @filter="applyFilters"
          @toggle-dropdown="handleToggleDropdown"
          placeholder="Sector"
          filter-id="sector"
          :is-dropdown-open="isFilterOpen('sector')"
        />
      </div>
      
      <!-- Country filter -->
      <div class="filter-section">
        <CountryFilter
          :selected-countries="tempFilters.countries"
          @update:selected-countries="handleCountrySelection"
          @filter="applyFilters"
          @toggle-dropdown="handleToggleDropdown"
          placeholder="Country"
          filter-id="country"
          :is-dropdown-open="isFilterOpen('country')"
          :active-loan-counts="activeLoanCounts"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.filter-panel {
  width: 100%;
  max-width: 300px;
  font-family: var(--kiva-font-family, 'Arial, sans-serif');
}

.filter-header-mobile {
  display: none;
  padding: 1rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  cursor: pointer;
  justify-content: space-between;
  align-items: center;
}

.filter-content {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 1.5rem;
}

.filter-header-desktop {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.clear-all-btn {
  background-color: transparent;
  color: #6b7280;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.clear-all-btn:hover {
  background-color: #f9fafb;
}

.filter-section {
  margin-bottom: 1.5rem;
}

.filter-status {
  display: flex;
  justify-content: center;
  padding: 1rem 0;
  color: #6b7280;
}

.filters-summary {
  margin: 0.5rem 0 1rem;
  padding: 0.5rem;
  background-color: #f0fdf4;
  border: 1px solid #dcfce7;
  border-radius: 0.375rem;
  text-align: center;
}

.filters-note {
  display: block;
  margin-top: 0.25rem;
  color: #6b7280;
  font-style: italic;
}

.active-loans-notice {
  margin: 0 0 1rem;
  padding: 0.5rem;
  background-color: #eff6ff;
  border: 1px solid #dbeafe;
  border-radius: 0.375rem;
  text-align: center;
  color: #3b82f6;
  font-style: italic;
}

/* Responsive */
@media (max-width: 767px) {
  .filter-panel {
    max-width: none;
  }
  
  .filter-header-mobile {
    display: flex;
  }
  
  .filter-content {
    display: none;
  }
  
  .filter-content.is-open {
    display: block;
    margin-bottom: 1rem;
  }
}
</style> 
