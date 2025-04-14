import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { fetchLoans, fetchLoanById, type Loan } from '@/services/api';

export const useLoan = () => {
  const route = useRoute();
  const loans = ref<Loan[]>([]);
  const loadingLoans = ref<boolean>(false);

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
