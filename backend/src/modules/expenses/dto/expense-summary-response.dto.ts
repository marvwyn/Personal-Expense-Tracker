export interface ExpenseSummaryResponseDto {
  totalAmount: number;
  byCategory: { categoryId: string; categoryName: string; total: number }[];
}
