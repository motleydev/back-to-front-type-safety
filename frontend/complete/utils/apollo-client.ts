// @ts-nocheck

import { useMemo } from "react";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  Operation,
} from "@apollo/client";
import { ApolloLink } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

import { getHasuraURL } from "./constants";

let apolloClient: {};

const HASURA_URL = getHasuraURL();

const isServer = () => typeof window === "undefined";
export const isBrowser = () => !isServer();

function operationIsSubscription(operation: Operation): boolean {
  const definition = getMainDefinition(operation.query);
  return (
    definition.kind === "OperationDefinition" &&
    definition.operation === "subscription"
  );
}

function getApolloLink() {
  // LINKS
  const httpLink = new HttpLink({
    uri: `${HASURA_URL}/v1/graphql`,
    credentials: "include",
  });

  const wsLink =
    isBrowser() &&
    new WebSocketLink({
      uri: `${HASURA_URL}/v1/graphql`
        .replace("http", "ws")
        .replace("https", "wss"),
      options: {
        reconnect: true,
        timeout: 30000,
      },
    });

  // RESULT
  if (isServer()) {
    return ApolloLink.from([httpLink]);
  }

  if (isBrowser()) {
    return ApolloLink.from([
      ApolloLink.split(operationIsSubscription, wsLink, httpLink),
    ]);
  }
}

///////////////////////////////////////////////////

const createApolloClient = () =>
  new ApolloClient({
    link: getApolloLink(),
    credentials: "include",
    ssrMode: isServer(), // set to true for SSR
    cache: new InMemoryCache(),
  });

export function initializeApollo(initialState = null) {
  const _apolloClient: ApolloClient<NormalizedCacheObject> =
    apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client,
  // the initial state gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Restore the cache using the data passed from
    // getStaticProps/getServerSideProps combined with the existing cached data
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _apolloClient;

  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;
  return _apolloClient;
}

export function useApollo(initialState) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
