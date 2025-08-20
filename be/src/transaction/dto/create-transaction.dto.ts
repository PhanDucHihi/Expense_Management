import { TransactionType } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateTransactionDto {
  @IsPositive()
  amount: number;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsDateString()
  transaction_date: string;

  @IsString()
  @IsOptional()
  note?: string;

  @IsInt()
  walletId: number;

  @IsInt()
  categoryId: number;
}
