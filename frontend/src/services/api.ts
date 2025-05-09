import type { LoanFilters } from '@/models/filters';
import { generateFilterVariables } from '@/models/filters';
import { Loan } from '../models/Loan';
import { DataFormatError, NetworkError, handleApiError } from './errors/apiErrors';
import {
  GET_FILTER_OPTIONS_QUERY,
  GET_LOANS_QUERY,
  GET_LOAN_BY_ID_QUERY,
} from './graphql/loanQueries';
import { fetchGraphQL } from './graphqlClient';
import type { FilterOptionsResponse, GraphQLLoan, KivaGraphQLResponse } from './interfaces';
import { normalizeLoan } from './mapper/loan';

/**
 * Fetches a paginated and filtered list of loans from the Kiva API
 *
 * @param limit - Maximum number of loans to retrieve (default: 12)
 * @param offset - Number of loans to skip for pagination (default: 0)
 * @param filters - Optional filters to apply to the query
 * @returns Object containing an array of normalized loan objects and the total count
 */
export const fetchLoans = async (
  limit: number,
  offset: number,
  filters?: LoanFilters
): Promise<{ loans: Loan[]; total: number }> => {
  try {
    // Convert filters to the structure expected by the API
    const filterVariables = generateFilterVariables(filters);

    // Use the imported query instead of defining it directly
    const variables = {
      limit,
      offset,
      ...filterVariables,
    };

    const response = await fetchGraphQL<KivaGraphQLResponse>(GET_LOANS_QUERY, variables);

    if (!response?.lend?.loans?.values) {
      throw new Error('Invalid response format from API');
    }

    const loans = response.lend.loans.values.map((loan) => new Loan(loan));
    const total = response.lend.loans.totalCount || 0;

    return { loans, total };
  } catch (error) {
    console.error('Error fetching loans:', error);
    throw error;
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
    const data = await fetchGraphQL<KivaGraphQLResponse>(GET_LOAN_BY_ID_QUERY, { id });

    if (!data?.lend?.loan) {
      throw new DataFormatError('Loan not found or invalid response format', data);
    }

    return normalizeLoan(data.lend.loan);
  } catch (error) {
    return handleApiError(error, `fetchLoanById(${id})`);
  }
};

/**
 * Fetch available filter options (countries and sectors) from the Kiva API
 * Implementation based on real tests with the API
 *
 * @returns Object containing countries and sectors for filtering
 */
export const fetchFilterOptions = async (): Promise<FilterOptionsResponse> => {
  try {
    const data = await fetchGraphQL<KivaGraphQLResponse>(GET_FILTER_OPTIONS_QUERY);

    // Extract countries with count > 0 from response
    const countries =
      data?.lend?.countryFacets
        ?.filter((country) => country.country?.name && country.count !== null && country.count > 0)
        ?.map((country) => ({
          name: country.country.name,
          isoCode: country.country.isoCode,
          count: country.count || 0,
        }))
        ?.sort((a, b) => a.name.localeCompare(b.name)) || [];

    // Extract unique sectors from loan values
    const sectors =
      data?.lend?.loans?.values
        ?.map((loan) => loan.sector)
        ?.filter(
          (sector): sector is NonNullable<GraphQLLoan['sector']> =>
            sector !== undefined && sector !== null
        )
        ?.filter((sector, index, self) => index === self.findIndex((s) => s.id === sector.id)) // Remove duplicates
        ?.map((sector) => ({
          name: sector.name,
          id: sector.id,
        }))
        ?.sort((a, b) => a.name.localeCompare(b.name)) || [];

    return {
      countries,
      sectors: sectors.length
        ? sectors
        : [
            { name: 'Agriculture', id: 1 },
            { name: 'Services', id: 4 },
            { name: 'Clothing', id: 5 },
            { name: 'Health', id: 6 },
            { name: 'Retail', id: 7 },
            { name: 'Housing', id: 10 },
            { name: 'Food', id: 12 },
            { name: 'Education', id: 15 },
          ],
    };
  } catch (error) {
    console.error('Error fetching filter options:', error);

    // Proporcionar datos de respaldo en caso de error de red
    if (error instanceof NetworkError) {
      console.warn('Usando datos de respaldo debido a un error de red');
      return {
        countries: [],
        sectors: [
          { name: 'Agriculture', id: 1 },
          { name: 'Services', id: 4 },
          { name: 'Clothing', id: 5 },
          { name: 'Health', id: 6 },
          { name: 'Retail', id: 7 },
          { name: 'Housing', id: 10 },
          { name: 'Food', id: 12 },
          { name: 'Education', id: 15 },
        ],
      };
    }

    throw error; // Propagar otros tipos de errores
  }
};
