import {
    ApolloClient,
    InMemoryCache,
    HttpLink,
    ApolloLink,
} from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

const GRAPHQL_API_URL =
    import.meta.env.VITE_GRAPHQL_API_URL || 'http://localhost:4005/graphql';
const GRAPHQL_WS_URL =
    import.meta.env.VITE_GRAPHQL_WS_URL || 'ws://localhost:4005/subscriptions';

// 1. Standard HTTP Link (Replacing createHttpLink)
const httpLink = new HttpLink({
    uri: GRAPHQL_API_URL,
});

// 2. WebSocket Client for Subscriptions
const wsClient = createClient({
    url: GRAPHQL_WS_URL,
    lazy: true,
    shouldRetry: () => true,
    retryAttempts: 5,
});

const wsLink = new GraphQLWsLink(wsClient);

/**
 * 3. Split Link (Replacing the standalone split function)
 * Use ApolloLink.split for future-proofing
 */
const splitLink = ApolloLink.split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink,
);

// 4. Create and export the Apollo Client
export const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
});