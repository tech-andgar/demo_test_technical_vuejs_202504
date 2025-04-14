import { Loan } from "@/models/Loan";
import type { GraphQLLoan } from "../interfaces";

/**
 * Converts a GraphQL loan response to a proper Loan model instance
 * 
 * @param loan - Raw loan data from the GraphQL API
 * @returns A properly typed Loan model instance
 * @throws Error if the loan is null or undefined
 */
export const normalizeLoan = (loan: GraphQLLoan): Loan => {
  if (!loan) {

  // Crear objeto con valores por defecto para campos que podrían faltar
  const normalizedLoan: GraphQLLoan = {
    ...loan,
    loanFundraisingInfo: loan.loanFundraisingInfo || { fundedAmount: "0" },
    whySpecial: loan.whySpecial || "",
    description: loan.description || "",
    status: loan.status || "",
    borrowers: loan.borrowers || [],
    geocode: loan.geocode || { country: { name: "" } },
    sector: loan.sector || { name: "" },
    activity: loan.activity || { name: "" }
  };

  return new Loan(normalizedLoan);
};
