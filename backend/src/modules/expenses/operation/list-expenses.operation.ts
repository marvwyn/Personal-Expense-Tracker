import { Injectable } from '@nestjs/common';
import { QueryExpensesDto } from '../dto/query-expenses.dto';
import { ExpenseRepository } from '../persistence/expense.repository';
import { ExpenseMapper } from '../support/expense.mapper';
import {
  buildPaginationMeta,
  PaginatedResponseDto,
} from '../../../common/dto/paginated-response.dto';
import { ExpenseResponseDto } from '../dto/expense-response.dto';

@Injectable()
export class ListExpensesOperation {
  constructor(private readonly expenseRepository: ExpenseRepository) {}

  async execute(
    userId: string,
    query: QueryExpensesDto,
  ): Promise<PaginatedResponseDto<ExpenseResponseDto>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const { items, total } = await this.expenseRepository.findPaginated(
      userId,
      {
        categoryId: query.categoryId,
        dateFrom: query.dateFrom,
        dateTo: query.dateTo,
        search: query.search,
        sortBy: query.sortBy ?? 'date',
        sortOrder: query.sortOrder ?? 'DESC',
        page,
        limit,
      },
    );

    return {
      data: items.map((item) => ExpenseMapper.toResponseDto(item)),
      meta: buildPaginationMeta(page, limit, total),
    };
  }
}
