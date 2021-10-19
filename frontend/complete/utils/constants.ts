export function getHasuraURL() {
  const isServer = typeof window === "undefined";
  if (isServer) {
    return process.env.NEXT_PUBLIC_HASURA_URL;
  } else {
    return process.env.NEXT_PUBLIC_HASURA_URL;
  }
}
