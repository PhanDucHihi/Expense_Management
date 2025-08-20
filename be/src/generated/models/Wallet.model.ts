import { Prisma } from "@prisma/client";
import { IsInt, IsDefined, IsString, IsIn, IsOptional, IsDate } from "class-validator";
import { User, Transaction, Budget, RecurringTransaction } from "./";
import { getEnumValues } from "../helpers";
import { Wallettype } from "../enums";

export class Wallet {
    @IsDefined()
    @IsInt()
    id!: number;

    @IsDefined()
    @IsString()
    name!: string;

    @IsDefined()
    @IsIn(getEnumValues(Wallettype))
    type!: Wallettype;

    @IsDefined()
    balance!: Prisma.Decimal;

    @IsOptional()
    startAmount?: Prisma.Decimal;

    @IsOptional()
    targetAmount?: Prisma.Decimal;

    @IsOptional()
    @IsDate()
    deadline?: Date;

    @IsDefined()
    user!: User;

    @IsDefined()
    @IsInt()
    userId!: number;

    @IsDefined()
    transactions!: Transaction[];

    @IsDefined()
    budgets!: Budget[];

    @IsDefined()
    recurringTransactions!: RecurringTransaction[];
}
