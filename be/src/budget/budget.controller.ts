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
} from '@nestjs/common';
import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import type { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interfact';

@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post()
  create(
    @Req() req: AuthenticatedRequest,
    @Body() createBudgetDto: CreateBudgetDto,
  ) {
    return this.budgetService.create(req.user.sub, createBudgetDto);
  }

  // @Get()
  // findAll() {
  //   return this.budgetService.findAll();

  // }

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
