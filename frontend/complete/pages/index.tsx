import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import {
  useTypedQuery,
  useTypedMutation,
} from "../utils/generated/zeus/apollo";
import styles from "../styles/Home.module.css";

import { useStoreActions, useStoreState } from "../store";
import { useMutation } from "@apollo/client";

const Home: NextPage = () => {
  const [name, setName] = React.useState("Fakey Zed");
  const [email, setEmail] = React.useState("user-1@fake.zed");
  const [password, setPassword] = React.useState("123");
  const signup = useStoreActions((actions) => actions.signup);
  const user = useStoreState((state) => state.user);
  const isLoggedIn = useStoreState((state) => state.auth.isLoggedIn);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    signup({
      name,
      email,
      password,
    });
  };

  const { data, error, loading } = useTypedQuery({
    user: [
      {},
      {
        name: true,
      },
    ],
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <section>
          {!isLoggedIn && (
            <form>
              <input
                value={name}
                type="text"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              <input
                value={email}
                type="text"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <input
                value={password}
                type="text"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <button onClick={handleSignup}>Signup</button>
            </form>
          )}
          {isLoggedIn && <p>{user?.name}</p>}
        </section>

        <div className={styles.grid}>
          <ul>
            {data?.user &&
              data.user.map((user, index) => <li key={index}>{user.name}</li>)}
          </ul>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Home;
