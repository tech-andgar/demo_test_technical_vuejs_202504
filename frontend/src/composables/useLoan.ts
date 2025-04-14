import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import {
  fetchLoans,
  fetchLoanById,
  fetchFilterOptions
} from '@/services/api';
import { APIError, NetworkError, DataFormatError } from '@/services/errors/apiErrors';
import type { LoanFilters } from '@/models/filters';
import type { Loan } from '@/models/Loan';
import { KIVA_API_URL } from '../config';
import type { Sector } from '@/models/sector';

// Interfaces for filter options
interface Country {
  name: string;
  isoCode?: string;
  region?: string;
  count?: number;
}

interface Sector {
  id?: number;
  name: string;
  count?: number;
}

/**
 * Composable for managing loan data and state
 *
 * Provides functionality to:
 * - Load loans from the API
 * - Filter and sort loans
 * - Track loading state
 * - Manage loan data
 *
 * @returns Object containing loan data, loading state, and methods to load loans
 */
export const useLoan = () => {
  const route = useRoute();
  const loans = ref<Loan[]>([]);
  const loadingLoans = ref<boolean>(false);
  const loadingFilters = ref<boolean>(false);
  const error = ref<Error | null>(null);
  const errorMessage = ref<string>('');
  const totalCount = ref<number>(0);
  const currentPage = ref<number>(1);
  const filters = ref<LoanFilters>({});
  const perPage = ref<number>(12);

  // Filter options
  const availableCountries = ref<Country[]>([]);
  const availableSectors = ref<Sector[]>([]);

  /**
   * Total number of pages based on total count and items per page
   */
  const totalPages = computed(() => {
    return Math.ceil(totalCount.value / perPage.value);
  });

  /**
   * Resets the error state
   */
  const resetError = () => {
    error.value = null;
    errorMessage.value = '';
  };

  /**
   * Handles different types of errors
   *
   * @param err - The error object to handle
   */
  const handleError = (err: unknown) => {
    loadingLoans.value = false;

    if (err instanceof Error) {
      error.value = err;
      
      // Mensaje genérico basado en el tipo de error 
      if (err.name === 'NetworkError') {
        errorMessage.value = 'We could not connect to the server. Please check your internet connection.';
        console.error('Network error:', err.message);
      } else if (err.name === 'DataFormatError') {
        errorMessage.value = 'We received unexpected data from the server. Please try again.';
        console.error('Data format error:', err.message);
      } else if (err.name === 'APIError') {
        errorMessage.value = 'An error occurred while processing your request. Please try again later.';
        console.error('API error:', err.message);
      } else {
        errorMessage.value = 'An unexpected error occurred. Please try again.';
        console.error('Unexpected error:', err);
      }
    } else {
      error.value = new Error('Unknown error');
      errorMessage.value = 'An unknown error occurred. Please try again.';
      console.error('Unknown error:', err);
    }

    return { error: error.value, message: errorMessage.value };
  };

  /**
   * Fetches available filter options from the API
   */
  const loadFilterOptions = async () => {
    try {
      resetError();
      loadingFilters.value = true;
      const options = await fetchFilterOptions();
      availableCountries.value = options.countries;
      availableSectors.value = options.sectors;
    } catch (err) {
      handleError(err);
    } finally {
      loadingFilters.value = false;
    }
  };

  /**
   * Fetches a page of loans from the API with filters
   *
   * @param limit - Maximum number of loans to retrieve
   * @param offset - Number of loans to skip (for pagination)
   * @param loanFilters - Optional filters to apply
   * @returns Promise containing an array of loan objects
   */
  const getLoans = async (
    limit: number = perPage.value,
    offset: number = 0,
    loanFilters?: LoanFilters
  ): Promise<Loan[]> => {
    try {
      resetError();
      loadingLoans.value = true;
      const { loans: fetchedLoans, totalCount: count } = await fetchLoans(
        limit,
        offset,
        loanFilters || filters.value
      );
      totalCount.value = count;
      return fetchedLoans as Loan[];
    } catch (err) {
      handleError(err);
      return [];
    } finally {
      loadingLoans.value = false;
    }
  };

  /**
   * Loads a specific page of loans into the loans ref
   *
   * @param page - Page number to load (starting from 1)
   */
  const loadLoans = async (page: number) => {
    try {
      loadingLoans.value = true;
      error.value = null;
      const offset = (page - 1) * perPage.value;
      const fetchedLoans = await getLoans(perPage.value, offset, filters.value);
      loans.value = fetchedLoans;
      totalCount.value = fetchedLoans.length;
      currentPage.value = page;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar los préstamos';
      console.error('Error loading loans:', err);
    } finally {
      loadingLoans.value = false;
    }
  };

  /**
   * Updates the currently applied filters and reloads loans
   *
   * @param newFilters - Filters to apply
   */
  const updateFilters = async (newFilters: LoanFilters) => {
    console.log('Actualizando filtros en useLoan:', newFilters);
    filters.value = { ...newFilters };
    return loadLoans(1); // Reset to page 1 with new filters
  };

  /**
   * Go to a specific page
   *
   * @param page - Page number to load
   */
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages.value) return;
    return loadLoans(page);
  };

  /**
   * Go to the next page
   */
  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      return goToPage(currentPage.value + 1);
    }
  };

  /**
   * Go to the previous page
   */
  const prevPage = () => {
    if (currentPage.value > 1) {
      return goToPage(currentPage.value - 1);
    }
  };

  /**
   * Clear all currently applied filters
   */
  const clearFilters = () => {
    filters.value = {};
    return loadLoans(1);
  };

  /**
   * Function to retry the last operation
   */
  const retry = () => {
    return loadLoans(currentPage.value);
  };

  // Initialize filter options when the composable is first used
  loadFilterOptions();

  // Observar cambios en los filtros
  watch(filters, () => {
    console.log('Filtros cambiados en useLoan:', filters.value);
    currentPage.value = 1; // Reset a la primera página cuando cambian los filtros
    loadLoans(1);
  }, { deep: true });

  return {
    // Data
    loans,
    filters,
    availableCountries,
    availableSectors,
    currentPage,
    totalCount,
    totalPages,
    perPage,

    // Loading states
    loadingLoans,
    loadingFilters,

    // Error handling
    error,
    errorMessage,

    // Methods
    loadLoans,
    loadFilterOptions,
    updateFilters,
    clearFilters,
    goToPage,
    nextPage,
    prevPage,
    retry,
  };
};
