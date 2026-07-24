# Architecture

This repo is a study/reference project. The goal isn't feature breadth — it's
demonstrating two things clearly enough that a colleague can learn from them:

1. A layered NestJS backend structure (`module / controller / services /
   operation / domain / persistence / support`).
2. A modern React data-fetching stack (RTK Query + TanStack Table + React
   Hook Form + Zod).

## Backend: the layering pattern

Every feature module (`auth`, `categories`, `expenses`) is a vertical slice
with the same subfolders. Request flow through a module always goes in one
direction:

```
Controller  →  Service  →  Operation  →  { Domain, Repository }  →  ORM Entity
                                 ↑                                       |
                                 └───────────── Mapper (support/) ────────┘
```

- **`dto/`** — request/response shapes with validation decorators, sitting
  at the module root as a sibling of every layer, not nested inside
  `controller/`. DTOs are a contract shared across the module — operations
  take them as parameters and mappers build response DTOs — so nesting them
  under `controller/` would make `operation/` and `support/` reach "up" into
  the controller layer to import them, backwards from the real call
  direction (controller → operation). As a sibling folder, any layer can
  depend on the wire format without depending on the controller itself.
- **`controller/`** — HTTP only. Routes and validation wiring. No business
  logic, and no `operation/` imports — it depends on `services/` only.
- **`services/`** — one class per module (`CategoriesService`,
  `ExpensesService`, `AuthService`), named after the module the same way
  `categories.controller.ts` is. This is the module's public facade and the
  only thing the controller depends on. Its methods are a thin 1:1
  delegation to `operation/` (`create()` calls `CreateCategoryOperation`,
  `remove()` calls `DeleteCategoryOperation`, ...) — it's what makes the
  module's capabilities visible and stable at a glance, the way a
  standard NestJS `<name>.service.ts` would, while `operation/` stays free
  to be one focused class per use case underneath it. It's also the layer
  that's allowed to call `domain/` logic directly for a check that doesn't
  warrant its own operation — none of the three modules currently need that
  escape hatch, but the option belongs here, not in `operation/`.
- **`operation/`** — one class per use case (`CreateExpenseOperation`,
  `ListExpensesOperation`, ...), called by `services/`, not by the
  controller directly. An operation orchestrates: fetch what's needed via
  `persistence/`, hand it to `domain/` to apply any rule, persist the
  result, map to a response shape. It also owns **authorization/existence
  checks** — "does this categoryId belong to *this* user" — because those
  are about the current request, not an intrinsic fact about the entities.
  It does not decide business rules itself; it asks `domain/`.
- **`domain/`** — framework-agnostic business shapes (`Expense.create()`,
  `Category.create()`, `User.create()`) with a validating factory function
  enforcing invariants (amount > 0, non-empty name, valid email), plus any
  genuine **business rule**: a fact that's true regardless of who's asking
  or how the data was fetched (e.g. `Category.canBeDeleted(expenseCount)` —
  a category with expenses can't be deleted, independent of which request
  triggered the check). No TypeORM or Nest imports here.
- **`persistence/`** — the ORM entity (`*.orm-entity.ts`, TypeORM decorated)
  and a repository class wrapping `Repository<T>` with the actual query
  methods the module needs.
- **`support/`** — the mapper (`toDomain` / `toOrmEntity` / `toResponseDto`),
  the module's exception classes, and infrastructure utilities that aren't
  business logic at all (`jwt.strategy.ts`, `password-hashing.service.ts` —
  a bcrypt wrapper belongs here, not in `domain/`, because hashing is a
  technical concern, not a rule about the business).

App-wide cross-cutting infrastructure that isn't a business concern for any
one module lives at the top level instead of being duplicated per module:

- `common/` — the global exception filter, the JWT auth guard (`APP_GUARD`),
  `@Public()`/`@CurrentUser()` decorators, shared pagination DTOs.
- `config/` — typed env config + validation (fails fast at boot if
  `DATABASE_URL`/`JWT_SECRET` are missing).
