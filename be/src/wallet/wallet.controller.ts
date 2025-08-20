import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import type { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interfact';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  create(
    @Body() createWalletDto: CreateWalletDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.sub;
    return this.walletService.create(userId, createWalletDto);
  }

  @Get()
  findAll() {
    return this.walletService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) walletId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.sub;
    return this.walletService.findOne(userId, walletId);
  }

  @Patch(':id')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) walletId: number,
    @Body() updateWalletDto: UpdateWalletDto,
  ) {
    const userId = req.user.sub;
    return this.walletService.update(userId, walletId, updateWalletDto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) walletId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.sub;
    return this.walletService.remove(userId, walletId);
  }
}
