import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  color: z
    .string()
    .regex(/^#[0-9a-f]{6}$/i, 'Must be a hex color like #a1b2c3')
    .optional()
    .or(z.literal('')),
  icon: z.string().max(50).optional().or(z.literal('')),
});
export type CategoryFormValues = z.infer<typeof categorySchema>;
