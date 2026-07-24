import { baseApi } from '../../api/baseApi';

export interface Category {
  id: string;
  name: string;
  color: string | null;
  icon: string | null;
  createdAt: string;
}

export interface CategoryInput {
  name: string;
  color?: string;
  icon?: string;
}

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listCategories: builder.query<Category[], void>({
      query: () => '/categories',
      providesTags: (result) =>
        result
          ? [...result.map((c) => ({ type: 'Category' as const, id: c.id })), { type: 'Category' as const, id: 'LIST' }]
          : [{ type: 'Category' as const, id: 'LIST' }],
    }),
    createCategory: builder.mutation<Category, CategoryInput>({
      query: (body) => ({ url: '/categories', method: 'POST', body }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),
    updateCategory: builder.mutation<Category, { id: string; body: Partial<CategoryInput> }>({
      query: ({ id, body }) => ({ url: `/categories/${id}`, method: 'PATCH', body }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Category', id },
        { type: 'Category', id: 'LIST' },
      ],
    }),
    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({ url: `/categories/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Category', id },
        { type: 'Category', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useListCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
