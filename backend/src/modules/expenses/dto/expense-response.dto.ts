import { ApiProperty } from '@nestjs/swagger';

export class ExpenseCategorySummaryDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true, example: '#FF5733' })
  color: string | null;
}

export class ExpenseResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  description: string;

  @ApiProperty({ example: '2026-07-28' })
  date: string;

  @ApiProperty({ type: ExpenseCategorySummaryDto })
  category: { id: string; name: string; color: string | null };

  @ApiProperty()
  createdAt: Date;
}
