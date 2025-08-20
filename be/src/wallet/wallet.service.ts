import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  create(userId: number, createWalletDto: CreateWalletDto) {
    return this.prisma.wallet.create({
      data: {
        userId,
        name: createWalletDto.name,
        balance: createWalletDto.balance,
        type: createWalletDto.type,
        deadline:
          createWalletDto.type === 'GOAL' && createWalletDto.deadline
            ? new Date(createWalletDto.deadline)
            : null,
        startAmount:
          createWalletDto.type === 'GOAL' ? createWalletDto.startAmount : null,
        targetAmount:
          createWalletDto.type === 'GOAL' ? createWalletDto.targetAmount : null,
      },
    });
    return `This action returns all wallet`;
  }

  findAll() {
    return `This action returns all wallet`;
  }

  async findOne(userId: number, walletId: number) {
    const wallet = await this.prisma.wallet.findUnique({
      where: {
        id: walletId,
        userId,
      },
    });
    if (!wallet) {
      throw new NotFoundException(`Not found`);
    }
    return wallet;
  }

  async update(
    userId: number,
    walletId: number,
    updateWalletDto: UpdateWalletDto,
  ) {
    const updateWallet = await this.prisma.wallet.update({
      where: {
        userId,
        id: walletId,
      },
      data: {
        ...updateWalletDto,
      },
    });
    return updateWallet;
  }

  remove(userId: number, walletId: number) {
    return this.prisma.wallet.delete({
      where: {
        id: walletId,
        userId,
      },
    });
  }
}
