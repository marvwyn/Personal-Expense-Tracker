import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpenseOrmEntity } from './expense.orm-entity';
import { ExpenseFilters } from '../domain/expense.types';

export interface CategoryTotal {
  categoryId: string;
  categoryName: string;
  total: string;
}

@Injectable()
export class ExpenseRepository {
  constructor(
    @InjectRepository(ExpenseOrmEntity)
    private readonly repository: Repository<ExpenseOrmEntity>,
  ) {}

  private scopedQuery(userId: string, filters: Partial<ExpenseFilters>) {
    const qb = this.repository
      .createQueryBuilder('expense')
      .leftJoinAndSelect('expense.category', 'category')
      .where('expense.user_id = :userId', { userId });

    if (filters.categoryId) {
      qb.andWhere('expense.category_id = :categoryId', {
        categoryId: filters.categoryId,
      });
    }
    if (filters.dateFrom) {
      qb.andWhere('expense.date >= :dateFrom', { dateFrom: filters.dateFrom });
    }
    if (filters.dateTo) {
      qb.andWhere('expense.date <= :dateTo', { dateTo: filters.dateTo });
    }
    if (filters.search) {
      qb.andWhere('expense.description ILIKE :search', {
        search: `%${filters.search}%`,
      });
    }
    return qb;
  }

  async findPaginated(
    userId: string,
    filters: ExpenseFilters,
  ): Promise<{ items: ExpenseOrmEntity[]; total: number }> {
    const qb = this.scopedQuery(userId, filters)
      .orderBy(`expense.${filters.sortBy}`, filters.sortOrder)
      .skip((filters.page - 1) * filters.limit)
      .take(filters.limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total };
  }

  findByIdForUser(
    id: string,
    userId: string,
  ): Promise<ExpenseOrmEntity | null> {
    return this.repository.findOne({
      where: { id, userId },
      relations: { category: true },
    });
  }

  save(entity: Partial<ExpenseOrmEntity>): Promise<ExpenseOrmEntity> {
    return this.repository.save(entity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  countByCategoryId(categoryId: string): Promise<number> {
    return this.repository.count({ where: { categoryId } });
  }

  async sumTotal(
    userId: string,
    filters: Pick<ExpenseFilters, 'dateFrom' | 'dateTo'>,
  ): Promise<string> {
    const raw = await this.scopedQuery(userId, filters)
      .select('COALESCE(SUM(expense.amount), 0)', 'sum')
      .getRawOne<{ sum: string }>();
    return raw?.sum ?? '0';
  }

  async sumByCategory(
    userId: string,
    filters: Pick<ExpenseFilters, 'dateFrom' | 'dateTo'>,
  ): Promise<CategoryTotal[]> {
    return this.scopedQuery(userId, filters)
      .select('category.id', 'categoryId')
      .addSelect('category.name', 'categoryName')
      .addSelect('SUM(expense.amount)', 'total')
      .groupBy('category.id')
      .addGroupBy('category.name')
      .orderBy('total', 'DESC')
      .getRawMany<CategoryTotal>();
  }
}
