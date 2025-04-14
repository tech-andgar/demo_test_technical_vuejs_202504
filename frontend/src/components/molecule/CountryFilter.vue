<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BaseFilter from './BaseFilter.vue';
import { useLoan } from '@/composables/useLoan';

/**
 * Componente para filtrar préstamos por país
 * 
 * Utiliza el componente base genérico BaseFilter para mostrar
 * una lista desplegable de países disponibles
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

// Estado local para manejo de errores
const error = ref<string | null>(null);

// Cargar opciones al montar el componente
onMounted(async () => {
  try {
    if (availableCountries.value.length === 0) {
      await loadFilterOptions();
    }
  } catch (err) {
    error.value = 'Error loading countries. Please try again.';
    console.error('Error loading countries:', err);
  }
});

// Función para transformar datos de países al formato del filtro base
const getCountriesForFilter = () => {
  if (error.value) {
    return [];
  }
  
  return availableCountries.value.map(country => ({
    id: country.isoCode || country.name,
    name: country.name,
    count: country.count
  }));
};

// Handling events from BaseFilter
const handleUpdateSelection = (selection: any[]) => {
  emit('update:selectedCountries', selection);
};

const handleApplyFilter = (selection: any[]) => {
  emit('filter', selection);
};

// Reintentar carga en caso de error
const retryLoading = async () => {
  error.value = null;
  try {
    await loadFilterOptions();
  } catch (err) {
    error.value = 'Error loading countries. Please try again.';
    console.error('Error retrying countries load:', err);
  }
};
</script>

<template>
  <div>
    <BaseFilter
      :items="getCountriesForFilter()"
      :selected-items="selectedCountries"
      :placeholder="placeholder"
      :disabled="disabled"
      :loading="loadingFilters"
      :show-count="showCount"
      loading-message="Loading countries..."
      empty-message="No countries available"
      @update:selection="handleUpdateSelection"
      @apply="handleApplyFilter"
    />
    
    <!-- Error handling outside BaseFilter -->
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
      <button class="retry-button" @click="retryLoading">Retry</button>
    </div>
  </div>
</template>

<style scoped>
.error-message {
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 0.375rem;
  color: #ef4444;
  font-size: 0.875rem;
  text-align: center;
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
