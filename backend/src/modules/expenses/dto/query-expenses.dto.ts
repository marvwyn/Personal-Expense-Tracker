import {
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import type { ExpenseSortField, SortOrder } from '../domain/expense.types';

export class QueryExpensesDto extends PaginationQueryDto {
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(['date', 'amount'])
  sortBy?: ExpenseSortField = 'date';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: SortOrder = 'DESC';
}
