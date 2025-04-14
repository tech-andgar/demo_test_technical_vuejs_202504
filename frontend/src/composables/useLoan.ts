import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { fetchLoans, fetchLoanById, APIError, NetworkError, DataFormatError } from '@/services/api';
import type { Loan } from '@/models/Loan';

/**
 * Composable for managing loan data and state
 *
 * Provides functionality to:
 * - Load loans from the API
 * - Track loading state
 * - Manage loan data
 *
 * @returns Object containing loan data, loading state, and methods to load loans
 */
export const useLoan = () => {
  const route = useRoute();
  const loans = ref<Loan[]>([]);
  const loadingLoans = ref<boolean>(false);
  const error = ref<Error | null>(null);
  const errorMessage = ref<string>('');

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

    if (err instanceof NetworkError) {
      error.value = err;
      errorMessage.value =
        'We could not connect to the server. Please check your internet connection.';
      console.error('Network error:', err.message, err.originalError);
    } else if (err instanceof DataFormatError) {
      error.value = err;
      errorMessage.value = 'We received unexpected data from the server. Please try again.';
      console.error('Data format error:', err.message, err.data);
    } else if (err instanceof APIError) {
      error.value = err;
      errorMessage.value =
        'An error occurred while processing your request. Please try again later.';
      console.error('API error:', err.message, err.status, err.details);
    } else if (err instanceof Error) {
      error.value = err;
      errorMessage.value = 'An unexpected error occurred. Please try again.';
      console.error('Unexpected error:', err);
    } else {
      error.value = new Error('Unknown error');
      errorMessage.value = 'An unknown error occurred. Please try again.';
      console.error('Unknown error:', err);
    }

    return { error: error.value, message: errorMessage.value };
  };

  /**
   * Fetches a page of loans from the API
   *
   * @param limit - Maximum number of loans to retrieve
   * @param offset - Number of loans to skip (for pagination)
   * @returns Promise containing an array of loan objects
   */
  const getLoans = async (limit: number = 12, offset: number = 0): Promise<Loan[]> => {
    try {
      resetError();
      loadingLoans.value = true;
      const { loans, totalCount } = await fetchLoans(limit, offset);
      return loans;
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
  const loadLoans = async (page: number = 1) => {
    try {
      resetError();
      const offset = (page - 1) * 12;
      const fetchedLoans = await getLoans(12, offset);
      loans.value = fetchedLoans;
    } catch (err) {
      handleError(err);
      loans.value = [];
    }
  };

  // Function to retry the last operation
  const retry = () => {
    return loadLoans();
  };

  return {
    loans,
    loadLoans,
    loadingLoans,
    error,
    errorMessage,
    retry,
  };
};
