import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CategoryRepository } from '../persistence/category.repository';
import { CategoryMapper } from '../support/category.mapper';
import {
  CategoryNotFoundException,
  CategoryInUseException,
} from '../support/category.exceptions';
import { ExpenseRepository } from '../../expenses/persistence/expense.repository';

@Injectable()
export class DeleteCategoryOperation {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    @Inject(forwardRef(() => ExpenseRepository))
    private readonly expenseRepository: ExpenseRepository,
  ) {}

  async execute(id: string, userId: string): Promise<void> {
    const existing = await this.categoryRepository.findByIdForUser(id, userId);
    if (!existing) {
      throw new CategoryNotFoundException();
    }

    // Proactive check so the client gets a clear 409 instead of a raw
    // Postgres FK-violation error -- the RESTRICT constraint is the safety net.
    const category = CategoryMapper.toDomain(existing);
    const expenseCount = await this.expenseRepository.countByCategoryId(id);
    if (!category.canBeDeleted(expenseCount)) {
      throw new CategoryInUseException();
    }

    await this.categoryRepository.delete(id);
  }
}
