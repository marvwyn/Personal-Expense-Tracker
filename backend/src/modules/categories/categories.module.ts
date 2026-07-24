import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from './controller/categories.controller';
import { CreateCategoryOperation } from './operation/create-category.operation';
import { UpdateCategoryOperation } from './operation/update-category.operation';
import { DeleteCategoryOperation } from './operation/delete-category.operation';
import { GetCategoryOperation } from './operation/get-category.operation';
import { ListCategoriesOperation } from './operation/list-categories.operation';
import { CategoriesService } from './services/categories.service';
import { CategoryOrmEntity } from './persistence/category.orm-entity';
import { CategoryRepository } from './persistence/category.repository';
import { ExpensesModule } from '../expenses/expenses.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryOrmEntity]),
    // Categories and Expenses depend on each other (Expenses validates
    // category ownership; Categories checks "is this category in use" before
    // deleting) -- forwardRef breaks the circular module reference.
    forwardRef(() => ExpensesModule),
  ],
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    CreateCategoryOperation,
    UpdateCategoryOperation,
    DeleteCategoryOperation,
    GetCategoryOperation,
    ListCategoriesOperation,
    CategoryRepository,
  ],
  exports: [CategoryRepository],
})
export class CategoriesModule {}
