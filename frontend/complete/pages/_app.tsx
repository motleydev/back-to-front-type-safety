import { ApolloProvider } from "@apollo/client";
import type { AppProps } from "next/app";

import { useApollo } from "../utils/apollo-client";

import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  const client = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
export default MyApp;
