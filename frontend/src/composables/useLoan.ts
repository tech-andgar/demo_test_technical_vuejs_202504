import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { fetchLoans, fetchLoanById } from '@/services/api';
import { Loan } from '@/models';

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

  /**
   * Fetches a page of loans from the API
   *
   * @param limit - Maximum number of loans to retrieve
   * @param offset - Number of loans to skip (for pagination)
   * @returns Promise containing an array of loan objects
   */
  const getLoans = async (limit: number = 12, offset: number = 0): Promise<Loan[]> => {
    try {
      loadingLoans.value = true;
      const { loans, totalCount } = await fetchLoans(limit, offset);
      return loans;
    } catch (error) {
      console.error(error);
      throw error;
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
      const offset = (page - 1) * 12;
      const fetchedLoans = await getLoans(12, offset);
      loans.value = fetchedLoans;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    loans,
    loadLoans,
    loadingLoans,
  };
};
