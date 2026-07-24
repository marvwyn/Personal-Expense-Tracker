import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { expenseSchema, type ExpenseFormValues } from '../schemas/expense.schema';
import { useCreateExpenseMutation, useUpdateExpenseMutation, type Expense } from '../expensesApi';
import { useListCategoriesQuery } from '../../categories/categoriesApi';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';

interface ExpenseFormProps {
  expense?: Expense;
  onClose: () => void;
}

export function ExpenseForm({ expense, onClose }: ExpenseFormProps) {
  const { data: categories } = useListCategoriesQuery();
  const [createExpense, { isLoading: isCreating }] = useCreateExpenseMutation();
  const [updateExpense, { isLoading: isUpdating }] = useUpdateExpenseMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: expense?.amount,
      description: expense?.description ?? '',
      date: expense?.date ?? new Date().toISOString().slice(0, 10),
      categoryId: expense?.category.id ?? '',
    },
  });

  const onSubmit = async (values: ExpenseFormValues) => {
    if (expense) {
      await updateExpense({ id: expense.id, body: values }).unwrap();
    } else {
      await createExpense(values).unwrap();
    }
    onClose();
  };

  return (
    <Modal title={expense ? 'Edit expense' : 'New expense'} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Amount"
          type="number"
          step="0.01"
          error={errors.amount?.message}
          {...register('amount', { valueAsNumber: true })}
        />
        <Input label="Description" error={errors.description?.message} {...register('description')} />
        <Input label="Date" type="date" error={errors.date?.message} {...register('date')} />
        <Select label="Category" error={errors.categoryId?.message} {...register('categoryId')}>
          <option value="">Select a category</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isCreating || isUpdating}>
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
}
