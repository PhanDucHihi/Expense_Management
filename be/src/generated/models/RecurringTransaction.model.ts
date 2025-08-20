import { Prisma } from "@prisma/client";
import { IsInt, IsDefined, IsIn, IsDate } from "class-validator";
import { User, Wallet, Category } from "./";
import { getEnumValues } from "../helpers";
import { RecurringTransactionType } from "../enums";

export class RecurringTransaction {
    @IsDefined()
    @IsInt()
    id!: number;

    @IsDefined()
    amount!: Prisma.Decimal;

    @IsDefined()
    @IsIn(getEnumValues(RecurringTransactionType))
    frequency!: RecurringTransactionType;

    @IsDefined()
    @IsDate()
    next_run_date!: Date;

    @IsDefined()
    user!: User;

    @IsDefined()
    @IsInt()
    userId!: number;

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
}
