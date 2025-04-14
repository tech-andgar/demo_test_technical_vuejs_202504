import type { Loan, GraphQLLoan } from '../interfaces';

export const normalizeLoan = (loan: GraphQLLoan): Loan => {
  if (!loan) throw new Error('Cannot normalize null or undefined loan');

  return {
    ...loan,
    loanAmount: Number(loan.loanAmount),
    loanFundraisingInfo: {
      fundedAmount: Number(loan.loanFundraisingInfo.fundedAmount),
    },
  };
};
