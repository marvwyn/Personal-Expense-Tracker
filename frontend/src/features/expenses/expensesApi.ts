import { baseApi } from '../../api/baseApi';
import type { PaginatedResponse } from '../../types/pagination';

// fetchBaseQuery serializes every key it's given, including `undefined`
// values, as the literal string "undefined" -- strip them before they reach
// the querystring so unset filters are simply omitted.
function stripUndefined<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined),
  ) as Partial<T>;
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string;
  category: { id: string; name: string; color: string | null };
  createdAt: string;
}

export interface ExpenseInput {
  amount: number;
  description: string;
  date: string;
  categoryId: string;
}

export interface ExpenseFilters {
  page: number;
  limit: number;
  categoryId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  sortBy: 'date' | 'amount';
  sortOrder: 'ASC' | 'DESC';
}

export interface ExpenseSummary {
  totalAmount: number;
  byCategory: { categoryId: string; categoryName: string; total: number }[];
}

export const expensesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listExpenses: builder.query<PaginatedResponse<Expense>, ExpenseFilters>({
      query: (filters) => ({ url: '/expenses', params: stripUndefined(filters) }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((e) => ({ type: 'Expense' as const, id: e.id })),
              { type: 'Expense' as const, id: 'LIST' },
            ]
          : [{ type: 'Expense' as const, id: 'LIST' }],
    }),
    getExpenseSummary: builder.query<ExpenseSummary, { dateFrom?: string; dateTo?: string }>({
      query: (params) => ({ url: '/expenses/summary', params: stripUndefined(params) }),
      providesTags: [{ type: 'Expense', id: 'SUMMARY' }],
    }),
    createExpense: builder.mutation<Expense, ExpenseInput>({
      query: (body) => ({ url: '/expenses', method: 'POST', body }),
      invalidatesTags: [
        { type: 'Expense', id: 'LIST' },
        { type: 'Expense', id: 'SUMMARY' },
      ],
    }),
    updateExpense: builder.mutation<Expense, { id: string; body: Partial<ExpenseInput> }>({
      query: ({ id, body }) => ({ url: `/expenses/${id}`, method: 'PATCH', body }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Expense', id },
        { type: 'Expense', id: 'LIST' },
        { type: 'Expense', id: 'SUMMARY' },
      ],
    }),
    deleteExpense: builder.mutation<void, { id: string; filters: ExpenseFilters }>({
      query: ({ id }) => ({ url: `/expenses/${id}`, method: 'DELETE' }),
      // Optimistic update reference example: remove the row from the cached
      // list immediately, roll back on failure, and still invalidate on
      // success to reconcile server-computed meta.total/totalPages.
      async onQueryStarted({ id, filters }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          expensesApi.util.updateQueryData('listExpenses', filters, (draft) => {
            draft.data = draft.data.filter((expense) => expense.id !== id);
            draft.meta.total -= 1;
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Expense', id },
        { type: 'Expense', id: 'LIST' },
        { type: 'Expense', id: 'SUMMARY' },
      ],
    }),
  }),
});

export const {
  useListExpensesQuery,
  useGetExpenseSummaryQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
} = expensesApi;
