import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BcyptModule } from './bcypt/bcypt.module';
import { ConfigModule } from '@nestjs/config';
import { ChatGateway } from './chat/chat.gateway';
import { CategoryModule } from './category/category.module';
import { WalletModule } from './wallet/wallet.module';
import { TransactionModule } from './transaction/transaction.module';
import { BudgetModule } from './budget/budget.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule,
    BcyptModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CategoryModule,
    WalletModule,
    TransactionModule,
    BudgetModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
