import { ApolloClient, InMemoryCache } from "@apollo/client";

const createApolloClient = () => {
  return new ApolloClient({
    uri: "http://localhost:3001/graphql", // Your NestJS GraphQL endpoint
    cache: new InMemoryCache(),
  });
};

export default createApolloClient;