/**
 * Interface for Kiva GraphQL loan data structure
 */
export interface KivaGraphQLResponse {
  lend?: {
    loans?: {
      totalCount: number;
      values: GraphQLLoan[];
    };
    loan?: GraphQLLoan;
    countryFacets?: Array<{
      country: {
        name: string;
        isoCode: string;
      };
      count: number | null;
    }>;
  };
  general?: {
    countries?: Array<{
      name: string;
      region: string;
    }>;
    sectors?: Array<{
      id: number;
      name: string;
    }>;
  };
}

/**
 * Interface for loan list response
 */
export interface LoanListResponse {
  loans: import('@/models/Loan').Loan[];
  totalCount: number;
}

/**
 * Interface for filter options response
 * Simplified to handle basic country data
 */
export interface FilterOptionsResponse {
  countries: Array<{
    name: string;
    region?: string;
    isoCode?: string;
    count?: number;
  }>;
  sectors: Array<{
    name: string;
    id?: number;
  }>;
}

/**
 * Raw loan data structure from GraphQL API - minimal version
 * Only includes essential fields to avoid API compatibility issues
 */
export interface GraphQLLoan {
  id: number;
  name: string;
  loanAmount: number | string;
  image: {
    url: string;
  };
  // These fields are optional because they might not be in the minimal response
  loanFundraisingInfo?: {
    fundedAmount: number | string;
  };
  whySpecial?: string;
  description?: string;
  status?: string;
  borrowers?: Array<{
    firstName: string;
    pictured: boolean;
  }>;
  geocode?: {
    country: {
      name: string;
      isoCode?: string;
    };
  };
  sector?: {
    name: string;
    id?: number;
  };
  activity?: {
    name: string;
  };
}
