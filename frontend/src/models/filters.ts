/**
 * Interface defining the parameters for filtering loans
 */
export interface LoanFilters {
  searchTerm?: string;
  sectors?: number[];
  countries?: string[];
  sortBy?: string;
  gender?: string;         // 'female', 'male', 'nonbinary', etc.
  status?: string;         // 'fundraising', 'funded', etc.
  minAmount?: number;      // Minimum loan amount
  maxAmount?: number;      // Maximum loan amount
  themes?: string[];        // e.g. Green, Health, etc.
  tags?: string[];          // Tags added by lenders
  distributionModel?: string; // 'field_partner' or 'direct'
  isExpiringSoon?: boolean; // Whether loan is expiring soon
  activities?: string[];    // More specific categories than sectors
  loanLimit?: number;       // Maximum number of loans to retrieve (used with offset)
}

export interface FilterOption {
  id: number | string;
  name: string;
}

/**
 * Generate GraphQL filter variables based on filter parameters
 * 
 * @param filters - Object containing filter options
 * @returns Object of variables to pass to GraphQL query
 */
export const generateFilterVariables = (filters?: LoanFilters) => {
  if (!filters) return {};
  
  const variables: Record<string, any> = {};
  
  if (filters.sectors !== undefined && filters.sectors !== null && filters.sectors.length > 0) {
    variables.sectors = filters.sectors;
  }
  
  if (filters.countries !== undefined && filters.countries !== null && filters.countries.length > 0) {
    variables.countries = filters.countries;
  }
  
  if (filters.gender) {
    variables.gender = filters.gender;
  }
  
  if (filters.status) {
    variables.status = filters.status;
  }
  
  if (filters.minAmount !== undefined) {
    variables.minAmount = filters.minAmount;
  }
  
  if (filters.maxAmount !== undefined) {
    variables.maxAmount = filters.maxAmount;
  }
  
  if (filters.sortBy) {
    variables.sortBy = filters.sortBy;
  }
  
  if (filters.searchTerm) {
    variables.queryString = filters.searchTerm;
  }

  if (filters.themes && filters.themes.length > 0) {
    variables.themes = filters.themes;
  }

  if (filters.tags && filters.tags.length > 0) {
    variables.tags = filters.tags;
  }

  if (filters.distributionModel) {
    variables.distributionModel = filters.distributionModel;
  }

  if (filters.isExpiringSoon !== undefined) {
    variables.isExpiringSoon = filters.isExpiringSoon;
  }

  if (filters.activities && filters.activities.length > 0) {
    variables.activities = filters.activities;
  }

  if (filters.loanLimit !== undefined) {
    variables.loanLimit = filters.loanLimit;
  }
  
  console.log('Generated filter variables:', variables);
  return variables;
};
