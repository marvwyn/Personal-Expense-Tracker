# Backend — NestJS API

See the root [ARCHITECTURE.md](../ARCHITECTURE.md) for why the code is
structured the way it is (`module / controller / operation / services /
domain / persistence / support` per feature).

## Setup

1. Copy the env template and fill in real values:

   ```
   cp .env.example .env
   ```

   - `DATABASE_URL` — a Postgres connection string from a hosted free
     provider (Neon, Supabase, ...). SSL is enabled by default
     (`rejectUnauthorized: false`), matching what these providers expect.
   - `JWT_SECRET` — any long random string.
   - `JWT_EXPIRY` — access token lifetime in **seconds** (default: 86400 = 1 day).

2. Install dependencies:

   ```
   npm install
   ```

3. Run migrations against your database:

   ```
   npm run migration:run
   ```

4. Start the dev server:

   ```
   npm run start:dev
   ```

   The API listens on `http://localhost:3000` by default. `GET /health`
   should return `{"status":"ok"}` once the database connection succeeds.

## Migrations

Schema changes go through migrations, not `synchronize: true`. Both the
running app (`src/database/database.module.ts`) and the CLI
(`src/database/data-source.ts`) share one connection-options factory
(`src/database/typeorm.config.ts`) so they can't drift apart.

```
npm run migration:generate -- src/database/migrations/SomeChange
npm run migration:run
npm run migration:revert
```

## API surface

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/auth/register` | public | `{ email, password, name }` |
| POST | `/auth/login` | public | `{ email, password }` → `{ accessToken, user }` |
| GET | `/auth/me` | required | current user profile |
| GET/POST | `/categories` | required | scoped to the current user |
| GET/PATCH/DELETE | `/categories/:id` | required | delete is blocked (409) if expenses reference it |
| GET | `/expenses` | required | `?page&limit&categoryId&dateFrom&dateTo&search&sortBy=date\|amount&sortOrder=ASC\|DESC` |
| GET | `/expenses/summary` | required | `?dateFrom&dateTo` → totals + per-category breakdown |
| GET/POST | `/expenses/:id` | required | |
| PATCH/DELETE | `/expenses/:id` | required | |
| GET | `/health` | public | |

Send `Authorization: Bearer <accessToken>` on every protected request.
