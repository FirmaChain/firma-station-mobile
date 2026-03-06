// apolloClient.ts

import { CHAIN_NETWORK } from '@/../config';
import { ApolloClient, ApolloLink, concat, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';

// create base http link
const createHttpLink = (network: string) =>
    new HttpLink({
        uri: CHAIN_NETWORK[network].GRAPHQL + '/v1/graphql'
    });

// auth middleware (currently pass-through)
const authMiddleware = new ApolloLink((operation, forward) => {
    // set headers (extend later if needed)
    operation.setContext(({ headers = {} }) => ({
        headers: {
            ...headers
        }
    }));

    // forward operation to next link
    return forward(operation);
});

// default client (MainNet)
let client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    uri: CHAIN_NETWORK['MainNet'].GRAPHQL + '/v1/graphql', // keep behavior same as before
    link: concat(authMiddleware, createHttpLink('MainNet')),
    cache: new InMemoryCache({})
});

// change client by network
export const setClient = (network: string) => {
    client = new ApolloClient({
        uri: CHAIN_NETWORK[network].GRAPHQL + '/v1/graphql', // keep same as original
        link: concat(authMiddleware, createHttpLink(network)),
        cache: new InMemoryCache({})
    });
};

// get current client instance
export const getClient = (): ApolloClient<NormalizedCacheObject> => {
    return client;
};

export { ApolloProvider };

// import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
// import { ApolloLink, concat } from '@apollo/client/link/core';
// import { HttpLink } from '@apollo/client/link/http';
// import { CHAIN_NETWORK } from '@/../config';

// let httpLink = new HttpLink({ uri: CHAIN_NETWORK['MainNet'].GRAPHQL + '/v1/graphql' });
// const authMiddleware = new ApolloLink((operation, forward) => {
//   operation.setContext(({ headers = {} }) => ({
//     headers: {
//       ...headers,
//     },
//   }));

//   return forward(operation);
// });

// let client = new ApolloClient({
//   uri: CHAIN_NETWORK['MainNet'].GRAPHQL + '/v1/graphql',
//   link: concat(authMiddleware, httpLink),
//   cache: new InMemoryCache({}),
// });

// export const setClient = (network: string) => {
//   let httpLink = new HttpLink({ uri: CHAIN_NETWORK[network].GRAPHQL + '/v1/graphql' });
//   client = new ApolloClient({
//     uri: CHAIN_NETWORK[network].GRAPHQL + '/v1/graphql',
//     link: concat(authMiddleware, httpLink),
//     cache: new InMemoryCache({}),
//   });
// };

// const getClient = (): ApolloClient<any> => {
//   return client;
// };

// export { ApolloProvider, getClient };
