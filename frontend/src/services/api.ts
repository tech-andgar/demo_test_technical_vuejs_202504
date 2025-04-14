import type { Loan } from '@/models/Loan';
import { fetchGraphQL } from './graphqlClient';
import { normalizeLoan } from './mapper/loan';

export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export class NetworkError extends APIError {
  constructor(
    message: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class DataFormatError extends APIError {
  constructor(
    message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'DataFormatError';
  }
}

/**
 * Helper function to handle API errors
 *
 * @param error - The error object to handle
 * @param context - The context in which the error occurred
 * @returns Never
 */
const handleApiError = (error: unknown, context: string): never => {
  if (error instanceof Error) {
    if (
      error.name === 'NetworkError' ||
      error.name === 'APIError' ||
      error.name === 'DataFormatError'
    ) {
      throw error;
    }
    throw new NetworkError(`Error in ${context}: ${error.message}`, error);
  }
  throw new APIError(`Unknown error in ${context}`);
};

/**
 * Fetches a paginated list of loans from the Kiva API
 *
 * @param limit - Maximum number of loans to retrieve (default: 12)
 * @param offset - Number of loans to skip for pagination (default: 0)
 * @returns Object containing an array of normalized loan objects and the total count
 */
export const fetchLoans = async (
  limit: number = 12,
  offset: number = 0
): Promise<{ loans: Loan[]; totalCount: number }> => {
  try {
    const query = `
      query GetLoans($limit: Int!, $offset: Int!) {
        lend {
          loans(limit: $limit, offset: $offset) {
            totalCount
            values {
              id
              name
              loanAmount
              loanFundraisingInfo {
                fundedAmount
              }
              image {
                url(customSize: "w480h300")
              }
              whySpecial
              geocode {
                country {
                  name
                }
              }
            }
          }
        }
      }
    `;

    const data = await fetchGraphQL(query, { limit, offset });

    if (!data?.lend?.loans?.values) {
      throw new DataFormatError('Invalid response format from API', data);
    }

    const loans = data.lend.loans.values.map(normalizeLoan);
    const totalCount = data.lend.loans.totalCount || 0;

    return { loans, totalCount };
  } catch (error) {
    return handleApiError(error, 'fetchLoans');
  }
};

/**
 * Fetches detailed information about a specific loan by its ID
 *
 * @param id - Unique identifier of the loan to retrieve
 * @returns A normalized loan object with complete details
 * @throws Error if the loan cannot be found or if the request fails
 */
export const fetchLoanById = async (id: number): Promise<Loan> => {
  try {
    const query = `
      query GetLoanById($id: Int!) {
        lend {
          loan(id: $id) {
            id
            name
            loanAmount
            loanFundraisingInfo {
              fundedAmount
            }
            image {
              url(customSize: "w480h300")
            }
            whySpecial
            description
            status
            borrowers {
              firstName
              pictured
            }
            geocode {
              country {
                name
              }
            }
          }
        }
      }
    `;

    const data = await fetchGraphQL(query, { id });

    if (!data?.lend?.loan) {
      throw new DataFormatError('Loan not found or invalid response format', data);
    }

    return normalizeLoan(data.lend.loan);
  } catch (error) {
    return handleApiError(error, `fetchLoanById(${id})`);
  }
};
