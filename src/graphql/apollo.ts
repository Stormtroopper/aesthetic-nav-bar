import { ApolloClient, InMemoryCache } from "@apollo/client";
import { SchemaLink } from "@apollo/client/link/schema";
import { schema } from "./schema";

export const apolloClient = new ApolloClient({
  link: new SchemaLink({ schema }),
  cache: new InMemoryCache(),
});
