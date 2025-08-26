import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import type { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interfact';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.sub;
    return this.transactionService.create(userId, createTransactionDto);
  }

  @Get('recent')
  findRecentTransactions(@Req() req: AuthenticatedRequest) {
    const userId = req.user.sub;
    return this.transactionService.findRecentTransactions(userId);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.transactionService.findAll(req.user.sub);
  }

  @Get('wallet/:walletId')
  findByWalletAndMonth(
    @Req() req: AuthenticatedRequest,
    @Param('walletId', ParseIntPipe) walletId: number,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ) {
    const userId = req.user.sub;
    return this.transactionService.findByMonth(userId, walletId, year, month);
  }

  @Get('top-spending')
  getTopSpending(@Req() req: AuthenticatedRequest) {
    return this.transactionService.getTopSpending(req.user.sub);
  }

  @Get('reportMonth')
  async getReport(@Req() req: AuthenticatedRequest) {
    const userId = req.user.sub;
    const now = new Date();

    // Tháng này
    const spentThisMonth = await this.transactionService.getMonthlySpent(
      userId,
      now.getFullYear(),
      now.getMonth() + 1,
    );

    // Tháng trước
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const spentLastMonth = await this.transactionService.getMonthlySpent(
      userId,
      lastMonthDate.getFullYear(),
      lastMonthDate.getMonth() + 1,
    );

    return { spentThisMonth, spentLastMonth };
  }

  @Get(':id')
  findOne(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const userId = req.user.sub; // user hiện tại
    return this.transactionService.findOne(userId, id);
  }

  @Patch(':id')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionService.update(
      req.user.sub,
      id,
      updateTransactionDto,
    );
  }

  @Delete(':id')
  remove(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const userId = req.user.sub;
    return this.transactionService.remove(userId, id);
  }
}
