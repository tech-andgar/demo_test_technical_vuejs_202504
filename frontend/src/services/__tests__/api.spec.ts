import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchLoans, fetchLoanById, fetchFilterOptions } from '../api';
import { fetchGraphQL } from '../graphqlClient';
import { normalizeLoan } from '../mapper/loan';
import { Loan } from '@/models/Loan';
import { APIError } from '@/services/errors/apiErrors';

vi.mock('../graphqlClient', () => ({
  fetchGraphQL: vi.fn(),
}));

vi.mock('../mapper/loan', () => ({
  normalizeLoan: vi.fn((loan) => loan),
}));

vi.mock('global', () => ({
  fetch: vi.fn()
}));

describe('API Service', () => {
  const mockLoans = [
    new Loan({
      id: 1,
      name: 'Test Loan 1',
      loanAmount: 1000,
      status: 'fundraising',
      sector: { name: 'Agriculture' },
      geocode: { country: { name: 'United States' } },
      image: { url: 'https://example.com/image1.jpg' }
    }),
    new Loan({
      id: 2,
      name: 'Test Loan 2',
      loanAmount: 2000,
      status: 'fundraising',
      sector: { name: 'Education' },
      geocode: { country: { name: 'Canada' } },
      image: { url: 'https://example.com/image2.jpg' }
    })
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchLoans', () => {
    it('should fetch loans with default parameters', async () => {
      const mockGraphQLResponse = {
        lend: {
          loans: {
            total: 2,
            values: [
              { id: 1, name: 'Loan 1' },
              { id: 2, name: 'Loan 2' },
            ],
          },
        },
      };

      vi.mocked(fetchGraphQL).mockResolvedValue(mockGraphQLResponse);

      const result = await fetchLoans(12, 0);

      expect(fetchGraphQL).toHaveBeenCalledWith(expect.stringContaining('query GetLoans'), {
        limit: 12,
        offset: 0,
      });
      expect(result.loans).toEqual([
        { id: 1, name: 'Loan 1' },
        { id: 2, name: 'Loan 2' },
      ]);
      expect(result.total).toBe(2);
      expect(normalizeLoan).toHaveBeenCalledTimes(2);
    });

    it('should fetch loans with custom parameters', async () => {
      const mockGraphQLResponse = {
        lend: {
          loans: {
            total: 1,
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
      expect(result.total).toBe(1);
    });

    it('should fetch loans successfully', async () => {
      const mockResponse = {
        data: {
          lend: {
            loans: {
              values: mockLoans,
              total: 2
            }
          }
        }
      };
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      } as Response);

      const result = await fetchLoans(10, 0);
      expect(result.loans).toHaveLength(2);
      expect(result.total).toBe(2);
    });

    it('should handle empty response', async () => {
      const mockResponse = {
        data: {
          lend: {
            loans: {
              values: [],
              total: 0
            }
          }
        }
      };
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      } as Response);

      const result = await fetchLoans(10, 0);
      expect(result.loans).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it('should handle API errors', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request'
      } as Response);

      await expect(fetchLoans(10, 0)).rejects.toThrow(APIError);
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
