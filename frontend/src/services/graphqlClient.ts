import { APIError, NetworkError } from './api';

const KIVA_API_URL: string =
  import.meta.env.VITE_KIVA_API_URL || 'https://marketplace-api.k1.kiva.org/graphql';

/**
 * Executes a GraphQL query against the Kiva API
 *
 * @param query - GraphQL query string to execute
 * @param variables - Variables to pass to the GraphQL query
 * @returns The data object from the GraphQL response
 * @throws Error if the request fails or if GraphQL returns errors
 */
export async function fetchGraphQL(query: string, variables: Record<string, any> = {}) {
  try {
    const response = await fetch(KIVA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error details available');
      throw new APIError(
        `GraphQL request failed: ${response.status} ${response.statusText}`,
        response.status,
        { url: KIVA_API_URL, errorText }
      );
    }

    const result = await response.json();

    if (result.errors && result.errors.length) {
      const errorMessages = result.errors.map((e: any) => e.message).join(', ');
      throw new APIError(`GraphQL errors: ${errorMessages}`, undefined, {
        errors: result.errors,
        query,
        variables,
      });
    }

    if (!result.data) {
      throw new APIError('GraphQL response missing data field', undefined, {
        result,
        query,
        variables,
      });
    }

    return result.data;
  } catch (error) {
    // If it's already an API error, just propagate it
    if (error instanceof APIError) {
      throw error;
    }

    // If it's a network error (fetch fails with TypeError for network errors)
    if (error instanceof TypeError || error instanceof DOMException) {
      throw new NetworkError(`Failed to connect to GraphQL API: ${error.message}`, error as Error);
    }

    // Any other type of error
    throw new APIError(
      `Unexpected error in GraphQL request: ${error instanceof Error ? error.message : String(error)}`,
      undefined,
      { originalError: error }
    );
  }
}
