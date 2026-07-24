import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpensesController } from './controller/expenses.controller';
import { CreateExpenseOperation } from './operation/create-expense.operation';
import { UpdateExpenseOperation } from './operation/update-expense.operation';
import { DeleteExpenseOperation } from './operation/delete-expense.operation';
import { GetExpenseOperation } from './operation/get-expense.operation';
import { ListExpensesOperation } from './operation/list-expenses.operation';
import { GetExpenseSummaryOperation } from './operation/get-expense-summary.operation';
import { ExpensesService } from './services/expenses.service';
import { ExpenseOrmEntity } from './persistence/expense.orm-entity';
import { ExpenseRepository } from './persistence/expense.repository';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExpenseOrmEntity]),
    forwardRef(() => CategoriesModule),
  ],
  controllers: [ExpensesController],
  providers: [
    ExpensesService,
    CreateExpenseOperation,
    UpdateExpenseOperation,
    DeleteExpenseOperation,
    GetExpenseOperation,
    ListExpensesOperation,
    GetExpenseSummaryOperation,
    ExpenseRepository,
  ],
  exports: [ExpenseRepository],
})
export class ExpensesModule {}
