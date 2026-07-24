# Frontend — React SPA

See the root [ARCHITECTURE.md](../ARCHITECTURE.md) for the reasoning behind
the RTK Query / TanStack Table / React Hook Form + Zod patterns used here.

## Setup

1. Copy the env template:

   ```
   cp .env.example .env
   ```

   `VITE_API_BASE_URL` should point at the running backend
   (`http://localhost:3000` by default).

2. Install dependencies and start the dev server:

   ```
   npm install
   npm run dev
   ```

   The app runs at `http://localhost:5173`.

## Folder structure

```
src/
  app/            Redux store setup, typed hooks
  api/baseApi.ts  RTK Query base (auth header injection, 401 handling)
  features/
    auth/         login/register forms, auth slice, authApi
    categories/   category list + modal form, categoriesApi
    expenses/     TanStack Table, filters, summary cards, expensesApi
  components/     shared UI primitives + layout + ProtectedRoute
  routes/         react-router route tree
```

## Notes

- Auth token is stored in `localStorage` — a deliberate simplicity choice
  for this demo (see ARCHITECTURE.md for the tradeoff vs. httpOnly cookies).
- Expense list pagination/sorting/filtering is server-side — the table asks
  the backend for each page rather than fetching everything and slicing it
  client-side.
