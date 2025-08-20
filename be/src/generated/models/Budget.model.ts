import { Prisma } from "@prisma/client";
import { IsInt, IsDefined, IsDate } from "class-validator";
import { User, Category, Wallet } from "./";

export class Budget {
    @IsDefined()
    @IsInt()
    id!: number;

    @IsDefined()
    amount_limit!: Prisma.Decimal;

    @IsDefined()
    @IsDate()
    start_date!: Date;

    @IsDefined()
    @IsDate()
    end_date!: Date;

    @IsDefined()
    user!: User;

    @IsDefined()
    @IsInt()
    userId!: number;

    @IsDefined()
    category!: Category;

    @IsDefined()
    @IsInt()
    categoryId!: number;

    @IsDefined()
    wallet!: Wallet;

    @IsDefined()
    @IsInt()
    walletId!: number;
}
