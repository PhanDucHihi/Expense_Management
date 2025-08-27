import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BudgetService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: number,
    createBudgetDto: CreateBudgetDto,
    force = false,
  ) {
    const startDate = new Date(createBudgetDto.start_date);
    const endDate = new Date(createBudgetDto.end_date);

    const overlappingBudget = await this.prisma.budget.findFirst({
      where: {
        userId,
        categoryId: createBudgetDto.categoryId,
        AND: [
          { start_date: { lte: endDate } },
          { end_date: { gte: startDate } },
        ],
      },
    });

    if (overlappingBudget && !force) {
      return {
        warning: true,
        message: 'Budget trùng thời gian với budget khác cùng category',
        overlappingBudget,
      };
    }

    if (overlappingBudget && force) {
      await this.prisma.budget.delete({
        where: { id: overlappingBudget.id },
      });
    }

    const newBudget = await this.prisma.budget.create({
      data: {
        ...createBudgetDto,
        start_date: startDate,
        end_date: endDate,
        userId,
      },
    });

    return { warning: false, budget: newBudget };
  }

  // findAll() {
  //   return `This action returns all budget`;
  // }
  async findByMonth(
    userId: number,
    walletId: number,
    year: number,
    month: number,
  ) {
    // Xác định ngày đầu & cuối tháng
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);

    // Lấy tất cả budgets của user trong khoảng tháng này
    const budgets = await this.prisma.budget.findMany({
      where: {
        userId,
        walletId,
        // budget nào có khoảng thời gian nằm trong tháng
        OR: [
          {
            start_date: { lte: endOfMonth },
            end_date: { gte: startOfMonth },
          },
        ],
      },
      include: {
        category: true,
        wallet: true,
      },
    });

    // Tính toán spent và remaining cho từng budget
    const results = await Promise.all(
      budgets.map(async (budget) => {
        const spentAgg = await this.prisma.transaction.aggregate({
          _sum: { amount: true },
          where: {
            categoryId: budget.categoryId,
            walletId: budget.walletId,
            transaction_date: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
        });

        const spent = spentAgg._sum.amount ?? 0;
        return {
          ...budget,
          spent,
          remaining: budget.amount_limit.minus(spent),
        };
      }),
    );

    return results;
  }

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
