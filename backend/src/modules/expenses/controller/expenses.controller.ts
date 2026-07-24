import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../../common/types/authenticated-user.type';
import { ExpensesService } from '../services/expenses.service';
import { CreateExpenseDto } from '../dto/create-expense.dto';
import { UpdateExpenseDto } from '../dto/update-expense.dto';
import { QueryExpensesDto } from '../dto/query-expenses.dto';
import { QueryExpenseSummaryDto } from '../dto/query-expense-summary.dto';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  // Registered before ':id' so 'summary' isn't swallowed by the :id route.
  @Get('summary')
  summary(
    @Query() query: QueryExpenseSummaryDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.expensesService.summary(user.id, query);
  }

  @Get()
  list(
    @Query() query: QueryExpensesDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.expensesService.findAll(user.id, query);
  }

  @Get(':id')
  get(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.expensesService.findOne(id, user.id);
  }

  @Post()
  create(
    @Body() dto: CreateExpenseDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.expensesService.create(user.id, dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateExpenseDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.expensesService.update(id, user.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    await this.expensesService.remove(id, user.id);
  }
}
