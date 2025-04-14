import type { Loan } from './interfaces';
import { fetchGraphQL } from './graphqlClient';
import { normalizeLoan } from './mapper/loan';

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

  const loans = data.lend.loans.values.map(normalizeLoan);
  const totalCount = data.lend.loans.totalCount;

  return { loans, totalCount };
};

/**
 * Fetches detailed information about a specific loan by its ID
 *
 * @param id - Unique identifier of the loan to retrieve
 * @returns A normalized loan object with complete details
 * @throws Error if the loan cannot be found or if the request fails
 */
export const fetchLoanById = async (id: number): Promise<Loan> => {
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

  return normalizeLoan(data.lend.loan);
};
