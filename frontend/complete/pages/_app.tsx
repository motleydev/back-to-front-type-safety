import { ApolloProvider } from "@apollo/client";
import type { AppProps } from "next/app";
import { StoreProvider } from "easy-peasy";

import { useApollo } from "../utils/apollo-client";
import { store } from "../store";

import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  const client = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={client}>
      <StoreProvider store={store}>
        <Component {...pageProps} />
      </StoreProvider>
    </ApolloProvider>
  );
}
export default MyApp;
