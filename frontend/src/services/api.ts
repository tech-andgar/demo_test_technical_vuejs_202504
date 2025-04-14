import { gql } from '@apollo/client';
import { apolloClient } from '@/apollo';
import { GET_LOANS, GET_LOAN_BY_ID } from '@/apollo/queries';


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


const normalizeLoan = (loan: GraphQLLoan): Loan => {
  if (!loan) throw new Error('Cannot normalize null or undefined loan');

  return {
    ...loan,
    loanAmount: Number(loan.loanAmount),
    loanFundraisingInfo: {
      fundedAmount: Number(loan.loanFundraisingInfo.fundedAmount),
    },
  };
};

export const fetchLoans = async (limit: number = 12 , offset: number = 0): Promise<{ loans: Loan[], totalCount: number }> => {
    const { data } = await apolloClient.query({
        query: GET_LOANS,
        variables: { limit, offset },
    });

    const loans = data.lend.loans.values.map(normalizeLoan);
    const totalCount = data.lend.loans.totalCount;

    return { loans, totalCount };
};


export const fetchLoanById = async (id: number): Promise<Loan> => {
    const { data } = await apolloClient.query({
        query: GET_LOAN_BY_ID,
        variables: { id },
    });

    return normalizeLoan(data.lend.loan);
};
