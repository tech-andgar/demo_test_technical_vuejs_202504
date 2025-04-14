import { describe, it, expect } from 'vitest';
import { normalizeLoan } from '../mapper/loan';
import type { GraphQLLoan, Loan } from '../interfaces';

describe('Loan Mapper', () => {
  it('should convert string values to numbers', () => {
    const graphqlLoan: GraphQLLoan = {
      id: 1,
      name: 'Test Loan',
      loanAmount: '1000',
      loanFundraisingInfo: {
        fundedAmount: '500',
      },
      image: {
        url: 'https://example.com/image.jpg',
      },
      whySpecial: 'Special reason',
      status: 'active',
      description: 'Loan description',
      borrowers: [
        {
          firstName: 'John',
          pictured: true,
          gender: 'male',
          isPrimary: true,
        },
      ],
      geocode: {
        country: {
          name: 'Kenya',
        },
      },
    };

    const normalizedLoan: Loan = normalizeLoan(graphqlLoan);

    expect(normalizedLoan.loanAmount).toBe(1000);
    expect(normalizedLoan.loanFundraisingInfo.fundedAmount).toBe(500);

    expect(normalizedLoan.id).toBe(1);
    expect(normalizedLoan.name).toBe('Test Loan');
    expect(normalizedLoan.image.url).toBe('https://example.com/image.jpg');
    expect(normalizedLoan.whySpecial).toBe('Special reason');
    expect(normalizedLoan.status).toBe('active');
    expect(normalizedLoan.description).toBe('Loan description');
    expect(normalizedLoan.borrowers?.[0].firstName).toBe('John');
    expect(normalizedLoan.geocode?.country.name).toBe('Kenya');
  });

  it('should handle already numeric values', () => {
    const graphqlLoan: GraphQLLoan = {
      id: 1,
      name: 'Test Loan',
      loanAmount: 1000,
      loanFundraisingInfo: {
        fundedAmount: 500,
      },
      image: {
        url: 'https://example.com/image.jpg',
      },
      whySpecial: 'Special reason',
    };

    const normalizedLoan: Loan = normalizeLoan(graphqlLoan);

    expect(normalizedLoan.loanAmount).toBe(1000);
    expect(normalizedLoan.loanFundraisingInfo.fundedAmount).toBe(500);
  });

  it('should throw an error when loan is null or undefined', () => {
    expect(() => normalizeLoan(null as any)).toThrow('Cannot normalize null or undefined loan');
    expect(() => normalizeLoan(undefined as any)).toThrow(
      'Cannot normalize null or undefined loan'
    );
  });
});
