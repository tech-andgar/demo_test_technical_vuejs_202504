const KIVA_API_URL: string =
  import.meta.env.VITE_KIVA_API_URL || 'https://marketplace-api.k1.kiva.org/graphql';

export async function fetchGraphQL(query: string, variables: Record<string, any> = {}) {
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
    throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();

  if (result.errors && result.errors.length) {
    throw new Error(`GraphQL errors: ${result.errors.map((e: any) => e.message).join(', ')}`);
  }

  return result.data;
}
