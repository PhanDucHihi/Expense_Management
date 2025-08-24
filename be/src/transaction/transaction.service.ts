import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletService } from 'src/wallet/wallet.service';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class TransactionService {
  constructor(
    private prisma: PrismaService,
    private walletService: WalletService,
    private categoryService: CategoryService,
  ) {}

  async create(userId: number, createTransactionDto: CreateTransactionDto) {
    const wallet = await this.walletService.findOne(
      userId,
      createTransactionDto.walletId,
    );

    const category = await this.categoryService.findOne(
      createTransactionDto.categoryId,
    );

    const transaction = await this.prisma.transaction.create({
      data: {
        amount: createTransactionDto.amount,
        type: createTransactionDto.type,
        transaction_date: new Date(createTransactionDto.transaction_date),
        note: createTransactionDto.note,
        categoryId: createTransactionDto.categoryId,
        walletId: createTransactionDto.walletId,
        userId,
      },
    });

    // cập nhật balance nếu là basis
    let newBalance: number = 0;
    if (category?.type === 'EXPENSE') {
      newBalance = wallet.balance.toNumber() - createTransactionDto.amount;
    } else if (category?.type === 'INCOME') {
      newBalance = wallet.balance.toNumber() + createTransactionDto.amount;
    }
    await this.walletService.update(userId, wallet.id, {
      balance: newBalance,
    });

    return transaction;
  }

  async findRecentTransactions(userId: number) {
    // const whereClause: any = { userId };
    const recentTransactions = await this.prisma.transaction.findMany({
      where: {
        userId,
      },
      orderBy: { transaction_date: 'desc' },
      take: 3,
      include: {
        wallet: true,
        category: true,
      },
    });

    return recentTransactions;
  }

  async findByWallet(userId: number, walletId: number) {
    return this.prisma.transaction.findMany({
      where: {
        userId,
        walletId,
      },
    });
  }

  async findByMonth(
    userId: number,
    walletId: number,
    year: number,
    month: number,
  ) {
    const startDate = new Date(year, month - 1, 1); // đầu tháng
    const endDate = new Date(year, month, 1); // đầu tháng tiếp theo

    // Lấy tất cả transaction trong tháng
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        walletId,
        transaction_date: { gte: startDate, lt: endDate },
      },
      orderBy: { transaction_date: 'asc' },
      include: { wallet: true, category: true },
    });

    // Trả về trực tiếp mảng transaction
    return transactions;
  }

  async getMonthlySpent(userId: number, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1); // đầu tháng
    const endDate = new Date(year, month, 1); // đầu tháng tiếp theo

    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        transaction_date: { gte: startDate, lt: endDate },
        category: { type: 'EXPENSE' },
      },
    });

    // Tổng chi tiêu
    const totalSpent = transactions.reduce(
      (sum, tx) => sum + tx.amount.toNumber(), // nếu dùng Decimal
      0,
    );

    return totalSpent;
  }

  findAll(userId: number) {
    return this.prisma.transaction.findMany({
      where: {
        userId,
      },
      include: {
        wallet: true,
        category: true,
      },
    });
  }

  async getTopSpending(userId: number) {
    // Lấy tất cả EXPENSE của user
    const expenses = await this.prisma.transaction.groupBy({
      by: ['categoryId'],
      where: {
        userId,
        type: 'EXPENSE',
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        _sum: {
          amount: 'desc',
        },
      },
      take: 3, // chỉ lấy top 3
    });

    const normalized = expenses.map((e) => ({
      categoryId: e.categoryId,
      total: e._sum.amount ? e._sum.amount.toNumber() : 0,
    }));

    const totalExpense = normalized.reduce((acc, e) => acc + e.total, 0);
    // 2. Lấy thông tin category
    const categories = await this.prisma.category.findMany({
      where: {
        id: { in: normalized.map((e) => e.categoryId) },
      },
      select: {
        id: true,
        name: true,
        icon: true,
      },
    });

    return normalized.map((e) => {
      const category = categories.find((c) => c.id === e.categoryId);
      return {
        categoryId: e.categoryId,
        category: category
          ? { name: category.name, icon: category.icon }
          : null,
        total: e.total,
        percentage: totalExpense
          ? Math.round((e.total / totalExpense) * 100)
          : 0,
      };
    });
  }

  async findOne(userId: number, transactionId: number) {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId, // chỉ lấy transaction của user hiện tại
      },
      include: { wallet: true, category: true },
    });

    if (!transaction) {
      throw new NotFoundException(
        `Transaction with id ${transactionId} not found`,
      );
    }

    return transaction;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  async remove(userId: number, transactionId: number) {
    // Kiểm tra transaction có thuộc user không
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
      },
      include: { category: true },
    });

    if (!transaction) {
      throw new NotFoundException(
        `Transaction with id ${transactionId} not found`,
      );
    }

    const wallet = await this.prisma.wallet.findUnique({
      where: { id: transaction.walletId },
    });

    if (!wallet) throw new NotFoundException('Wallet not found');

    let newBalance = wallet.balance.toNumber();
    const amount = transaction.amount.toNumber(); // chuyển Decimal -> number

    if (transaction.category.type === 'EXPENSE') {
      newBalance += amount; // OK
    } else if (transaction.category.type === 'INCOME') {
      newBalance -= amount; // OK
    }

    await this.walletService.update(userId, wallet.id, {
      balance: newBalance,
    });

    await this.prisma.transaction.delete({ where: { id: transactionId } });

    return { message: 'Transaction deleted successfully', balance: newBalance };
  }
}
