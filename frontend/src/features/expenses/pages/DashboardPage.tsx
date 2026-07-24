import { useState } from 'react';
import type { SortingState } from '@tanstack/react-table';
import { useListExpensesQuery, useDeleteExpenseMutation, type Expense, type ExpenseFilters as ApiExpenseFilters } from '../expensesApi';
import { ExpenseFilters, type ExpenseFilterValues } from '../components/ExpenseFilters';
import { ExpenseTable } from '../components/ExpenseTable';
import { ExpenseForm } from '../components/ExpenseForm';
import { ExpenseSummaryCards } from '../components/ExpenseSummaryCards';
import { Button } from '../../../components/ui/Button';

const PAGE_SIZE = 20;

export function DashboardPage() {
  const [filters, setFilters] = useState<ExpenseFilterValues>({});
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([{ id: 'date', desc: true }]);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteExpense] = useDeleteExpenseMutation();

  const queryFilters: ApiExpenseFilters = {
    page,
    limit: PAGE_SIZE,
    categoryId: filters.categoryId,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    search: filters.search,
    sortBy: (sorting[0]?.id as 'date' | 'amount') ?? 'date',
    sortOrder: sorting[0]?.desc ? 'DESC' : 'ASC',
  };

  const { data } = useListExpensesQuery(queryFilters);

  const handleFiltersChange = (value: ExpenseFilterValues) => {
    setFilters(value);
    setPage(1);
  };

  const handleDelete = async (expense: Expense) => {
    if (!confirm(`Delete expense "${expense.description}"?`)) return;
    await deleteExpense({ id: expense.id, filters: queryFilters });
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <Button onClick={() => setShowCreate(true)}>New expense</Button>
      </div>

      <ExpenseSummaryCards dateFrom={filters.dateFrom} dateTo={filters.dateTo} />
      <ExpenseFilters value={filters} onChange={handleFiltersChange} />

      {data && (
        <ExpenseTable
          data={data.data}
          meta={data.meta}
          sorting={sorting}
          onSortingChange={setSorting}
          onPageChange={setPage}
          onEdit={setEditing}
          onDelete={handleDelete}
        />
      )}

      {(showCreate || editing) && (
        <ExpenseForm
          expense={editing ?? undefined}
          onClose={() => {
            setShowCreate(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
