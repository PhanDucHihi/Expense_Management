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
  findAll() {
    return this.transactionService.findAll();
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
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionService.update(+id, updateTransactionDto);
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
