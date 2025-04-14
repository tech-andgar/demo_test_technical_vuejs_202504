import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchGraphQL } from '../graphqlClient';

const mockFetch = vi.fn();
global.fetch = mockFetch;

vi.mock('../graphqlClient', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    fetchGraphQL: actual.fetchGraphQL,
  };
});

describe('GraphQL Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should make a POST request to the GraphQL endpoint', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ data: { test: 'data' } }),
    };
    mockFetch.mockResolvedValue(mockResponse);

    const query = 'query { test }';
    const variables = { id: 123 };

    const result = await fetchGraphQL(query, variables);

    expect(mockFetch).toHaveBeenCalledWith(expect.stringMatching(/graphql/), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });
    expect(result).toEqual({ test: 'data' });
  });

  it('should throw an error if the response is not OK', async () => {
    const mockResponse = {
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      text: async () => 'Server error',
    };
    mockFetch.mockResolvedValue(mockResponse);

    const query = 'query { test }';

    await expect(fetchGraphQL(query)).rejects.toThrow(
      'GraphQL request failed: 500 Internal Server Error'
    );
  });

  it('should throw an error if the response contains GraphQL errors', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        data: null,
        errors: [{ message: 'Field "test" not found' }, { message: 'Invalid syntax' }],
      }),
    };
    mockFetch.mockResolvedValue(mockResponse);

    const query = 'query { test }';

    await expect(fetchGraphQL(query)).rejects.toThrow(
      'GraphQL errors: Field "test" not found, Invalid syntax'
    );
  });

  it('should use the GraphQL API URL when making requests', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ data: { test: 'data' } }),
    };
    mockFetch.mockResolvedValue(mockResponse);

    await fetchGraphQL('query { test }');

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringMatching(/^https:\/\/.*\/graphql$/),
      expect.anything()
    );
  });
});
