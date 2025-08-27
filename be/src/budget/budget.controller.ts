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
import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import type { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interfact';

@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post()
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() createBudgetDto: CreateBudgetDto,
    @Query('force') force?: string,
  ) {
    const forceFlag = force === 'true';
    const result = await this.budgetService.create(
      req.user.sub,
      createBudgetDto,
      forceFlag,
    );

    return result;
  }

  // @Get()
  // findAll() {
  //   return this.budgetService.findAll();
  //d
  // }

  @Get('month/:walletId')
  findByMonth(
    @Req() req: AuthenticatedRequest,
    @Param('walletId', ParseIntPipe) walletId: number,
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    return this.budgetService.findByMonth(
      req.user.sub,
      walletId,
      Number(year),
      Number(month),
    );
  }

  @Get(':id')
  findOne(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) budgetId: number,
  ) {
    return this.budgetService.findOne(req.user.sub, budgetId);
  }

  @Patch(':id')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) budgetId: number,
    @Body() updateBudgetDto: UpdateBudgetDto,
  ) {
    return this.budgetService.update(req.user.sub, budgetId, updateBudgetDto);
  }

  @Delete(':id')
  remove(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) budgetId: number,
  ) {
    return this.budgetService.remove(req.user.sub, budgetId);
  }
}
