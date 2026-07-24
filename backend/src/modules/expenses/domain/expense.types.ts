export type ExpenseSortField = 'date' | 'amount';
export type SortOrder = 'ASC' | 'DESC';

export interface ExpenseFilters {
  categoryId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  sortBy: ExpenseSortField;
  sortOrder: SortOrder;
  page: number;
  limit: number;
}
