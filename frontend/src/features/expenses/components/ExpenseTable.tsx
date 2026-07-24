import { useMemo } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type SortingState,
  type OnChangeFn,
} from '@tanstack/react-table';
import type { Expense } from '../expensesApi';
import type { PaginationMeta } from '../../../types/pagination';
import { formatCurrency } from '../../../lib/formatCurrency';
import { formatDate } from '../../../lib/formatDate';
import { Button } from '../../../components/ui/Button';
import { Pagination } from '../../../components/ui/Pagination';

const columnHelper = createColumnHelper<Expense>();

interface ExpenseTableProps {
  data: Expense[];
  meta: PaginationMeta;
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  onPageChange: (page: number) => void;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

export function ExpenseTable({
  data,
  meta,
  sorting,
  onSortingChange,
  onPageChange,
  onEdit,
  onDelete,
}: ExpenseTableProps) {
  const columns = useMemo(
    () => [
      columnHelper.accessor('date', {
        header: 'Date',
        cell: (info) => formatDate(info.getValue()),
        enableSorting: true,
      }),
      columnHelper.accessor('description', {
        header: 'Description',
        enableSorting: false,
      }),
      columnHelper.accessor((row) => row.category.name, {
        id: 'category',
        header: 'Category',
        enableSorting: false,
        cell: (info) => (
          <span className="inline-flex items-center gap-2">
            {info.row.original.category.color && (
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ backgroundColor: info.row.original.category.color as string }}
              />
            )}
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('amount', {
        header: 'Amount',
        enableSorting: true,
        cell: (info) => (
          <span className="block text-right font-medium">{formatCurrency(info.getValue())}</span>
        ),
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: (info) => (
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => onEdit(info.row.original)}>
              Edit
            </Button>
            <Button variant="danger" onClick={() => onDelete(info.row.original)}>
              Delete
            </Button>
          </div>
        ),
      }),
    ],
    [onEdit, onDelete],
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount: meta.totalPages || -1,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col gap-3">
      <table className="w-full text-left text-sm">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400"
            >
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={`py-2 ${header.column.getCanSort() ? 'cursor-pointer select-none' : ''}`}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {{ asc: ' ▲', desc: ' ▼' }[header.column.getIsSorted() as string] ?? ''}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-100 dark:border-gray-800">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="py-2 text-gray-900 dark:text-gray-100">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="py-6 text-center text-gray-400">
                No expenses found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination page={meta.page} totalPages={meta.totalPages} onPageChange={onPageChange} />
    </div>
  );
}
