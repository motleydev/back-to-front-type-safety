## Set up the accounts!

Hasura Cloud
Heroku

## Create the Hasura Project

## Connect a database

This step you might typically have your own database

## Init Environment variables

`ACTION_BASE_URL` = "/"
`HASURA_GRAPHQL_UNAUTHORIZED_ROLE` = anonymous
`HASURA_GRAPHQL_JWT_SECRET` =

```json
{
  "key": "this-is-a-generic-HS256-secret-key-and-you-should-really-change-it",
  "type": "HS256",
  "header": {
    "name": "hasura-user-token",
    "type": "Cookie"
  }
}
```

## If using CID

### Connect our Github Repo

Fork this: https://github.com/motleydev/back-to-front-type-safety

## Add Metadata

Add Github integration from Dashboard

## If configuring manually

### Insert our tables (If not added from above)

This step is important that we know the shape of our user table. The specific namings are not important, but the consistent naming will need to be adapted throughout the entire code base if you have something different than what we are using here.

```sql
CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$;

CREATE TABLE public."user" (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL
);


ALTER TABLE public."user" ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);

CREATE TRIGGER set_user_updated_at BEFORE UPDATE ON public."user" FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
```

### Create Actions

#### Add Login action

GraphQL Code:

**Action Definition**

```graphql
type Mutation {
  login(input: LoginInput!): JWT
}
```

**Type Definition**

```graphql
input LoginInput {
  password: String!
  email: String!
}

type JWT {
  id: Int!
  token: String!
  name: String!
  email: String!
}
```

**Handler**
{{ACTION_BASE_URL}}/api/actions/login

#### Add Signup action

GraphQL Code:

**Action Definition**

```graphql
type Mutation {
  signup(input: SignupInput!): JWT
}
```

**Type Definition**

```graphql
input SignupInput {
  password: String!
  name: String!
  email: String!
}

# JWT Type from above already exists as type declarations are global
```

**Handler**
{{ACTION_BASE_URL}}/api/actions/signup

#### Set Permissions

We'll set these to our `anonymous` user.

---

## Create a NextJS typescript project

`npx create-next-app@latest --ts project-name`
Follow on the onscreen prompts.

## Install Dependencies

```bash
yarn add bcryptjs next-connect @apollo/client cookie easy-peasy env-cmd graphql jsonwebtoken jwt-decode react-jwt subscriptions-transport-ws
```

```bash
yarn add -D @types/bcryptjs @types/cookie @types/jsonwebtoken graphql-zeus
```

## Add Environment variables

```bash
NEXT_PUBLIC_HASURA_URL=YOUR_ENDPOINT
HASURA_ENDPOINT=YOUR_ENDPOINT/v1/graphql
HASURA_ADMIN_SECRET=***
HASURA_JWT_SECRET_TYPE=HS256
HASURA_JWT_SECRET_KEY=***
```

## Make API Paths

Delete `/pages/api/hello.ts`

These first two map to Hasura actions, so, for organization, we'll nest them in an actions folder. This is not required.
`/pages/api/actions/signup.ts`
`/pages/api/actions/login.ts`
This is an API route we'll only call from this client application.
`/pages/api/signout.ts`

See example in the full-example

## Generate SDK

Add this line to package.json scripts section

```json
{
  "gql-sdk": "env-cmd -x zeus \\$ENDPOINT ./utils/generated --apollo --ts --header=x-hasura-admin-secret:\\$HASURA_ADMIN_SECRET"
}
```

Now run

```graphql
yarn gql-sdk
```

## Add Remaining Utils

### Add JWT Generator

`/utils/auth/jwt.ts`

### Add Cookie Generator

`/utils/cookies.ts`

### Add Client Utility

`/utils/client.ts`

## Deploy current example

Inspect what was created, confirm our actions are not complaining any more.

Let's deploy
