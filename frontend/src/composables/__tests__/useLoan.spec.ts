import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useLoan } from '../useLoan';
import { fetchLoans, fetchLoanById } from '@/services/api';
import { Loan } from '@/models/Loan';
import { APIError } from '@/services/errors/apiErrors';

vi.mock('@/services/api', () => ({
  fetchLoans: vi.fn(),
  fetchLoanById: vi.fn()
}));

describe('useLoan', () => {
  const defaultLoan = {
    id: 1,
    name: 'Test Loan',
    loanAmount: 1000,
    status: 'fundraising',
    sector: { name: 'Agriculture' },
    geocode: { country: { name: 'United States' } },
    image: { url: 'https://example.com/image.jpg' }
  };

  const createMockLoan = (overrides = {}) => {
    return new Loan({ ...defaultLoan, ...overrides });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loadLoans', () => {
    it('should handle API errors', async () => {
      vi.mocked(fetchLoans).mockRejectedValueOnce(new APIError('Test error'));
      const { loadLoans, error } = useLoan();
      await loadLoans(1);
      expect(error.value).toBeInstanceOf(Error);
    });

    it('should handle successful loan fetch', async () => {
      const mockLoans = [createMockLoan()];
      vi.mocked(fetchLoans).mockResolvedValueOnce({
        loans: mockLoans,
        total: 1
      });
      const { loadLoans, loans } = useLoan();
      await loadLoans(1);
      expect(loans.value).toEqual(mockLoans);
    });

    it('should handle network errors', async () => {
      vi.mocked(fetchLoans).mockRejectedValueOnce(new Error('Network error'));
      const { loadLoans, error } = useLoan();
      await loadLoans(1);
      expect(error.value).toBeInstanceOf(Error);
    });
  });
});
