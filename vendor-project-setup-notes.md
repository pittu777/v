# Vendor Project --- Setup and Database Integration Notes

*Last updated: 19 October 2026*

This document records the current setup of the `D:\vendor` project, what
has been configured, and the safe next steps for continuing database
integration.

## 1. Project goal

Build a professional vending-machine management application with:

-   Next.js App Router and TypeScript
-   Clerk for authentication
-   Supabase PostgreSQL as the hosted database
-   Prisma ORM for typed server-side database access and migrations
-   Zustand for client-side state
-   Tailwind CSS 4 and the existing shadcn setup

**Architecture principle:** Clerk handles identity and authentication;
PostgreSQL stores application data; Prisma accesses the database from
server-side code. Never expose database credentials in browser code.

## 2. Confirmed dependencies

  Package                 Version / status
  ----------------------- ------------------
  `next`                  `16.4.2`
  `react` / `react-dom`   `19.3.0`
  `@clerk/nextjs`         `^7.9.17`
  `prisma`                `7.10.1`
  `@prisma/client`        `7.10.1`
  `@prisma/adapter-pg`    `7.10.1`
  `pg`                    `^8.23.1`
  `dotenv`                `^18.0.8`
  `zustand`               `^5.0.15`
  `tailwindcss`           `^4`
  `typescript`            `^5`

## 3. Clerk authentication status

Clerk was installed and linked to an application named `vendor`. Sign-up
and sign-in are reported to be working.

Routes are grouped under `app/(auth)/`, with a separate `layout.tsx`.
The `(auth)` group name does not appear in URLs; the public routes
remain `/sign-in` and `/sign-up`.

The Clerk pages use `SignIn` / `SignUp` wrapped in React `Suspense`,
added after Next.js reported that `usePathname()` was being used outside
a Suspense boundary.

**Security reminder:** sign-in and sign-up pages do not automatically
protect every dashboard route, Route Handler, or Server Action. Add and
test server-side authorization before treating business data as private.

## 4. Prisma and Supabase status

Supabase PostgreSQL is the intended database. A connection string is
expected in the root `.env` as `DATABASE_URL`. Never share the value of
`DATABASE_URL`, Clerk keys, or other secrets.

### Current files

``` text
D:\vendor\
├── prisma7.config.ts
├── prisma.config.ts          # Old config may remain; inspect before using
├── prisma.config.v8.bak      # Backup made during configuration changes
├── prisma/
│   └── schema.prisma
└── src/
    └── prisma/
        ├── contract.prisma   # Left over from the earlier Prisma 8 contract setup
        ├── contract.json
        ├── contract.d.ts
        └── db.ts
```

The old `src/prisma` contract files came from an earlier Prisma 8
release-candidate setup. They are not the conventional Prisma 7 schema
workflow intended for this project. Do not delete them until the working
setup is confirmed.

### Active Prisma config

The CLI reported loading `prisma7.config.ts`, whose contents were:

``` ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
```

The schema at `prisma/schema.prisma` was:

``` prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}
```

Validation succeeded:

``` powershell
npx prisma validate --config prisma7.config.ts
```

Result: `The schema at prisma\schema.prisma is valid`.

The configured generated-client path is `src/generated/prisma`. Do not
assume generated files exist until client generation succeeds.

### Why there are two config filenames

The initial Prisma 8 CLI created `prisma.config.ts` importing
`@prisma/cli-engine` and `@prisma/orm-postgres/config`. After switching
to Prisma 7, those packages were removed. That old config caused CLI
errors because it imported a missing package.

A backup was created with:

``` powershell
Copy-Item prisma.config.ts prisma.config.v8.bak
```

Initialization then created `prisma7.config.ts`, and the CLI loaded that
file. Continue using `--config prisma7.config.ts` while both filenames
exist. Do not blindly delete either file; first verify which config the
CLI loads and preserve the working config.


PS D:\vendor> npx prisma validate --config prisma7.config.ts
Loaded Prisma config from prisma7.config.ts.

Prisma schema loaded from prisma\schema.prisma.
The schema at prisma\schema.prisma is valid 🚀
PS D:\vendor> npx prisma migrate dev --config prisma7.config.ts --name add_user
Loaded Prisma config from prisma7.config.ts.

## 5. Useful commands

Run commands from the project root:

``` powershell
cd D:\vendor
```

Check versions:

``` powershell
npm ls prisma @prisma/client @prisma/adapter-pg
```

Validate the schema:

``` powershell
npx prisma validate --config prisma7.config.ts
```

Format the schema:

``` powershell
npx prisma format --config prisma7.config.ts
```

Generate Prisma Client after the schema is ready:

``` powershell
npx prisma generate --config prisma7.config.ts
```

