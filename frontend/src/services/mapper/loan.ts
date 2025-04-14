import type { GraphQLLoan } from '../interfaces';
import { Loan } from '@/models/Loan';

/**
 * Converts a GraphQL loan response to a Loan object
 * @param loanData Raw GraphQL loan data
 * @returns Loan instance with correctly typed and formatted data
 */
export const normalizeLoan = (loanData: GraphQLLoan): Loan => {
  if (!loanData) throw new Error('Cannot normalize null or undefined loan');

  return new Loan(loanData);
};