- `database/` — the TypeORM connection factory (shared by the running app
  *and* the migration CLI, so they can't drift), the `BaseOrmEntity` every
  entity extends, and the migrations folder.

### Domain vs. ORM entity — a deliberate, acknowledged tradeoff

For a CRUD-only app with three entities, a full domain/ORM separation is
more ceremony than strictly necessary — a pragmatic team could collapse the
two into one TypeORM-decorated class and still ship correct software.

It's kept here on purpose: the domain/ORM boundary is one of the most
commonly-misunderstood parts of this style of layering, and a working (if
deliberately thin) example is more valuable in a *teaching* repo than in a
disposable CRUD app. The domain layer is intentionally minimal — a validating
factory function plus, where a genuine rule exists, a small predicate method
(`Category.canBeDeleted()`). There are no repository interfaces with
swappable implementations, no aggregates, no domain events. Don't read more
DDD into it than that.

### Cross-module dependency: Categories ↔ Expenses

Expenses needs to validate that a `categoryId` belongs to the current user
(depends on Categories). Categories needs to refuse deleting a category
that still has expenses (depends on Expenses). That's a genuine circular
module dependency, resolved with NestJS's `forwardRef()` on both
`categories.module.ts` and `expenses.module.ts`. This is a real pattern
you'll hit in non-trivial NestJS apps, not something invented for this repo
— see `DeleteCategoryOperation` (injects `ExpenseRepository` to count, then
asks `Category.canBeDeleted()`) and `CreateExpenseOperation` (injects
`CategoryRepository` to check ownership) for the two directions of the
dependency.

The category-in-use check is deliberately proactive (`DeleteCategoryOperation`
checks first and throws a clean `409`) rather than relying on catching the
database's `RESTRICT` foreign key violation — the DB constraint is the
safety net, not the primary mechanism.

## Frontend: the data-fetching stack

- **RTK Query** (`api/baseApi.ts` + one `*Api.ts` per feature) owns all
  server state — no separate loading-state booleans, no manual `fetch`
  calls in components. Tags (`Category`, `Expense`) drive cache
  invalidation: mutations invalidate the `LIST` tag (and their own `id`),
  queries provide tags per row.
- **Optimistic update reference**: `deleteExpense` in
  `features/expenses/expensesApi.ts` patches the cached list immediately in
  `onQueryStarted`, rolls back via `patchResult.undo()` if the request
  fails, and still invalidates on success to reconcile server-computed
  `meta.total`. The same pattern generalizes to any mutation where you want
  the UI to react before the round-trip completes.
- **TanStack Table** (`features/expenses/components/ExpenseTable.tsx`) is
  wired with `manualPagination`/`manualSorting`/`manualFiltering` — sorting
  and pagination state lives in `DashboardPage` and feeds directly into the
  `useListExpensesQuery` args, so the backend's `page/limit/sortBy/sortOrder`
  params drive the table rather than the table filtering/sorting client-side
  data it already fetched.
- **React Hook Form + Zod**: each form has a schema
  (`features/*/schemas/*.schema.ts`) that is the single source of truth for
  both validation and the form's TypeScript type (`z.infer<...>`), wired in
  via `zodResolver`.
- **Auth**: JWT stored in `localStorage` (see `features/auth/authSlice.ts`),
  attached to every request via `baseApi.ts`'s `prepareHeaders`. This is a
  deliberate simplicity tradeoff for a study repo — localStorage is
  readable by injected scripts (XSS risk), while an httpOnly cookie avoids
  that but requires CSRF protection and cross-origin cookie handling
  (`SameSite`, `credentials: 'include'`). Worth knowing the alternative
  exists even though this repo picks the simpler option.

## Where to look first

If you're studying this repo, read `backend/src/modules/expenses/` end to
end first — it's the fully worked example with the richest DTOs and one
side of the cross-module dependency. Start at `services/expenses.service.ts`
(the facade — read it before `operation/`, since it's what the controller
actually calls) then follow one method down into its operation. Then read
`categories/domain/category.domain.ts` and
`categories/operation/delete-category.operation.ts` together — that pair is
the clearest illustration of the domain-vs-operation boundary (a business
rule vs. an authorization check) in the whole repo. `auth` mirrors the same
shape with less going on, so it's deliberately left comment-free.
