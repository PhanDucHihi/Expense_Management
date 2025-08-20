import { Prisma } from "@prisma/client";
import { IsInt, IsDefined, IsIn, IsDate, IsString, IsOptional } from "class-validator";
import { Wallet, Category, User } from "./";
import { getEnumValues } from "../helpers";
import { TransactionType } from "../enums";

export class Transaction {
    @IsDefined()
    @IsInt()
    id!: number;

    @IsDefined()
    amount!: Prisma.Decimal;

    @IsDefined()
    @IsIn(getEnumValues(TransactionType))
    type!: TransactionType;

    @IsDefined()
    @IsDate()
    transaction_date!: Date;

    @IsOptional()
    @IsString()
    note?: string;

    @IsDefined()
    wallet!: Wallet;

    @IsDefined()
    @IsInt()
    walletId!: number;

    @IsDefined()
    category!: Category;

    @IsDefined()
    @IsInt()
    categoryId!: number;

    @IsDefined()
    user!: User;

    @IsDefined()
    @IsInt()
    userId!: number;
}
