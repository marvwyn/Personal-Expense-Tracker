import { IsDateString, IsOptional } from 'class-validator';

export class QueryExpenseSummaryDto {
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;
}