Use `--config prisma7.config.ts` for Prisma commands until the duplicate
config situation is deliberately cleaned up.

## 6. Next database step --- pending

The next planned step is to verify the database connection and inspect
whether Supabase already contains tables.

First, back up the schema:

``` powershell
Copy-Item prisma\schema.prisma prisma\schema.before-pull.prisma
```

Then introspect the database:

``` powershell
npx prisma db pull --config prisma7.config.ts
```

`db pull` reads the existing database structure and updates the local
Prisma schema to represent it. It does not create tables, but it can
overwrite the schema file, so the backup matters.

Inspect the command output and `prisma/schema.prisma` afterward. If the
database is empty, define the first application model instead of
assuming existing models were found.

**Do not run `prisma migrate dev` or `prisma db push` until the
connection and current database state are understood.** No migration or
table creation has been confirmed as completed in these notes.

## 7. Environment variable safety

-   Keep secrets in a local environment file excluded by `.gitignore`.
-   Never commit `.env`, database connection strings, Clerk secret keys,
    or private API keys.
-   Never prefix a PostgreSQL connection string or database password
    with `NEXT_PUBLIC_`.
-   `NEXT_PUBLIC_SUPABASE_URL` and
    `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are Supabase client
    configuration values, not substitutes for Prisma's `DATABASE_URL`.
-   Supabase JavaScript packages were installed during the initial setup
    and later considered unnecessary because the intended database
    access path is Prisma and authentication is handled by Clerk. Check
    `package.json` before assuming they remain installed.
-   Do not replace the entire `.env` file when adding a variable;
    preserve existing Clerk settings.

## 8. Existing app behavior to preserve

The inventory dashboard worked before authentication/database changes.
It contains Zustand stores for inventory filters/selection and a
persisted cart. The cart uses Zustand `persist` with storage key
`cart-storage`.

When adding database functionality:

-   Keep client-side UI state separate from persistent server-side
    business records.
-   Use Zustand for client state such as cart interactions and filters.
-   Use Prisma only from server-side code.
-   Validate request input before writing to the database.
-   Verify the authenticated Clerk user and their permissions
    server-side for private operations.
-   Never trust a client-provided user ID to determine record ownership.

## 9. Dependency audit warning

An npm install reported **9 high-severity vulnerabilities** after
package changes. Do not blindly run:

``` powershell
npm audit fix --force
```

It can introduce breaking updates. Review the report separately:

``` powershell
npm audit
```

Resolve dependency findings deliberately, checking whether proposed
updates change Next.js, React, Clerk, or Prisma versions.

## 10. Progress checklist

-   [x] Existing Next.js dashboard ran successfully.
-   [x] Clerk installed and linked to the `vendor` application.
-   [x] Sign-up and sign-in pages working.
-   [x] Authentication route group and separate layout created.
-   [x] Supabase PostgreSQL chosen as the intended database.
-   [x] Prisma packages aligned on `7.10.1`.
-   [x] `prisma/schema.prisma` created.
-   [x] `prisma7.config.ts` created and loaded by the CLI.
-   [x] `prisma validate --config prisma7.config.ts` succeeded.
-   [ ] Confirm `.env` has `DATABASE_URL` without exposing its value.
-   [ ] Back up the schema and run `prisma db pull` to inspect the
    existing database.
-   [ ] Decide the first application data model, such as vending machine
    or product.
-   [ ] Generate Prisma Client.
-   [ ] Create/apply the first migration after reviewing the schema and
    database state.
-   [ ] Add a server-only Prisma client module using the PostgreSQL
    adapter.
-   [ ] Add a test server-side read/write operation.
-   [ ] Associate records with Clerk user IDs and enforce server-side
    authorization.
-   [ ] Review and resolve npm audit findings.

------------------------------------------------------------------------

**Last confirmed checkpoint:** Prisma 7.10.1 is installed, the active
config is `prisma7.config.ts`, and `prisma/schema.prisma` validates. The
next safe action is to back up the schema and introspect Supabase with
`prisma db pull`; this has not yet been confirmed as completed.









PS D:\vendor> npx prisma validate --config prisma7.config.ts
Loaded Prisma config from prisma7.config.ts.

Prisma schema loaded from prisma\schema.prisma.
The schema at prisma\schema.prisma is valid 🚀
PS D:\vendor> npx prisma migrate dev --config prisma7.config.ts --name add_user
Loaded Prisma config from prisma7.config.ts.

PS D:\vendor> npx prisma generate --config prisma7.config.ts
Loaded Prisma config from prisma7.config.ts.

Prisma schema loaded from prisma\schema.prisma.

✔ Generated Prisma Client (7.10.1) to .\src\generated\prisma in 95ms

PS D:\vendor> 
