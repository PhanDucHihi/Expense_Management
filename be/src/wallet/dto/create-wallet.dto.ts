import { Wallettype } from '@prisma/client';
import {
  IsDateString,
  IsDefined,
  IsEnum,
  IsNumber,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateWalletDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsEnum(Wallettype)
  type: Wallettype;

  // @ValidateIf((o: CreateWalletDto) => o.type === Wallettype.BASIS)
  @IsNumber()
  balance: number;

  @ValidateIf((o: CreateWalletDto) => o.type === Wallettype.GOAL)
  @IsNumber()
  startAmount?: number;

  @ValidateIf((o: CreateWalletDto) => o.type === Wallettype.GOAL)
  @IsNumber()
  targetAmount?: number;

  @ValidateIf((o: CreateWalletDto) => o.type === Wallettype.GOAL)
  @IsDateString()
  deadline?: string;
}
