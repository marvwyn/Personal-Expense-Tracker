export interface ExpenseResponseDto {
  id: string;
  amount: number;
  description: string;
  date: string;
  category: { id: string; name: string; color: string | null };
  createdAt: Date;
}
