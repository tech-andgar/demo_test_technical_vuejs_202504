import { ApolloClient, createHttpLink, from, InMemoryCache } from '@apollo/client';

const KIVA_API_URL: string = import.meta.env.VITE_KIVA_API_URL || 'https://marketplace-api.k1.kiva.org/graphql';

const httpLink = createHttpLink({
    uri: KIVA_API_URL,
});

const cache = new InMemoryCache();

export const apolloClient = new ApolloClient({
    link: from([httpLink]),
    cache,
});