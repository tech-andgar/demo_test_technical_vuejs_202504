import type { Loan } from '@/models/Loan';
import { describe, expect, it } from 'vitest';
import type { GraphQLLoan } from '../interfaces';
import { normalizeLoan } from '../mapper/loan';

describe('Loan Mapper', () => {
  it('should map GraphQL loan to Loan model', () => {
    const graphqlLoan: GraphQLLoan = {
      id: 1,
      name: 'Test Loan',
      loanAmount: 1000,
      status: 'fundraising',
      sector: { name: 'Agriculture' },
      geocode: { country: { name: 'United States' } },
      image: { url: 'https://example.com/image.jpg' },
      borrowers: [
        {
          firstName: 'John',
          pictured: true,
        },
      ],
    };

    const normalizedLoan = normalizeLoan(graphqlLoan);

    expect(normalizedLoan.loanAmount).toBe(1000);
    expect(normalizedLoan.name).toBe('Test Loan');
    expect(normalizedLoan.status).toBe('fundraising');
    expect(normalizedLoan.image.url).toBe('https://example.com/image.jpg');
  });

  it('should handle missing optional fields', () => {
    const graphqlLoan: GraphQLLoan = {
      id: 1,
      name: 'Test Loan',
      loanAmount: 1000,
      status: 'fundraising',
      sector: { name: 'Agriculture' },
      geocode: { country: { name: 'United States' } },
      image: { url: 'https://example.com/image.jpg' },
    };

    const normalizedLoan = normalizeLoan(graphqlLoan);

    expect(normalizedLoan.loanAmount).toBe(1000);
    expect(normalizedLoan.name).toBe('Test Loan');
    expect(normalizedLoan.status).toBe('fundraising');
    expect(normalizedLoan.image.url).toBe('https://example.com/image.jpg');
  });

  it('should throw an error when loan is null or undefined', () => {
    expect(() => normalizeLoan(null as unknown as GraphQLLoan)).toThrow(
      'Cannot normalize null or undefined loan'
    );
    expect(() => normalizeLoan(undefined as unknown as GraphQLLoan)).toThrow(
      'Cannot normalize null or undefined loan'
    );
  });
});
