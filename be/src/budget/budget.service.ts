import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BudgetService {
  constructor(private prisma: PrismaService) {}

  create(userId: number, createBudgetDto: CreateBudgetDto) {
    return this.prisma.budget.create({
      data: {
        ...createBudgetDto,
        start_date: new Date(createBudgetDto.start_date),
        end_date: new Date(createBudgetDto.end_date),
        userId,
      },
    });
  }

  // findAll() {
  //   return `This action returns all budget`;
  // }

  async findOne(userId: number, budgetId: number) {
    const budget = await this.prisma.budget.findFirst({
      where: {
        id: budgetId,
        userId,
      },
      include: {
        category: true,
        wallet: true,
      },
    });

    if (!budget) throw new NotFoundException('Budget not found');

    const spentAgg = await this.prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        categoryId: budget.categoryId,
        walletId: budget.walletId,
        transaction_date: {
          gte: budget.start_date,
          lte: budget.end_date,
        },
      },
    });

    const spent = spentAgg._sum.amount ?? 0;
    return {
      ...budget,
      spent,
      remaining: budget.amount_limit.minus(spent),
    };
  }

  update(userId: number, budgetId: number, updateBudgetDto: UpdateBudgetDto) {
    return this.prisma.budget.update({
      where: { id: budgetId, userId },
      data: updateBudgetDto,
    });
  }

  remove(userId: number, budgetId: number) {
    return this.prisma.budget.delete({
      where: {
        id: budgetId,
        userId,
      },
    });
  }
}
