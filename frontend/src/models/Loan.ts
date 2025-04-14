import type { GraphQLLoan } from '@/services/interfaces';

/**
 * Loan class representing a Kiva loan with business logic
 */
export class Loan {
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
      isoCode?: string;
    };
  };
  themes?: string[];

  /**
   * Create a new Loan instance
   */
  constructor(data: GraphQLLoan) {
    this.id = data.id;
    this.name = data.name;
    this.loanAmount = Number(data.loanAmount) || 0;
    this.loanFundraisingInfo = {
      fundedAmount: Number(data.loanFundraisingInfo?.fundedAmount) || 0,
    };
    this.image = {
      url: data.image.url || '',
    };
    this.whySpecial = data.whySpecial || '';
    this.description = data.description || '';
    this.status = data.status || '';
    this.borrowers = data.borrowers || [];
    this.geocode = data.geocode || { country: { name: '' } };
    this.themes = [];
  }

  /**
   * Get the funding progress percentage
   * @returns The percentage of the loan that has been funded (0-100)
   */
  getFundingPercentage(): number {
    if (this.loanAmount === 0) return 0;
    return Math.min(
      100,
      Math.round((this.loanFundraisingInfo.fundedAmount / this.loanAmount) * 100)
    );
  }

  /**
   * Check if the loan is fully funded
   * @returns True if the loan is 100% funded
   */
  isFullyFunded(): boolean {
    return this.getFundingPercentage() >= 100;
  }

  /**
   * Get the funding amount remaining to be raised
   * @returns The amount still needed to fully fund the loan
   */
  getRemainingAmount(): number {
    return Math.max(0, this.loanAmount - this.loanFundraisingInfo.fundedAmount);
  }

  /**
   * Get the country name of the loan
   * @returns The country name or 'Unknown location' if not available
   */
  getCountryName(): string {
    return this.geocode?.country?.name || 'Unknown location';
  }

  /**
   * Get the primary borrower's name
   * @returns The primary borrower's first name or the loan name if not available
   */
  getPrimaryBorrowerName(): string {
    if (!this.borrowers || this.borrowers.length === 0) {
      return this.name;
    }

    const primaryBorrower = this.borrowers.find((b) => b.isPrimary) || this.borrowers[0];
    return primaryBorrower.firstName;
  }

  /**
   * Get a shortened version of the special description
   * @param maxLength Maximum length of the returned string
   * @returns Shortened special description with ellipsis if needed
   */
  getShortDescription(maxLength = 100): string {
    if (!this.whySpecial || this.whySpecial.length <= maxLength) {
      return this.whySpecial || '';
    }

    return `${this.whySpecial.substring(0, maxLength - 3)}...`;
  }
}
