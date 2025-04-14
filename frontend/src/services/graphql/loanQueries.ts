/**
 * GraphQL query to fetch a list of loans with filters
 * Corregida basada en los errores recibidos de la API
 */
export const GET_LOANS_QUERY = `
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
            url
          }
          whySpecial
          borrowers {
            firstName
            pictured
          }
          geocode {
            country {
              name
            }
          }
          sector {
            id
            name
          }
        }
      }
    }
  }
`;

/**
 * GraphQL query to fetch a list of loans filtered by sector
 */
export const GET_LOANS_BY_SECTOR_QUERY = `
  query GetLoansBySector($limit: Int!, $offset: Int!, $sectors: [Int!]!) {
    lend {
      loans(limit: $limit, offset: $offset, filters: { sector: $sectors }) {
        totalCount
        values {
          id
          name
          loanAmount
          loanFundraisingInfo {
            fundedAmount
          }
          image {
            url
          }
          whySpecial
          borrowers {
            firstName
            pictured
          }
          geocode {
            country {
              name
            }
          }
          sector {
            id
            name
          }
        }
      }
    }
  }
`;

/**
 * GraphQL query to fetch a single loan by ID - versión minimalista
 * Probada y funcional con la API actual de Kiva
 */
export const GET_LOAN_BY_ID_QUERY = `
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
          url
        }
        whySpecial
        description
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

/**
 * GraphQL query to fetch available filter options (countries and sectors)
 * Basado en pruebas exitosas con la API de Kiva
 */
export const GET_FILTER_OPTIONS_QUERY = `
  query GetFilterOptions {
    lend {
      countryFacets {
        country {
          name
          isoCode
        }
        count
      }
      loans(limit: 100) {
        values {
          sector {
            id
            name
          }
        }
      }
    }
  }
`;
