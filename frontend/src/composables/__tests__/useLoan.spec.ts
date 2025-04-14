import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useLoan } from '../useLoan';
import { fetchLoans, fetchLoanById, NetworkError } from '@/services/api';

vi.mock('@/services/api', () => ({
  fetchLoans: vi.fn(),
  fetchLoanById: vi.fn(),
  NetworkError: class NetworkError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'NetworkError';
    }
  }
}));

vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({ params: { id: '1' } })),
}));

describe('useLoan', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return the correct structure', () => {
    const { loans, loadLoans, loadingLoans } = useLoan();

    expect(loans.value).toEqual([]);
    expect(typeof loadLoans).toBe('function');
    expect(loadingLoans.value).toBe(false);
  });

  it('should load loans successfully', async () => {
    const mockLoans = [
      {
        id: 1,
        name: 'John Doe',
        loanAmount: 1000,
        loanFundraisingInfo: { fundedAmount: 500 },
        image: { url: 'https://example.com/image1.jpg' },
        whySpecial: 'Special reason 1',
      },
    ];

    vi.mocked(fetchLoans).mockResolvedValue({
      loans: mockLoans,
      totalCount: 1,
    });

    const { loans, loadLoans, loadingLoans } = useLoan();

    expect(loadingLoans.value).toBe(false);

    const loadPromise = loadLoans();
    expect(loadingLoans.value).toBe(true);

    await loadPromise;

    expect(loadingLoans.value).toBe(false);
    expect(loans.value).toEqual(mockLoans);
    expect(fetchLoans).toHaveBeenCalledWith(12, 0);
  });

  it('should handle pagination', async () => {
    const mockLoans = [
      {
        id: 2,
        name: 'Jane Smith',
        loanAmount: 800,
        loanFundraisingInfo: { fundedAmount: 400 },
        image: { url: 'https://example.com/image2.jpg' },
        whySpecial: 'Special reason 2',
      },
    ];

    vi.mocked(fetchLoans).mockResolvedValue({
      loans: mockLoans,
      totalCount: 1,
    });

    const { loans, loadLoans } = useLoan();

    await loadLoans(2);

    expect(loans.value).toEqual(mockLoans);
    expect(fetchLoans).toHaveBeenCalledWith(12, 12);
  });

  it('should handle errors when loading loans', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new NetworkError('Network error');

    vi.mocked(fetchLoans).mockRejectedValue(error);

    const { loadLoans, loadingLoans, error: errorState, errorMessage } = useLoan();

    await loadLoans();
    
    // Verify error handling
    expect(loadingLoans.value).toBe(false);
    expect(errorState.value).not.toBeNull();
    expect(errorMessage.value).toContain('connect to the server');
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
