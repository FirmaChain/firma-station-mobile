import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloLink, concat } from "@apollo/client/link/core";
import { HttpLink } from "@apollo/client/link/http";

// import { GRAPHQL_CONFIG } from "../config";

// const httpLink = new HttpLink({ uri: 'http://192.168.20.115:8080/v1/graphql'});
const httpLink = new HttpLink({ uri: 'https://explorer-testnet.firmachain.dev:8080/v1/graphql'});
const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
    },
  }));

  return forward(operation);
});

const client = new ApolloClient({
  uri: "https://explorer-testnet.firmachain.dev:8080/v1/graphql",
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache({}),
});

export { ApolloProvider, client };
