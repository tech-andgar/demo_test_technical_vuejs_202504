import type { Loan, GraphQLLoan } from '../interfaces';

/**
 * Converts a GraphQL loan object to a normalized Loan model
 *
 * @param loan - Raw GraphQL loan object from the API
 * @returns Normalized loan object with proper type conversions
 * @throws Error if the loan parameter is null or undefined
 */
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
