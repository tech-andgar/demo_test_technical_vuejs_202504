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
