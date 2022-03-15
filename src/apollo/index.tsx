import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloLink, concat } from "@apollo/client/link/core";
import { HttpLink } from "@apollo/client/link/http";
import { CHAIN_NETWORK } from "@/../config";

let httpLink = new HttpLink({ uri: CHAIN_NETWORK["MainNet"].GRAPHQL + '/v1/graphql'});
const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
    },
  }));

  return forward(operation);
});

let client = new ApolloClient({
  uri: CHAIN_NETWORK["MainNet"].GRAPHQL + "/v1/graphql",
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache({}),
});

export const setClient = (network:string) => {
  let httpLink = new HttpLink({ uri: CHAIN_NETWORK[network].GRAPHQL + '/v1/graphql'});
  client = new ApolloClient({
    uri: CHAIN_NETWORK[network].GRAPHQL + "/v1/graphql",
    link: concat(authMiddleware, httpLink),
    cache: new InMemoryCache({}),
  })
}

const getClient = () => {
  return client;
}

export { ApolloProvider, getClient };
