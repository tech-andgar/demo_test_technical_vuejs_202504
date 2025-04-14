import { NetworkError, DataFormatError } from './errors/apiErrors';

/**
 * The URL for the Kiva API
 */
const KIVA_API_URL: string =
  import.meta.env.VITE_KIVA_API_URL || 'https://marketplace-api.k1.kiva.org/graphql';

/**
 * Interface for GraphQL response
 */
interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{
    message: string;
    locations?: Array<{
      line: number;
      column: number;
    }>;
    path?: string[];
    extensions?: Record<string, any>;
  }>;
}

/**
 * Executes a GraphQL query against the Kiva API
 *
 * @param query - The GraphQL query string
 * @param variables - Variables to pass to the query
 * @returns The data response from the GraphQL endpoint
 * @throws NetworkError if the request fails
 * @throws DataFormatError if the response contains GraphQL errors
 */
export async function fetchGraphQL<T>(
  query: string,
  variables: Record<string, any> = {}
): Promise<T> {
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
      // Try to get more information about the error
      let errorDetails = '';
      try {
        const errorText = await response.text();
        errorDetails = errorText;
      } catch {
        errorDetails = 'Could not get error details';
      }
      
      throw new NetworkError(`GraphQL request failed: ${response.status} ${response.statusText} - ${errorDetails}`);
    }

    const result = (await response.json()) as GraphQLResponse<T>;

    if (result.errors && result.errors.length) {
      throw new DataFormatError(
        `GraphQL errors: ${result.errors.map((e) => e.message).join(', ')}`,
        result.errors
      );
    }

    return result.data;
  } catch (error) {
    if (error instanceof NetworkError || error instanceof DataFormatError) {
      throw error;
    }

    if (error instanceof Error) {
      throw new NetworkError(`GraphQL client error: ${error.message}`, error);
    }

    throw new NetworkError('Unknown error in GraphQL client');
  }
}
