<script setup lang="ts">
import { ref } from 'vue';
import { KivaText } from '../atoms';
import SectorFilter from './SectorFilter.vue';
import CountryFilter from './CountryFilter.vue';
import type { LoanFilters } from '@/models/filters';
import { useLoan } from '@/composables/useLoan';

/**
 * Panel de filtros para préstamos
 * 
 * Contiene todos los filtros disponibles y permite aplicarlos a la lista de préstamos
 */

// Props
interface Props {
  /** Filtros actuales aplicados */
  filters?: LoanFilters;
  /** Título del panel de filtros */
  title?: string;
  /** Contador de préstamos activos por país */
  activeLoanCounts?: Record<string, number>;
}

const props = withDefaults(defineProps<Props>(), {
  filters: () => ({}),
  title: 'Filter Results',
  activeLoanCounts: () => ({})
});

// Emits
const emit = defineEmits<{
  /** Emitido cuando se aplican nuevos filtros */
  (e: 'update:filters', filters: LoanFilters): void;
  /** Emitido cuando se aplican filtros */
  (e: 'filter', filters: LoanFilters): void;
}>();

// Acceder a los sectores disponibles
const { availableSectors, loadFilterOptions, loadingFilters } = useLoan();

// Estado local
const currentFilters = ref<LoanFilters>(props.filters || {});
const isPanelOpen = ref(false);

// Estado temporal para mantener las selecciones antes de aplicar
const tempFilters = ref<{sectors: number[], countries: string[]}>({
  sectors: [],
  countries: []
});

// Inicializar selecciones basadas en los filtros iniciales
if (props.filters?.sectors) {
  tempFilters.value.sectors = [...props.filters.sectors];
}

if (props.filters?.countries) {
  tempFilters.value.countries = [...props.filters.countries];
}

// Actualiza la selección temporal de sectores
const handleSectorSelection = (sectors: number[]) => {
  console.log('Actualizando selección temporal de sectores:', sectors);
  tempFilters.value.sectors = sectors;
};

// Actualiza la selección temporal de países
const handleCountrySelection = (countries: string[]) => {
  console.log('Actualizando selección temporal de países:', countries);
  tempFilters.value.countries = countries;
};

// Aplica los filtros cuando se presiona Apply en cualquier filtro
const applyFilters = () => {
  console.log('Aplicando filtros');
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
  console.log('Limpiando todos los filtros');
  tempFilters.value = { sectors: [], countries: [] };
  currentFilters.value = {};
  emit('update:filters', {});
  emit('filter', {});
};

// Alterna la visibilidad del panel de filtros en móvil
const toggleFilterPanel = () => {
  isPanelOpen.value = !isPanelOpen.value;
};
</script>

<template>
  <div class="filter-panel">
    <!-- Cabecera móvil -->
    <div class="filter-header-mobile" @click="toggleFilterPanel">
      <KivaText variant="h4" size="lg">{{ title }}</KivaText>
      <span class="toggle-icon">{{ isPanelOpen ? '▲' : '▼' }}</span>
    </div>
    
    <!-- Contenido del panel (visible siempre en escritorio, condicional en móvil) -->
    <div class="filter-content" :class="{ 'is-open': isPanelOpen }">
      <!-- Cabecera escritorio -->
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
      
      <!-- Mensajes de status -->
      <div v-if="loadingFilters" class="filter-status">
        <KivaText size="sm">Loading filter options...</KivaText>
      </div>
      
      <!-- Secciones de filtros -->
      <div class="filter-section">
        <SectorFilter
          :selected-sectors="tempFilters.sectors"
          @update:selected-sectors="handleSectorSelection"
          @filter="applyFilters"
          placeholder="Sector"
        />
      </div>
      
      <!-- Filtro de países -->
      <div class="filter-section">
        <CountryFilter
          :selected-countries="tempFilters.countries"
          @update:selected-countries="handleCountrySelection"
          @filter="applyFilters"
          placeholder="País"
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

.filter-disabled {
  opacity: 0.6;
  pointer-events: none;
}

.disabled-note {
  margin-bottom: 0.5rem;
  font-style: italic;
}

.toggle-icon {
  font-size: 0.75rem;
  color: #6b7280;
}

.filter-status {
  display: flex;
  justify-content: center;
  padding: 1rem 0;
  color: #6b7280;
}

.filter-note {
  margin-top: 1rem;
  padding-top: 0.5rem;
  border-top: 1px solid #e5e7eb;
}

.sector-list {
  max-height: 200px;
  overflow-y: auto;
}

.sector-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  cursor: pointer;
}

.sector-item:hover {
  color: #10b981;
}

.sector-item.selected {
  color: #10b981;
  font-weight: 500;
}

.checkbox {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1rem;
  height: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  margin-right: 0.75rem;
}

.selected .checkbox {
  background-color: #10b981;
  border-color: #10b981;
}

.checkmark {
  color: white;
  font-size: 0.75rem;
  line-height: 1;
}

.sector-name {
  font-size: 0.875rem;
}

.selection-count {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: normal;
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
