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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../../common/decorators/api-paginated-response.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../../common/types/authenticated-user.type';
import { ExpensesService } from '../services/expenses.service';
import { CreateExpenseDto } from '../dto/create-expense.dto';
import { UpdateExpenseDto } from '../dto/update-expense.dto';
import { QueryExpensesDto } from '../dto/query-expenses.dto';
import { QueryExpenseSummaryDto } from '../dto/query-expense-summary.dto';
import { ExpenseResponseDto } from '../dto/expense-response.dto';
import { ExpenseSummaryResponseDto } from '../dto/expense-summary-response.dto';

@ApiTags('expenses')
@ApiBearerAuth('access-token')
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  // Registered before ':id' so 'summary' isn't swallowed by the :id route.
  @Get('summary')
  @ApiOperation({ summary: 'Get total and per-category expense totals' })
  @ApiOkResponse({ type: ExpenseSummaryResponseDto })
  summary(
    @Query() query: QueryExpenseSummaryDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.expensesService.summary(user.id, query);
  }

  @Get()
  @ApiOperation({ summary: 'List expenses for the current user' })
  @ApiPaginatedResponse(ExpenseResponseDto)
  list(
    @Query() query: QueryExpensesDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.expensesService.findAll(user.id, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single expense by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: ExpenseResponseDto })
  get(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.expensesService.findOne(id, user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create an expense' })
  @ApiCreatedResponse({ type: ExpenseResponseDto })
  create(
    @Body() dto: CreateExpenseDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.expensesService.create(user.id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an expense' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: ExpenseResponseDto })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateExpenseDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.expensesService.update(id, user.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an expense' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiNoContentResponse()
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    await this.expensesService.remove(id, user.id);
  }
}
