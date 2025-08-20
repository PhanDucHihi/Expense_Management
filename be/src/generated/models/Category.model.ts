import { IsInt, IsDefined, IsString, IsIn, IsOptional } from "class-validator";
import { User, Budget, RecurringTransaction, Transaction } from "./";
import { getEnumValues } from "../helpers";
import { CategoryType } from "../enums";

export class Category {
    @IsDefined()
    @IsInt()
    id!: number;

    @IsDefined()
    @IsString()
    name!: string;

    @IsDefined()
    @IsIn(getEnumValues(CategoryType))
    type!: CategoryType;

    @IsDefined()
    @IsString()
    icon!: string;

    @IsOptional()
    @IsInt()
    parentId?: number;

    @IsOptional()
    parent?: Category;

    @IsDefined()
    children!: Category[];

    @IsOptional()
    user?: User;

    @IsOptional()
    @IsInt()
    userId?: number;

    @IsDefined()
    budgets!: Budget[];

    @IsDefined()
    recurringTransactions!: RecurringTransaction[];

    @IsDefined()
    transactions!: Transaction[];
}
