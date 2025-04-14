<script setup lang="ts">
import { useLoan } from '@/composables/useLoan';
import { onMounted, ref } from 'vue';
import BaseFilter from './BaseFilter.vue';

/**
 * Component for filtering loans by country
 *
 * Uses the generic base component BaseFilter to display
 * a dropdown list of available countries
 */

// Props
interface Props {
  /** Show the loan counter next to the country name */
  showCount?: boolean;
  /** List of preselected countries */
  selectedCountries?: string[];
  /** Text to display when no countries are selected */
  placeholder?: string;
  /** If the component is disabled */
  disabled?: boolean;
  /** Counter of active loans by country */
  activeLoanCounts?: Record<string, number>;
  /** Unique identifier for the filter */
  filterId?: string;
  /** If the dropdown is open (externally controlled) */
  isDropdownOpen?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showCount: true,
  selectedCountries: () => [],
  placeholder: 'Select countries',
  disabled: false,
  activeLoanCounts: () => ({}),
  filterId: 'country',
  isDropdownOpen: false,
});

// Emits
const emit = defineEmits<{
  /** Emitted when the country selection changes */
  (e: 'update:selectedCountries', countries: string[]): void;
  /** Emitted when the filter is applied */
  (e: 'filter', countries: string[]): void;
  /** Emitted when the dropdown state changes */
  (e: 'toggle-dropdown', isOpen: boolean, filterId: string): void;
}>();

// Composable to access loan functionality
const { availableCountries, loadFilterOptions, loadingFilters } = useLoan();

// Local state for error handling
const error = ref<string | null>(null);

// Load options when the component is mounted
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

// Function to transform country data to the base filter format
const getCountriesForFilter = () => {
  if (error.value) {
    return [];
  }

  return availableCountries.value.map((country) => ({
    id: country.isoCode || country.name,
    name: country.name,
    count: country.count,
  }));
};

// Handling events from BaseFilter
const handleUpdateSelection = (selection: (string | number)[]) => {
  emit(
    'update:selectedCountries',
    selection.map((item) => String(item))
  );
};

const handleApplyFilter = (selection: (string | number)[]) => {
  emit(
    'filter',
    selection.map((item) => String(item))
  );
};

// Handle dropdown toggle event
const handleToggleDropdown = (isOpen: boolean, filterId: string) => {
  emit('toggle-dropdown', isOpen, filterId);
};

// Retry loading in case of error
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
      :filter-id="filterId"
      :is-dropdown-open="isDropdownOpen"
      loading-message="Loading countries..."
      empty-message="No countries available"
      @update:selection="handleUpdateSelection"
      @apply="handleApplyFilter"
      @toggle-dropdown="handleToggleDropdown"
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
