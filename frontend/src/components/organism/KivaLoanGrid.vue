<script setup lang="ts">
import { computed, ref, onMounted, watchEffect } from 'vue';
import { KivaText, Spinner } from '../atoms';
import FilterPanel from '../molecule/FilterPanel.vue';
import KivaLoanCard from '../molecule/KivaLoanCard.vue';
import type { LoanFilters } from '@/models/filters';
import type { Loan } from '@/models/Loan';
import { useLoan } from '@/composables/useLoan';

/**
 * Grid component for displaying Kiva loans
 *
 * This component:
 * - Loads loan data using the useLoan composable
 * - Displays loans in a responsive grid layout
 * - Shows loading state when fetching data
 * - Shows empty state when no loans are found
 * - Provides filtering capabilities
 */

// Props
interface Props {
  /** Si es true, se muestra el título por defecto */
  title?: string;
  /** Número de préstamos por página */
  perPage?: number;
  /** Si es true, se muestra el filtro */
  showFilter?: boolean;
  /** Filtros iniciales */
  initialFilters?: LoanFilters;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Kiva Loans',
  perPage: 6,
  showFilter: true,
  initialFilters: () => ({}),
});

// Estado
const filters = ref<LoanFilters>(props.initialFilters || {});
const currentPage = ref(1);
const isLoading = ref(true);

// Composable de préstamos
const { 
  loans, 
  totalCount, 
  loadLoans, 
  loadFilterOptions,
  availableSectors,
  loadingFilters,
  loadingLoans,
  availableCountries,
  updateFilters
} = useLoan();

// Cargar datos al montar el componente
onMounted(async () => {
  isLoading.value = true;
  
  // Cargar opciones de filtros (sectores)
  await loadFilterOptions();
  
  // Cargar préstamos
  await loadLoans(1);
  
  isLoading.value = false;
});

// Observar cambios en los filtros para recargar los préstamos
watchEffect(async () => {
  // Siempre recargar los préstamos cuando cambian los filtros (incluido cuando están vacíos)
  console.log('Filtrando préstamos con:', filters.value);
  isLoading.value = true;
  currentPage.value = 1; // Resetear a la primera página
  
  // Actualizar los filtros en el composable
  await updateFilters(filters.value);
  
  isLoading.value = false;
});

// Computar índices de préstamos para la página actual
const paginatedLoans = computed(() => {
  return loans.value;
});

// Computar número total de páginas
const totalPages = computed(() => {
  return Math.ceil(totalCount.value / props.perPage);
});

// Cambiar de página
const changePage = async (newPage: number) => {
  if (newPage < 1 || newPage > totalPages.value) return;
  
  isLoading.value = true;
  currentPage.value = newPage;
  
  await loadLoans(newPage);
  
  isLoading.value = false;
};

// Aplicar filtros
const applyFilters = async (newFilters: LoanFilters) => {
  console.log('Aplicando filtros:', newFilters);
  
  // Actualizar los filtros locales
  filters.value = { ...newFilters };
  
  // Establecer loading state
  isLoading.value = true;
  
  // Resetear a la primera página cuando cambian los filtros
  currentPage.value = 1;
  
  // Actualizar los filtros en el composable
  await updateFilters(filters.value);
  
  // Finalizar loading state
  isLoading.value = false;
  
  console.log('Préstamos filtrados cargados:', filters.value);
};

// Calcular contadores de préstamos activos por país
const activeLoanCounts = computed(() => {
  const counts: Record<string, number> = {};
  loans.value.forEach(loan => {
    const isoCode = loan.geocode?.country?.isoCode;
    if (isoCode) {
      counts[isoCode] = (counts[isoCode] || 0) + 1;
    }
  });
  return counts;
});
</script>

<template>
  <div class="kiva-loan-grid">
    <div class="kiva-loan-grid__header">
      <KivaText variant="h2" size="xl">{{ title }}</KivaText>
      <div v-if="totalCount > 0" class="kiva-loan-grid__count">
        <KivaText size="md">{{ totalCount }} loans available</KivaText>
      </div>
    </div>
    
    <div class="kiva-loan-grid__content">
      <!-- Panel de filtros (opcional) -->
      <div v-if="showFilter" class="kiva-loan-grid__filters">
        <FilterPanel
          v-model:filters="filters"
          @filter="applyFilters"
          :active-loan-counts="activeLoanCounts"
        />
      </div>
      
      <!-- Grid de préstamos -->
      <div class="kiva-loan-grid__cards">
        <!-- Loader -->
        <div v-if="isLoading" class="kiva-loan-grid__loading">
          <Spinner size="lg" />
        </div>
        
        <!-- Sin resultados -->
        <div v-else-if="loans.length === 0" class="kiva-loan-grid__empty">
          <KivaText size="lg">No loans found</KivaText>
          <KivaText v-if="Object.keys(filters).length > 0" size="md">Try adjusting your filters</KivaText>
        </div>
        
        <!-- Lista de préstamos -->
        <template v-else>
          <div class="kiva-loan-grid__grid">
            <KivaLoanCard
              v-for="loan in paginatedLoans"
              :key="loan.id"
              :loan="loan"
            />
          </div>
          
          <!-- Paginación -->
          <div v-if="totalPages > 1" class="kiva-loan-grid__pagination">
            <button 
              class="pagination-button"
              :disabled="currentPage === 1"
              @click="changePage(currentPage - 1)"
            >
              &laquo; Previous
            </button>
            
            <div class="pagination-info">
              Page {{ currentPage }} of {{ totalPages }}
            </div>
            
            <button 
              class="pagination-button"
              :disabled="currentPage === totalPages"
              @click="changePage(currentPage + 1)"
            >
              Next &raquo;
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kiva-loan-grid {
  width: 100%;
  font-family: var(--kiva-font-family, 'Arial, sans-serif');
}

.kiva-loan-grid__header {
  margin-bottom: 2rem;
}

.kiva-loan-grid__count {
  margin-top: 0.5rem;
  color: var(--kiva-text-secondary, #6b7280);
}

.kiva-loan-grid__content {
  display: flex;
  gap: 2rem;
}

.kiva-loan-grid__filters {
  flex: 0 0 auto;
  width: 250px;
}

.kiva-loan-grid__cards {
  flex: 1;
}

.kiva-loan-grid__loading,
.kiva-loan-grid__empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  text-align: center;
}

.kiva-loan-grid__empty {
  color: var(--kiva-text-secondary, #6b7280);
}

.kiva-loan-grid__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.kiva-loan-grid__pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.pagination-button {
  background-color: white;
  border: 1px solid #d1d5db;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
}

.pagination-button:hover:not(:disabled) {
  background-color: #f9fafb;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 0.875rem;
  color: var(--kiva-text-secondary, #6b7280);
}

/* Responsive */
@media (max-width: 767px) {
  .kiva-loan-grid__content {
    flex-direction: column;
  }
  
  .kiva-loan-grid__filters {
    width: 100%;
    margin-bottom: 1.5rem;
  }
  
  .kiva-loan-grid__grid {
    grid-template-columns: 1fr;
  }
}
</style>
