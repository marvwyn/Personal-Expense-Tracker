import { useState, useEffect } from 'react';
import { useListCategoriesQuery } from '../../categories/categoriesApi';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';

export interface ExpenseFilterValues {
  categoryId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

interface ExpenseFiltersProps {
  value: ExpenseFilterValues;
  onChange: (value: ExpenseFilterValues) => void;
}

export function ExpenseFilters({ value, onChange }: ExpenseFiltersProps) {
  const { data: categories } = useListCategoriesQuery();
  const [search, setSearch] = useState(value.search ?? '');

  // Debounce the free-text search so we don't fire a request on every
  // keystroke; category/date filters apply immediately since they're
  // discrete choices, not typed input.
  useEffect(() => {
    const handle = setTimeout(() => {
      if (search !== (value.search ?? '')) {
        onChange({ ...value, search: search || undefined });
      }
    }, 300);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Select
        aria-label="Category"
        value={value.categoryId ?? ''}
        onChange={(e) => onChange({ ...value, categoryId: e.target.value || undefined })}
      >
        <option value="">All categories</option>
        {categories?.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </Select>
      <Input
        type="date"
        aria-label="From date"
        value={value.dateFrom ?? ''}
        onChange={(e) => onChange({ ...value, dateFrom: e.target.value || undefined })}
      />
      <Input
        type="date"
        aria-label="To date"
        value={value.dateTo ?? ''}
        onChange={(e) => onChange({ ...value, dateTo: e.target.value || undefined })}
      />
      <Input
        type="text"
        placeholder="Search description…"
        aria-label="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}
