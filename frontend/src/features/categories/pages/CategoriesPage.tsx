import { useState } from 'react';
import { useListCategoriesQuery } from '../categoriesApi';
import { CategoryTable } from '../components/CategoryTable';
import { CategoryForm } from '../components/CategoryForm';
import { Button } from '../../../components/ui/Button';

export function CategoriesPage() {
  const { data: categories, isLoading } = useListCategoriesQuery();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Categories</h1>
        <Button onClick={() => setShowCreate(true)}>New category</Button>
      </div>
      {isLoading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading…</p>
      ) : (
        <CategoryTable categories={categories ?? []} />
      )}
      {showCreate && <CategoryForm onClose={() => setShowCreate(false)} />}
    </div>
  );
}
