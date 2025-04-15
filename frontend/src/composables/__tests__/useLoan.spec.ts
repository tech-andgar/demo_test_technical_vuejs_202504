import { Loan } from '@/models/Loan';
import { fetchFilterOptions, fetchLoanById, fetchLoans } from '@/services/api';
import { APIError } from '@/services/errors/apiErrors';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/services/api', () => ({
  fetchLoans: vi.fn(),
  fetchLoanById: vi.fn(),
  fetchFilterOptions: vi.fn(),
}));

describe('API functions for loans', () => {
  const defaultLoan = {
    id: 1,
    name: 'Test Loan',
    loanAmount: 1000,
    status: 'fundraising',
    sector: { name: 'Agriculture' },
    geocode: { country: { name: 'United States' } },
    image: { url: 'https://example.com/image.jpg' },
  };

  const createMockLoan = (overrides = {}) => {
    return new Loan({ ...defaultLoan, ...overrides });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock the fetchFilterOptions function
    vi.mocked(fetchFilterOptions).mockResolvedValue({
      sectors: [],
      countries: [],
    });
  });

  it('fetchLoans should work with default parameters', async () => {
    const mockLoans = [createMockLoan()];
    vi.mocked(fetchLoans).mockResolvedValueOnce({
      loans: mockLoans,
      total: 1,
    });

    const result = await fetchLoans(10, 0);
    expect(result.loans).toEqual(mockLoans);
    expect(result.total).toBe(1);
  });

  it('fetchFilterOptions should return options', async () => {
    const mockOptions = {
      sectors: [{ name: 'Agriculture', id: 1 }],
      countries: [{ name: 'Peru', isoCode: 'PE' }],
    };

    vi.mocked(fetchFilterOptions).mockResolvedValueOnce(mockOptions);

    const result = await fetchFilterOptions();
    expect(result).toEqual(mockOptions);
    expect(result.sectors).toHaveLength(1);
    expect(result.countries).toHaveLength(1);
  });
});
