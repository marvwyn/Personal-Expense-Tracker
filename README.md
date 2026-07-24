# Personal Expense Tracker

A small full-stack reference app: register/login, manage expense categories,
log expenses, and browse them in a sortable/filterable/paginated table with
a spend summary.

This project exists primarily as a **study reference** — see
[ARCHITECTURE.md](./ARCHITECTURE.md) for the reasoning behind the folder
structure and the specific patterns it's meant to demonstrate.

## Stack

| Layer | Tools |
|---|---|
| Backend | NestJS, TypeScript, TypeORM, PostgreSQL, JWT auth |
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Data fetching | RTK Query (cache tags, invalidation, optimistic updates) |
| Table | TanStack Table (server-side pagination/sort/filter) |
| Forms | React Hook Form + Zod (shared schema → validation + types) |

## Layout

```
backend/    NestJS API — see backend/README.md
frontend/   React SPA — see frontend/README.md
ARCHITECTURE.md   the layering pattern, explained once
```

Each project is independent (its own `package.json`, `node_modules`) — no
monorepo tooling. `cd` into each and follow its README to run it.

## Quick start

1. Get a free hosted Postgres instance (e.g. [Neon](https://neon.tech) or
   [Supabase](https://supabase.com)) and copy its connection string.
2. Set up and run the backend — see [backend/README.md](./backend/README.md).
3. Set up and run the frontend — see [frontend/README.md](./frontend/README.md).
4. Open http://localhost:5173, register an account, and start logging
   expenses.
