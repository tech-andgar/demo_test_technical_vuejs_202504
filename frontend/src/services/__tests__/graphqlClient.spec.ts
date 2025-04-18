import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DataFormatError, NetworkError } from '../errors/apiErrors';
import { fetchGraphQL } from '../graphqlClient';

// Mock fetch globally
global.fetch = vi.fn();

describe('graphqlClient', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should make a POST request to the GraphQL endpoint and return data', async () => {
    const mockResponse = {
      ok: true,
      json: () =>
        Promise.resolve({
          data: { test: 'success' },
        }),
      headers: new Headers(),
      redirected: false,
      status: 200,
      statusText: 'OK',
      type: 'basic' as ResponseType,
      url: 'https://test.com',
      clone: () => mockResponse as Response,
      body: null,
      bodyUsed: false,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      blob: () => Promise.resolve(new Blob()),
      formData: () => Promise.resolve(new FormData()),
      text: () => Promise.resolve(''),
    } as Response;

    vi.mocked(global.fetch).mockResolvedValueOnce(mockResponse);

    const query = 'query { test }';
    const variables = { id: '123' };

    const result = await fetchGraphQL(query, variables);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(expect.any(String), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    expect(result).toEqual({ test: 'success' });
  });

  it('should throw NetworkError when response is not OK', async () => {
    const errorText = 'Server error';
    const mockResponse = {
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      text: () => Promise.resolve(errorText),
      headers: new Headers(),
      redirected: false,
      type: 'basic' as ResponseType,
      url: 'https://test.com',
      clone: () => mockResponse as Response,
      body: null,
      bodyUsed: false,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      blob: () => Promise.resolve(new Blob()),
      formData: () => Promise.resolve(new FormData()),
      json: () => Promise.resolve({}),
    } as Response;

    vi.mocked(global.fetch).mockResolvedValue(mockResponse);

    const query = 'query { test }';

    try {
      await fetchGraphQL(query);
      // Si llegamos aquí, la prueba debe fallar porque esperamos una excepción
      expect('This should not be reached').toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(NetworkError);
      if (error instanceof NetworkError) {
        expect(error.message).toContain('GraphQL request failed: 500 Internal Server Error');
        expect(error.message).toContain(errorText);
      }
    }
  });

  it('should throw DataFormatError when response contains GraphQL errors', async () => {
    const graphqlErrors = [{ message: 'Field "test" not found', path: ['test'] }];

    const mockResponse = {
      ok: true,
      json: () =>
        Promise.resolve({
          data: { partial: 'data' },
          errors: graphqlErrors,
        }),
      headers: new Headers(),
      redirected: false,
      status: 200,
      statusText: 'OK',
      type: 'basic' as ResponseType,
      url: 'https://test.com',
      clone: () => mockResponse as Response,
      body: null,
      bodyUsed: false,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      blob: () => Promise.resolve(new Blob()),
      formData: () => Promise.resolve(new FormData()),
      text: () => Promise.resolve(''),
    } as Response;

    vi.mocked(global.fetch).mockResolvedValue(mockResponse);

    const query = 'query { test }';

    try {
      await fetchGraphQL(query);
      // Si llegamos aquí, la prueba debe fallar porque esperamos una excepción
      expect('This should not be reached').toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(DataFormatError);
      if (error instanceof DataFormatError) {
        expect(error.message).toContain('GraphQL errors: Field "test" not found');
      }
    }
  });

  it('should handle fetch network errors', async () => {
    const networkError = new Error('Network failure');
    vi.mocked(global.fetch).mockRejectedValue(networkError);

    const query = 'query { test }';

    try {
      await fetchGraphQL(query);
      // Si llegamos aquí, la prueba debe fallar porque esperamos una excepción
      expect('This should not be reached').toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(NetworkError);
      if (error instanceof NetworkError) {
        expect(error.message).toContain('GraphQL client error: Network failure');
      }
    }
  });

  it('should handle error when getting error details fails', async () => {
    const mockResponse = {
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      text: () => Promise.reject(new Error('Cannot read response')),
      headers: new Headers(),
      redirected: false,
      type: 'basic' as ResponseType,
      url: 'https://test.com',
      clone: () => mockResponse as Response,
      body: null,
      bodyUsed: false,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      blob: () => Promise.resolve(new Blob()),
      formData: () => Promise.resolve(new FormData()),
      json: () => Promise.resolve({}),
    } as Response;

    vi.mocked(global.fetch).mockResolvedValue(mockResponse);

    const query = 'query { test }';

    try {
      await fetchGraphQL(query);
      // Si llegamos aquí, la prueba debe fallar porque esperamos una excepción
      expect('This should not be reached').toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(NetworkError);
      if (error instanceof NetworkError) {
        expect(error.message).toContain('GraphQL request failed: 500 Internal Server Error');
        expect(error.message).toContain('Could not get error details');
      }
    }
  });
});
