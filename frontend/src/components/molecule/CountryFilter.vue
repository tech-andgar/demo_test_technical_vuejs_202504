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
}

const props = withDefaults(defineProps<Props>(), {
  showCount: true,
  selectedCountries: () => [],
  placeholder: 'Select countries'
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

// Mapeo de nombres de países a códigos ISO
const getIsoCode = (countryName: string): string | undefined => {
  const country = availableCountries.value.find(c => c.name === countryName);
  return country?.isoCode;
};

// Cargar opciones al montar el componente
onMounted(() => {
  loadFilterOptions();
});

// Gestiona la selección/deselección de un país
const toggleCountry = (countryName: string) => {
  if (selectedOptions.value.includes(countryName)) {
    selectedOptions.value = selectedOptions.value.filter(c => c !== countryName);
  } else {
    selectedOptions.value.push(countryName);
  }
  
  emit('update:selectedCountries', selectedOptions.value);
};

// Aplica el filtro actual
const applyFilter = () => {
  // Convierte nombres de países a códigos ISO para la API
  const countryIsoCodes = selectedOptions.value
    .map(name => getIsoCode(name))
    .filter(code => code !== undefined) as string[];
  
  emit('filter', countryIsoCodes);
  isOpen.value = false;
};

// Limpia todos los filtros
const clearFilter = () => {
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
  <div class="country-filter">
    <div class="filter-header" @click="isOpen = !isOpen">
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
    
    <div v-if="isOpen" class="dropdown-container">
      <div v-if="loadingFilters" class="loading-message">
        <KivaText>Loading countries...</KivaText>
      </div>
      
      <div v-else-if="availableCountries.length === 0" class="empty-message">
        <KivaText>No countries available</KivaText>
      </div>
      
      <div v-else class="country-list">
        <div 
          v-for="country in availableCountries" 
          :key="country.name"
          @click="toggleCountry(country.name)"
          class="country-item"
          :class="{ 'selected': isSelected(country.name) }"
        >
          <div class="checkbox">
            <span v-if="isSelected(country.name)" class="checkmark">✓</span>
          </div>
          <span class="country-name">{{ country.name }}</span>
          <span v-if="props.showCount && country.count" class="country-count">
            ({{ country.count }})
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
</style> 
