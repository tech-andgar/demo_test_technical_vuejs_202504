import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchLoans, fetchLoanById } from '../api';
import { fetchGraphQL } from '../graphqlClient';
import { normalizeLoan } from '../mapper/loan';

vi.mock('../graphqlClient', () => ({
  fetchGraphQL: vi.fn(),
}));

vi.mock('../mapper/loan', () => ({
  normalizeLoan: vi.fn((loan) => loan),
}));

describe('API Services', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchLoans', () => {
    it('should fetch loans with default parameters', async () => {
      const mockGraphQLResponse = {
        lend: {
          loans: {
            totalCount: 2,
            values: [
              { id: 1, name: 'Loan 1' },
              { id: 2, name: 'Loan 2' },
            ],
          },
        },
      };

      vi.mocked(fetchGraphQL).mockResolvedValue(mockGraphQLResponse);

      const result = await fetchLoans();

      expect(fetchGraphQL).toHaveBeenCalledWith(expect.stringContaining('query GetLoans'), {
        limit: 12,
        offset: 0,
      });
      expect(result.loans).toEqual([
        { id: 1, name: 'Loan 1' },
        { id: 2, name: 'Loan 2' },
      ]);
      expect(result.totalCount).toBe(2);
      expect(normalizeLoan).toHaveBeenCalledTimes(2);
    });

    it('should fetch loans with custom parameters', async () => {
      const mockGraphQLResponse = {
        lend: {
          loans: {
            totalCount: 1,
            values: [{ id: 3, name: 'Loan 3' }],
          },
        },
      };

      vi.mocked(fetchGraphQL).mockResolvedValue(mockGraphQLResponse);

      const result = await fetchLoans(1, 24);

      expect(fetchGraphQL).toHaveBeenCalledWith(expect.stringContaining('query GetLoans'), {
        limit: 1,
        offset: 24,
      });
      expect(result.loans).toEqual([{ id: 3, name: 'Loan 3' }]);
      expect(result.totalCount).toBe(1);
    });
  });

  describe('fetchLoanById', () => {
    it('should fetch a single loan by ID', async () => {
      const mockLoan = {
        id: 1,
        name: 'Loan 1',
        loanAmount: 1000,
        loanFundraisingInfo: { fundedAmount: 500 },
        image: { url: 'http://example.com/image.jpg' },
        whySpecial: 'Special reason',
      };

      const mockGraphQLResponse = {
        lend: {
          loan: mockLoan,
        },
      };

      vi.mocked(fetchGraphQL).mockResolvedValue(mockGraphQLResponse);

      const result = await fetchLoanById(1);

      expect(fetchGraphQL).toHaveBeenCalledWith(expect.stringContaining('query GetLoanById'), {
        id: 1,
      });
      expect(result).toEqual(mockLoan);
      expect(normalizeLoan).toHaveBeenCalledWith(mockLoan);
    });

    it('should handle errors from GraphQL client', async () => {
      const error = new Error('GraphQL error');
      vi.mocked(fetchGraphQL).mockRejectedValue(error);

      await expect(fetchLoanById(999)).rejects.toThrow('GraphQL error');
    });
  });
});
