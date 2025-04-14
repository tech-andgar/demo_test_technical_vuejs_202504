/**
 * Raw loan data structure as returned from the GraphQL API
 * Contains string number values that need to be converted
 */
export interface GraphQLLoan {
  id: number;
  name: string;
  loanAmount: number | string;
  loanFundraisingInfo: {
    fundedAmount: number | string;
  };
  image: {
    url: string;
  };
  whySpecial: string;
  description?: string;
  status?: string;
  borrowers?: Array<{
    firstName: string;
    pictured: boolean;
    gender?: string;
    isPrimary?: boolean;
  }>;
  geocode?: {
    country: {
      name: string;
    };
  };
}

/**
 * Normalized loan data structure for use in the application
 * Contains properly typed numeric values
 */
export interface Loan {
  id: number;
  name: string;
  loanAmount: number;
  loanFundraisingInfo: {
    fundedAmount: number;
  };
  image: {
    url: string;
  };
  whySpecial: string;
  description?: string;
  status?: string;
  borrowers?: Array<{
    firstName: string;
    pictured: boolean;
    gender?: string;
    isPrimary?: boolean;
  }>;
  geocode?: {
    country: {
      name: string;
    };
  };
}
