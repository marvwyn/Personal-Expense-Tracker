import { z } from 'zod';

export const expenseSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  description: z.string().min(1, 'Description is required').max(255),
  date: z.string().min(1, 'Date is required'),
  categoryId: z.string().uuid('Select a category'),
});
export type ExpenseFormValues = z.infer<typeof expenseSchema>;
