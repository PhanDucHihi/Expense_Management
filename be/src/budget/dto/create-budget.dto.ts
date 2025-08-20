import { IsDateString, IsInt, IsPositive } from 'class-validator';

export class CreateBudgetDto {
  @IsPositive()
  amount_limit: number;

  @IsDateString()
  start_date: string;

  @IsDateString()
  end_date: string;

  @IsInt()
  categoryId: number;

  @IsInt()
  walletId: number;
}
