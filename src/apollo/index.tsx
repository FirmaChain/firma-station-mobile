import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloLink, concat } from "@apollo/client/link/core";
import { HttpLink } from "@apollo/client/link/http";
import { GRAPHQL } from "@/constants/common";

const httpLink = new HttpLink({ uri: GRAPHQL + '/v1/graphql'});
const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
    },
  }));

  return forward(operation);
});

const client = new ApolloClient({
  uri: GRAPHQL + "/v1/graphql",
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache({}),
});

export { ApolloProvider, client };
