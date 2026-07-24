import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema, type CategoryFormValues } from '../schemas/category.schema';
import { useCreateCategoryMutation, useUpdateCategoryMutation, type Category } from '../categoriesApi';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

interface CategoryFormProps {
  category?: Category;
  onClose: () => void;
}

export function CategoryForm({ category, onClose }: CategoryFormProps) {
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name ?? '',
      color: category?.color ?? '',
      icon: category?.icon ?? '',
    },
  });

  const onSubmit = async (values: CategoryFormValues) => {
    const body = { name: values.name, color: values.color || undefined, icon: values.icon || undefined };
    if (category) {
      await updateCategory({ id: category.id, body }).unwrap();
    } else {
      await createCategory(body).unwrap();
    }
    onClose();
  };

  return (
    <Modal title={category ? 'Edit category' : 'New category'} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input label="Name" error={errors.name?.message} {...register('name')} />
        <Input
          label="Color"
          placeholder="#a1b2c3"
          error={errors.color?.message}
          {...register('color')}
        />
        <Input label="Icon" placeholder="🍔" error={errors.icon?.message} {...register('icon')} />
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
