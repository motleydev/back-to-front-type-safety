// @ts-nocheck

import { action, thunk, computed } from "easy-peasy";
import router from "next/router";
import type { Action, Thunk, Computed } from "easy-peasy";
import { ModelTypes, $, Gql } from "../utils/generated/zeus";
// import { client } from "../utils/client";
import { initializeApollo } from "../utils/apollo-client";

/**
 * =====================
 *  STORE TYPES
 * =====================
 */
type Maybe<T> = T | null;
export interface Store {
  // STATE - The data
  user: Maybe<Partial<ModelTypes["user"]>>;
  auth: {
    isLoggedIn: boolean;
    error: string;
  };
  // COMPUTED - Fields calculated from data in State
  // ACTIONS - Change state
  setUser: Action<Store, Partial<ModelTypes["user"]>>;
  setIsLoggedIn: Action<Store, boolean>;
  // THUNKS - Perform logic, call one or more Actions
  signup: Thunk<Store, ModelTypes["SignupInput"]>;
  login: Thunk<Store, ModelTypes["LoginInput"]>;
  logout: Thunk<Store>;
}
/**
 * =====================
 *  STORE MODEL
 * =====================
 */
// const apollo = initializeApollo();
export const model: Store = {
  // STATE - The data
  user: null,
  auth: {
    isLoggedIn: false,
    error: false,
  },
  // COMPUTED - Fields calculated from data in State
  // ACTIONS  - Change state
  setUser: action((store, payload) => {
    store.user = payload;
  }),
  setLogginError: action((store, payload) => {
    store.auth.error = payload;
  }),
  setIsLoggedIn: action((store, payload) => {
    store.auth.isLoggedIn = payload;
  }),
  // THUNKS - Perform logic, call one or more Actions
  signup: thunk(async (store, payload) => {
    try {
      store.setLogginError(false);
      const result = await Gql.mutation(
        {
          signup: [
            { params: { ...payload } },
            {
              name: true,
              email: true,
              id: true,
            },
          ],
        },
        {
          operationName: "SignupWebClient",
        }
      );

      if (result.errors) {
        store.setLogginError(true); //throw new Error(JSON.stringify(result.errors));
      } else {
        store.setUser(result.signup);
        store.setIsLoggedIn(true);
      }
    } catch (e) {
      store.setLogginError("Error"); //throw new Error(JSON.stringify(result.errors));
    }
  }),
  login: thunk(async (store, payload) => {
    const result = await client.mutation(
      {
        login: [
          { params: $`payload` },
          {
            name: true,
            id: true,
          },
        ],
      },
      {
        operationName: "LoginWebClient",
        variables: {
          payload,
        },
      }
    );
    store.setUser(result.login);
    store.setIsLoggedIn(true);
  }),
  logout: thunk(async (store) => {
    store.setUser(null);
    store.setIsLoggedIn(false);
    const res = await fetch(`/api/logout`);
    router.push("/");
  }),
};
