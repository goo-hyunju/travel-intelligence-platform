import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import createApolloClient from "@/lib/apollo-client";

export default function App({ Component, pageProps }: AppProps) {
  const client = createApolloClient();
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}