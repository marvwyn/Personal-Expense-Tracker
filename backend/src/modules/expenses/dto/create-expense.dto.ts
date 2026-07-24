import {
  IsDateString,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateExpenseDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  description: string;

  @IsDateString()
  date: string;

  @IsUUID()
  categoryId: string;
}
