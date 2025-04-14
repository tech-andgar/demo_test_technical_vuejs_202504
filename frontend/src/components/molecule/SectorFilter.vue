<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { KivaText } from '../atoms';
import { useLoan } from '@/composables/useLoan';

/**
 * Componente para filtrar préstamos por sector
 * 
 * Muestra una lista desplegable de sectores disponibles obtenidos de la API
 * Emite eventos cuando se selecciona un sector
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

// Estado local
const selectedOptions = ref<number[]>(props.selectedSectors || []);
const isOpen = ref(false);

// Cargar opciones al montar el componente
onMounted(() => {
  loadFilterOptions();
});

// Gestiona la selección/deselección de un sector
const toggleSector = (sectorId: number) => {
  if (selectedOptions.value.includes(sectorId)) {
    selectedOptions.value = selectedOptions.value.filter(id => id !== sectorId);
  } else {
    selectedOptions.value.push(sectorId);
  }
};

// Aplica el filtro actual
const applyFilter = () => {
  emit('update:selectedSectors', selectedOptions.value);
  emit('filter', selectedOptions.value);
  isOpen.value = false;
};

// Limpia todos los filtros
const clearFilter = () => {
  selectedOptions.value = [];
  emit('update:selectedSectors', []);
  emit('filter', []);
  isOpen.value = false;
};

// Determina si un sector está seleccionado
const isSelected = (sectorId: number): boolean => {
  return selectedOptions.value.includes(sectorId);
};
</script>

<template>
  <div class="sector-filter" :class="{ 'disabled': props.disabled }">
    <div class="filter-header" @click="!props.disabled && (isOpen = !isOpen)">
      <KivaText variant="h6" size="md">
        {{ props.placeholder }}
        <span v-if="selectedOptions.length > 0" class="selected-count">
          ({{ selectedOptions.length }})
        </span>
      </KivaText>
      <span class="toggle-icon">
        {{ isOpen ? '▲' : '▼' }}
      </span>
    </div>
    
    <div v-if="isOpen && !props.disabled" class="dropdown-container">
      <div v-if="loadingFilters" class="loading-message">
        <KivaText>Loading sectors...</KivaText>
      </div>
      
      <div v-else-if="availableSectors.length === 0" class="empty-message">
        <KivaText>No sectors available</KivaText>
      </div>
      
      <div v-else class="sector-list">
        <div 
          v-for="sector in availableSectors" 
          :key="sector.id"
          @click="toggleSector(sector.id!)"
          class="sector-item"
          :class="{ 'selected': isSelected(sector.id!) }"
        >
          <div class="checkbox">
            <span v-if="isSelected(sector.id!)" class="checkmark">✓</span>
          </div>
          <span class="sector-name">{{ sector.name }}</span>
          <span v-if="props.showCount && sector.count" class="sector-count">
            ({{ sector.count }})
          </span>
        </div>
      </div>
      
      <div class="filter-actions">
        <button class="btn-clear" @click="clearFilter">Clear</button>
        <button class="btn-apply" @click="applyFilter">Apply</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sector-filter {
  position: relative;
  width: 100%;
  max-width: 300px;
  font-family: var(--kiva-font-family, 'Arial, sans-serif');
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.toggle-icon {
  font-size: 0.75rem;
  color: #6b7280;
}

.selected-count {
  font-size: 0.875rem;
  color: #10b981;
  margin-left: 0.25rem;
}

.dropdown-container {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 300px;
  margin-top: 0.25rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 10;
}

.loading-message,
.empty-message {
  padding: 1rem;
  text-align: center;
  color: #6b7280;
}

.sector-list {
  max-height: 220px;
  overflow-y: auto;
  padding: 0.5rem 0;
}

.sector-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.sector-item:hover {
  background-color: #f9fafb;
}

.sector-item.selected {
  background-color: #ecfdf5;
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
  flex: 1;
  font-size: 0.875rem;
}

.sector-count {
  font-size: 0.75rem;
  color: #6b7280;
  margin-left: 0.5rem;
}

.filter-actions {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-top: 1px solid #e5e7eb;
}

.btn-clear,
.btn-apply {
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
}

.btn-clear {
  background-color: white;
  border: 1px solid #d1d5db;
  color: #6b7280;
}

.btn-apply {
  background-color: #10b981;
  border: 1px solid #10b981;
  color: white;
}

.btn-clear:hover {
  background-color: #f9fafb;
}

.btn-apply:hover {
  background-color: #059669;
}

.sector-filter.disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.sector-filter.disabled .filter-header {
  cursor: not-allowed;
  background-color: #f3f4f6;
}
</style> 
