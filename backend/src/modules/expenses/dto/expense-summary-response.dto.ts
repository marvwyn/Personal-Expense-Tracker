import { ApiProperty } from '@nestjs/swagger';

export class CategorySummaryItemDto {
  @ApiProperty({ format: 'uuid' })
  categoryId: string;

  @ApiProperty()
  categoryName: string;

  @ApiProperty()
  total: number;
}

export class ExpenseSummaryResponseDto {
  @ApiProperty()
  totalAmount: number;

  @ApiProperty({ type: [CategorySummaryItemDto] })
  byCategory: { categoryId: string; categoryName: string; total: number }[];
}
