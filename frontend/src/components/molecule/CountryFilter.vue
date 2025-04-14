<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { KivaText } from '../atoms';
import { useLoan } from '@/composables/useLoan';

/**
 * Componente para filtrar préstamos por país
 * 
 * Muestra una lista desplegable de países disponibles obtenidos de la API
 * Emite eventos cuando se selecciona un país
 */

// Props
interface Props {
  /** Mostrar el contador de préstamos junto al nombre del país */
  showCount?: boolean;
  /** Lista de países preseleccionados */
  selectedCountries?: string[];
  /** Texto a mostrar cuando no hay países seleccionados */
  placeholder?: string;
  /** Si el componente está deshabilitado */
  disabled?: boolean;
  /** Contador de préstamos activos por país */
  activeLoanCounts?: Record<string, number>;
}

interface Country {
  name: string;
  isoCode?: string;
  region?: string;
  count?: number;
}

const props = withDefaults(defineProps<Props>(), {
  showCount: true,
  selectedCountries: () => [],
  placeholder: 'Select countries',
  disabled: false,
  activeLoanCounts: () => ({})
});

// Emits
const emit = defineEmits<{
  /** Emitido cuando cambia la selección de países */
  (e: 'update:selectedCountries', countries: string[]): void;
  /** Emitido cuando se aplica el filtro */
  (e: 'filter', countries: string[]): void;
}>();

// Composable para acceder a la funcionalidad de préstamos
const { availableCountries, loadFilterOptions, loadingFilters } = useLoan();

// Estado local
const selectedOptions = ref<string[]>(props.selectedCountries || []);
const isOpen = ref(false);
const error = ref<string | null>(null);

// Mapeo de nombres de países a códigos ISO
const getIsoCode = (countryName: string): string | undefined => {
  const country = availableCountries.value.find(c => c.name === countryName);
  return country?.isoCode;
};

// Cargar opciones al montar el componente
onMounted(async () => {
  try {
    await loadFilterOptions();
  } catch (err) {
    error.value = 'Error loading countries. Please try again.';
    console.error('Error loading countries:', err);
  }
});

// Toggle country selection
const toggleCountry = (country: Country) => {
  console.log('Toggle country:', country);
  const index = selectedOptions.value.indexOf(country.isoCode || '');
  if (index === -1) {
    selectedOptions.value.push(country.isoCode || '');
  } else {
    selectedOptions.value.splice(index, 1);
  }
  console.log('Selected countries:', selectedOptions.value);
  applyFilters();
};

// Apply filters
const applyFilters = () => {
  console.log('Applying country filters:', selectedOptions.value);
  emit('update:selectedCountries', selectedOptions.value);
  emit('filter', selectedOptions.value);
};

// Clear filters
const clearFilters = () => {
  console.log('Clearing country filters');
  selectedOptions.value = [];
  emit('update:selectedCountries', []);
  emit('filter', []);
};

// Determina si un país está seleccionado
const isSelected = (countryName: string): boolean => {
  return selectedOptions.value.includes(countryName);
};
</script>

<template>
  <div class="country-filter" :class="{ 'disabled': props.disabled }">
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
        <KivaText>Loading countries...</KivaText>
      </div>
      
      <div v-else-if="error" class="error-message">
        <KivaText>{{ error }}</KivaText>
        <button class="retry-button" @click="loadFilterOptions">Retry</button>
      </div>
      
      <div v-else-if="availableCountries.length === 0" class="empty-message">
        <KivaText>No countries available</KivaText>
      </div>
      
      <div v-else class="country-list">
        <div 
          v-for="country in availableCountries" 
          :key="country.name"
          @click="toggleCountry(country)"
          class="country-item"
          :class="{ 'selected': isSelected(country.name) }"
        >
          <div class="checkbox">
            <span v-if="isSelected(country.name)" class="checkmark">✓</span>
          </div>
          <span class="country-name">{{ country.name }}</span>
          <span v-if="props.showCount && props.activeLoanCounts[country.isoCode || '']" class="country-count">
            ({{ props.activeLoanCounts[country.isoCode || ''] }})
          </span>
        </div>
      </div>
      
      <div class="filter-actions">
        <button class="btn-clear" @click="clearFilters">Clear</button>
        <button class="btn-apply" @click="applyFilters">Apply</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.country-filter {
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

.country-list {
  max-height: 220px;
  overflow-y: auto;
  padding: 0.5rem 0;
}

.country-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.country-item:hover {
  background-color: #f9fafb;
}

.country-item.selected {
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

.country-name {
  flex: 1;
  font-size: 0.875rem;
}

.country-count {
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
  font-size: 0.875rem;
  border-radius: 0.25rem;
  cursor: pointer;
}

.btn-clear {
  background-color: transparent;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.btn-apply {
  background-color: #10b981;
  color: white;
  border: none;
}

.btn-apply:hover {
  background-color: #059669;
}

.btn-clear:hover {
  background-color: #f9fafb;
}

.country-filter.disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.country-filter.disabled .filter-header {
  cursor: not-allowed;
  background-color: #f3f4f6;
}

.error-message {
  padding: 1rem;
  text-align: center;
  color: #ef4444;
}

.retry-button {
  margin-top: 0.5rem;
  padding: 0.25rem 0.5rem;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.retry-button:hover {
  background-color: #dc2626;
}
</style> 
