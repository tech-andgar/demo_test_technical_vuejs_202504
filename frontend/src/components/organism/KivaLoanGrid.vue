<script setup lang="ts">
import { computed, ref, onMounted, watchEffect } from 'vue';
import { KivaText, KivaSpinner } from '../atoms';
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
  /** If true, the default title is shown */
  title?: string;
  /** Number of loans per page */
  perPage?: number;
  /** If true, the filter is shown */
  showFilter?: boolean;
  /** Initial filters */
  initialFilters?: LoanFilters;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Kiva Loans',
  perPage: 6,
  showFilter: true,
  initialFilters: () => ({}),
});

// State
const filters = ref<LoanFilters>(props.initialFilters || {});
const currentPage = ref(1);
const isLoading = ref(true);

// Loan composable
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

// Load data when the component is mounted
onMounted(async () => {
  isLoading.value = true;
  
  // Load filter options (sectors)
  await loadFilterOptions();
  
  // Load loans
  await loadLoans(1);
  
  isLoading.value = false;
});

// Watch for changes in filters to reload loans
watchEffect(async () => {
  // Always reload loans when filters change (including when they are empty)
  console.log('Filtering loans with:', filters.value);
  isLoading.value = true;
  currentPage.value = 1; // Reset to the first page
  
  // Update filters in the composable
  await updateFilters(filters.value);
  
  isLoading.value = false;
});

// Calculate paginated loan indices for current page
const paginatedLoans = computed(() => {
  return loans.value;
});

// Calculate total number of pages
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

// Apply filters
const applyFilters = async (newFilters: LoanFilters) => {
  console.log('Applying filters:', newFilters);
  
  // Update local filters
  filters.value = { ...newFilters };
  
  // Set loading state
  isLoading.value = true;
  
  // Reset to first page when filters change
  currentPage.value = 1;
  
  // Update filters in composable
  await updateFilters(filters.value);
  
  // End loading state
  isLoading.value = false;
  
  console.log('Filtered loans loaded:', filters.value);
};

// Calculate active loan counts by country
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
      <!-- Filter panel (optional) -->
      <div v-if="showFilter" class="kiva-loan-grid__filters">
        <FilterPanel
          v-model:filters="filters"
          @filter="applyFilters"
          :active-loan-counts="activeLoanCounts"
        />
      </div>
      
      <!-- Loan grid -->
      <div class="kiva-loan-grid__cards">
        <!-- Loader -->
        <div v-if="isLoading" class="kiva-loan-grid__loading">
          <KivaSpinner size="lg" />
        </div>
        
        <!-- No results -->
        <div v-else-if="loans.length === 0" class="kiva-loan-grid__empty">
          <KivaText size="lg">No loans found</KivaText>
          <KivaText v-if="Object.keys(filters).length > 0" size="md">Try adjusting your filters</KivaText>
        </div>
        
        <!-- Loan list -->
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
