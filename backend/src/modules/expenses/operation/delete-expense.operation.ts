import { Injectable } from '@nestjs/common';
import { ExpenseRepository } from '../persistence/expense.repository';
import { ExpenseNotFoundException } from '../support/expense.exceptions';

@Injectable()
export class DeleteExpenseOperation {
  constructor(private readonly expenseRepository: ExpenseRepository) {}

  async execute(id: string, userId: string): Promise<void> {
    const existing = await this.expenseRepository.findByIdForUser(id, userId);
    if (!existing) {
      throw new ExpenseNotFoundException();
    }
    await this.expenseRepository.delete(id);
  }
}
