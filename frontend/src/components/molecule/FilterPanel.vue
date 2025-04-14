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

// Sectores seleccionados (array para multiselección)
const selectedSectors = ref<number[]>([]);
// Países seleccionados
const selectedCountries = ref<string[]>([]);

// Inicializar selecciones basadas en los filtros iniciales
if (props.filters?.sector) {
  if (typeof props.filters.sector === 'number') {
    selectedSectors.value = [props.filters.sector];
  } else if (Array.isArray(props.filters.sector)) {
    selectedSectors.value = [...props.filters.sector];
  }
}

if (props.filters?.country) {
  if (typeof props.filters.country === 'string') {
    selectedCountries.value = [props.filters.country];
  } else if (Array.isArray(props.filters.country)) {
    selectedCountries.value = [...props.filters.country];
  }
}

// Actualiza el filtro de sectores
const updateSectorFilters = (sectors: number[]) => {
  console.log('Actualizando filtros con sectores IDs:', sectors);
  
  // Si no hay sectores seleccionados, establecer sector como undefined
  // Si hay un solo sector, establecer como número
  // Si hay múltiples sectores, establecer como array
  const sectorValue = sectors.length === 0 
    ? undefined 
    : sectors.length === 1 
      ? sectors[0] 
      : sectors;
  
  currentFilters.value = {
    ...currentFilters.value,
    sector: sectorValue
  };
  
  emit('update:filters', currentFilters.value);
  emit('filter', currentFilters.value);
};

// Actualiza el filtro de países
const updateCountryFilters = (countries: string[]) => {
  console.log('Actualizando filtros con países:', countries);
  
  // Si no hay países seleccionados, establecer country como undefined
  // Si hay un solo país, establecer como string
  // Si hay múltiples países, establecer como array
  const countryValue = countries.length === 0 
    ? undefined 
    : countries.length === 1 
      ? countries[0] 
      : countries;
  
  currentFilters.value = {
    ...currentFilters.value,
    country: countryValue
  };
  
  emit('update:filters', currentFilters.value);
  emit('filter', currentFilters.value);
};

// Limpia todos los filtros
const clearAllFilters = () => {
  // Vaciar el array de sectores seleccionados primero
  selectedSectors.value = [];
  selectedCountries.value = [];
  
  // Crear un nuevo objeto vacío para los filtros
  currentFilters.value = {};
  
  // Emitir los eventos con los valores actualizados
  emit('update:filters', {});
  emit('filter', {});
  
  // Log para verificar que se está ejecutando la función
  console.log('Todos los filtros han sido limpiados');
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
          v-if="selectedSectors.length > 0 || selectedCountries.length > 0"
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
          :selected-sectors="selectedSectors"
          @update:selected-sectors="selectedSectors = $event"
          @filter="updateSectorFilters"
          placeholder="Sector"
        />
      </div>
      
      <!-- Filtro de países -->
      <div class="filter-section">
        <CountryFilter
          :selected-countries="selectedCountries"
          @update:selected-countries="selectedCountries = $event"
          @filter="updateCountryFilters"
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
