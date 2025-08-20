import { IsInt, IsDefined, IsString, IsIn, IsDate } from "class-validator";
import { Category, Wallet, Transaction, Budget, RecurringTransaction } from "./";
import { getEnumValues } from "../helpers";
import { Role } from "../enums";

export class User {
    @IsDefined()
    @IsInt()
    id!: number;

    @IsDefined()
    @IsString()
    email!: string;

    @IsDefined()
    @IsString()
    name!: string;

    @IsDefined()
    @IsString()
    password!: string;

    @IsDefined()
    @IsString()
    imageUrl!: string;

    @IsDefined()
    @IsIn(getEnumValues(Role))
    role!: Role;

    @IsDefined()
    categories!: Category[];

    @IsDefined()
    wallets!: Wallet[];

    @IsDefined()
    transactions!: Transaction[];

    @IsDefined()
    budgets!: Budget[];

    @IsDefined()
    recurringTransactions!: RecurringTransaction[];

    @IsDefined()
    @IsDate()
    createdAt!: Date;

    @IsDefined()
    @IsDate()
    updatedAt!: Date;
}
