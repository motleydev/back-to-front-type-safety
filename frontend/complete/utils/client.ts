// @ts-nocheck

import { getHasuraURL } from "./constants";
import { Chain } from "./generated/zeus";

export const client = Chain(getHasuraURL() + "/v1/graphql", {
  credentials: "include",
  mode: "cors",
  headers: (() =>
    typeof window === "undefined"
      ? { "X-Hasura-Admin-Secret": process.env.HASURA_ADMIN_SECRET }
      : {})(),
});

export const openclient = Chain(getHasuraURL() + "/v1/graphql", {
  credentials: "include",
});
