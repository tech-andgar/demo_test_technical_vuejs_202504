import type { Loan } from './interfaces';
import { fetchGraphQL } from './graphqlClient';
import { normalizeLoan } from './mapper/loan';

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
