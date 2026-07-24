import { Injectable } from '@nestjs/common';
import { ExpenseResponseDto } from '../dto/expense-response.dto';
import { ExpenseRepository } from '../persistence/expense.repository';
import { ExpenseMapper } from '../support/expense.mapper';
import { ExpenseNotFoundException } from '../support/expense.exceptions';

@Injectable()
export class GetExpenseOperation {
  constructor(private readonly expenseRepository: ExpenseRepository) {}

  async execute(id: string, userId: string): Promise<ExpenseResponseDto> {
    const expense = await this.expenseRepository.findByIdForUser(id, userId);
    if (!expense) {
      throw new ExpenseNotFoundException();
    }
    return ExpenseMapper.toResponseDto(expense);
  }
}
