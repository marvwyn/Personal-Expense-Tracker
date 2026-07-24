import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateExpenseDto } from '../dto/create-expense.dto';
import { ExpenseResponseDto } from '../dto/expense-response.dto';
import { Expense } from '../domain/expense.domain';
import { ExpenseRepository } from '../persistence/expense.repository';
import { ExpenseMapper } from '../support/expense.mapper';
import { ExpenseCategoryMismatchException } from '../support/expense.exceptions';
import { CategoryRepository } from '../../categories/persistence/category.repository';

@Injectable()
export class CreateExpenseOperation {
  constructor(
    private readonly expenseRepository: ExpenseRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(
    userId: string,
    dto: CreateExpenseDto,
  ): Promise<ExpenseResponseDto> {
    const category = await this.categoryRepository.findByIdForUser(
      dto.categoryId,
      userId,
    );
    if (!category) {
      throw new ExpenseCategoryMismatchException();
    }

    const expense = Expense.create({
      id: randomUUID(),
      userId,
      categoryId: dto.categoryId,
      amount: dto.amount,
      description: dto.description,
      date: dto.date,
      createdAt: new Date(),
    });

    const saved = await this.expenseRepository.save({
      id: expense.id,
      userId: expense.userId,
      categoryId: expense.categoryId,
      amount: expense.amount.toFixed(2),
      description: expense.description,
      date: expense.date,
    });

    const withCategory = await this.expenseRepository.findByIdForUser(
      saved.id,
      userId,
    );
    return ExpenseMapper.toResponseDto(withCategory!);
  }
}
