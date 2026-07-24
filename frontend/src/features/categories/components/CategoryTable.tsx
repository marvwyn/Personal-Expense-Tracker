import { useState } from 'react';
import type { Category } from '../categoriesApi';
import { useDeleteCategoryMutation } from '../categoriesApi';
import { Button } from '../../../components/ui/Button';
import { CategoryForm } from './CategoryForm';

interface CategoryTableProps {
  categories: Category[];
}

export function CategoryTable({ categories }: CategoryTableProps) {
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleDelete = async (category: Category) => {
    if (!confirm(`Delete category "${category.name}"?`)) return;
    try {
      await deleteCategory(category.id).unwrap();
    } catch {
      alert('Could not delete category — it may still have expenses linked to it.');
    }
  };

  return (
    <>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
            <th className="py-2">Name</th>
            <th className="py-2">Color</th>
            <th className="py-2">Icon</th>
            <th className="py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id} className="border-b border-gray-100 dark:border-gray-800">
              <td className="py-2 text-gray-900 dark:text-gray-100">{category.name}</td>
              <td className="py-2">
                {category.color && (
                  <span
                    className="inline-block h-4 w-4 rounded-full align-middle"
                    style={{ backgroundColor: category.color }}
                  />
                )}
              </td>
              <td className="py-2">{category.icon}</td>
              <td className="py-2 text-right space-x-2">
                <Button variant="secondary" onClick={() => setEditing(category)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(category)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
          {categories.length === 0 && (
            <tr>
              <td colSpan={4} className="py-6 text-center text-gray-400">
                No categories yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {editing && <CategoryForm category={editing} onClose={() => setEditing(null)} />}
    </>
  );
}
