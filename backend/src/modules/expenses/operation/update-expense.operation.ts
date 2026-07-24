import { Injectable } from '@nestjs/common';
import { UpdateExpenseDto } from '../dto/update-expense.dto';
import { ExpenseResponseDto } from '../dto/expense-response.dto';
import { Expense } from '../domain/expense.domain';
import { ExpenseRepository } from '../persistence/expense.repository';
import { ExpenseMapper } from '../support/expense.mapper';
import {
  ExpenseCategoryMismatchException,
  ExpenseNotFoundException,
} from '../support/expense.exceptions';
import { CategoryRepository } from '../../categories/persistence/category.repository';

@Injectable()
export class UpdateExpenseOperation {
  constructor(
    private readonly expenseRepository: ExpenseRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(
    id: string,
    userId: string,
    dto: UpdateExpenseDto,
  ): Promise<ExpenseResponseDto> {
    const existing = await this.expenseRepository.findByIdForUser(id, userId);
    if (!existing) {
      throw new ExpenseNotFoundException();
    }

    if (dto.categoryId && dto.categoryId !== existing.categoryId) {
      const category = await this.categoryRepository.findByIdForUser(
        dto.categoryId,
        userId,
      );
      if (!category) {
        throw new ExpenseCategoryMismatchException();
      }
    }

    const merged = Expense.create({
      id: existing.id,
      userId: existing.userId,
      categoryId: dto.categoryId ?? existing.categoryId,
      amount: dto.amount ?? Number(existing.amount),
      description: dto.description ?? existing.description,
      date: dto.date ?? existing.date,
      createdAt: existing.createdAt,
    });

    await this.expenseRepository.save({
      id: merged.id,
      userId: merged.userId,
      categoryId: merged.categoryId,
      amount: merged.amount.toFixed(2),
      description: merged.description,
      date: merged.date,
    });

    const withCategory = await this.expenseRepository.findByIdForUser(
      id,
      userId,
    );
    return ExpenseMapper.toResponseDto(withCategory!);
  }
}
