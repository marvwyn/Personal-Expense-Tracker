import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional({ nullable: true, example: '#FF5733' })
  color: string | null;

  @ApiPropertyOptional({ nullable: true })
  icon: string | null;

  @ApiProperty()
  createdAt: Date;
}
