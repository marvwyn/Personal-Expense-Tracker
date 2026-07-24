import { Injectable } from '@nestjs/common';
import { CreateExpenseOperation } from '../operation/create-expense.operation';
import { UpdateExpenseOperation } from '../operation/update-expense.operation';
import { DeleteExpenseOperation } from '../operation/delete-expense.operation';
import { GetExpenseOperation } from '../operation/get-expense.operation';
import { ListExpensesOperation } from '../operation/list-expenses.operation';
import { GetExpenseSummaryOperation } from '../operation/get-expense-summary.operation';
import { CreateExpenseDto } from '../dto/create-expense.dto';
import { UpdateExpenseDto } from '../dto/update-expense.dto';
import { QueryExpensesDto } from '../dto/query-expenses.dto';
import { QueryExpenseSummaryDto } from '../dto/query-expense-summary.dto';

// The module's public facade -- what the controller depends on. Each method
// delegates to the operation that actually does the work; operations stay
// swappable/testable in isolation without changing this class's shape.
@Injectable()
export class ExpensesService {
  constructor(
    private readonly createExpenseOperation: CreateExpenseOperation,
    private readonly updateExpenseOperation: UpdateExpenseOperation,
    private readonly deleteExpenseOperation: DeleteExpenseOperation,
    private readonly getExpenseOperation: GetExpenseOperation,
    private readonly listExpensesOperation: ListExpensesOperation,
    private readonly getExpenseSummaryOperation: GetExpenseSummaryOperation,
  ) {}

  create(userId: string, dto: CreateExpenseDto) {
    return this.createExpenseOperation.execute(userId, dto);
  }

  update(id: string, userId: string, dto: UpdateExpenseDto) {
    return this.updateExpenseOperation.execute(id, userId, dto);
  }

  remove(id: string, userId: string) {
    return this.deleteExpenseOperation.execute(id, userId);
  }

  findOne(id: string, userId: string) {
    return this.getExpenseOperation.execute(id, userId);
  }

  findAll(userId: string, query: QueryExpensesDto) {
    return this.listExpensesOperation.execute(userId, query);
  }

  summary(userId: string, range: QueryExpenseSummaryDto) {
    return this.getExpenseSummaryOperation.execute(userId, range);
  }
}
