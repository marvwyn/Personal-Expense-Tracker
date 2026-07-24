import { useGetExpenseSummaryQuery } from '../expensesApi';
import { formatCurrency } from '../../../lib/formatCurrency';

interface ExpenseSummaryCardsProps {
  dateFrom?: string;
  dateTo?: string;
}

export function ExpenseSummaryCards({ dateFrom, dateTo }: ExpenseSummaryCardsProps) {
  const { data } = useGetExpenseSummaryQuery({ dateFrom, dateTo });

  return (
    <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">Total spent</p>
        <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          {formatCurrency(data?.totalAmount ?? 0)}
        </p>
      </div>
      <div className="col-span-2 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">By category</p>
        <ul className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
          {data?.byCategory.map((c) => (
            <li key={c.categoryId} className="text-gray-700 dark:text-gray-300">
              {c.categoryName}: <span className="font-medium">{formatCurrency(c.total)}</span>
            </li>
          ))}
          {(!data || data.byCategory.length === 0) && (
            <li className="text-gray-400">No expenses in this range.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
