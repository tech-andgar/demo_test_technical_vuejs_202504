<script setup lang="ts">
import { ref } from 'vue';
import { KivaText } from '../atoms';
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
}

const props = withDefaults(defineProps<Props>(), {
  filters: () => ({}),
  title: 'Filter Results'
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

// Inicializar selecciones basadas en los filtros iniciales
if (props.filters?.sector) {
  if (typeof props.filters.sector === 'number') {
    selectedSectors.value = [props.filters.sector];
  } else if (Array.isArray(props.filters.sector)) {
    selectedSectors.value = [...props.filters.sector];
  }
}

// Actualiza el filtro de sectores
const updateSectorFilters = () => {
  console.log('Actualizando filtros con sectores IDs:', selectedSectors.value);
  
  // Si no hay sectores seleccionados, establecer sector como undefined
  // Si hay un solo sector, establecer como número
  // Si hay múltiples sectores, establecer como array
  const sectorValue = selectedSectors.value.length === 0 
    ? undefined 
    : selectedSectors.value.length === 1 
      ? selectedSectors.value[0] 
      : selectedSectors.value;
  
  currentFilters.value = {
    ...currentFilters.value,
    sector: sectorValue
  };
  
  emit('update:filters', currentFilters.value);
  emit('filter', currentFilters.value);
};

// Limpia todos los filtros
const clearAllFilters = () => {
  // Vaciar el array de sectores seleccionados primero
  selectedSectors.value = [];
  
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

// Alterna la selección de un sector
const toggleSector = (sectorId: number) => {
  const index = selectedSectors.value.indexOf(sectorId);
  if (index === -1) {
    // Si no está seleccionado, agregarlo
    selectedSectors.value.push(sectorId);
  } else {
    // Si ya está seleccionado, quitarlo
    selectedSectors.value.splice(index, 1);
  }
  updateSectorFilters();
};

// Verifica si un sector está seleccionado
const isSectorSelected = (sectorId: number): boolean => {
  return selectedSectors.value.includes(sectorId);
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
          v-if="selectedSectors.length > 0"
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
      <div class="filter-section" v-if="!loadingFilters">
        <KivaText variant="h6" size="md" class="section-title">
          Sector 
          <span v-if="selectedSectors.length > 0" class="selection-count">
            ({{ selectedSectors.length }} selected)
          </span>
        </KivaText>
        
        <div class="sector-list">
          <div 
            v-for="sector in availableSectors" 
            :key="sector.id"
            class="sector-item"
            :class="{ 'selected': isSectorSelected(sector.id!) }"
            @click="toggleSector(sector.id!)"
          >
            <div class="checkbox">
              <span v-if="isSectorSelected(sector.id!)" class="checkmark">✓</span>
            </div>
            <span class="sector-name">{{ sector.name }}</span>
          </div>
        </div>
      </div>
      
      <!-- Mensaje de limitación -->
      <div class="filter-note">
        <KivaText size="xs" color="muted">
          Note: Country filtering is not available through the current API.
        </KivaText>
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

.section-title {
  margin-bottom: 0.75rem;
  color: #374151;
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
