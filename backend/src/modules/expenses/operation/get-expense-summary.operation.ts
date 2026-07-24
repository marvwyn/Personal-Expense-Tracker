import { Injectable } from '@nestjs/common';
import { ExpenseRepository } from '../persistence/expense.repository';
import { ExpenseSummaryResponseDto } from '../dto/expense-summary-response.dto';

@Injectable()
export class GetExpenseSummaryOperation {
  constructor(private readonly expenseRepository: ExpenseRepository) {}

  // No domain rule to apply here -- the SUM/GROUP BY is computed in SQL, so
  // this is a fetch plus a numeric reshape, i.e. plain orchestration.
  async execute(
    userId: string,
    range: { dateFrom?: string; dateTo?: string },
  ): Promise<ExpenseSummaryResponseDto> {
    const [total, byCategory] = await Promise.all([
      this.expenseRepository.sumTotal(userId, range),
      this.expenseRepository.sumByCategory(userId, range),
    ]);

    return {
      totalAmount: Number(total),
      byCategory: byCategory.map((c) => ({
        categoryId: c.categoryId,
        categoryName: c.categoryName,
        total: Number(c.total),
      })),
    };
  }
}
