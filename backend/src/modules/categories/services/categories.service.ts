import { Injectable } from '@nestjs/common';
import { CreateCategoryOperation } from '../operation/create-category.operation';
import { UpdateCategoryOperation } from '../operation/update-category.operation';
import { DeleteCategoryOperation } from '../operation/delete-category.operation';
import { GetCategoryOperation } from '../operation/get-category.operation';
import { ListCategoriesOperation } from '../operation/list-categories.operation';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

// The module's public facade -- what the controller depends on. Each method
// delegates to the operation that actually does the work; operations stay
// swappable/testable in isolation without changing this class's shape.
@Injectable()
export class CategoriesService {
  constructor(
    private readonly createCategoryOperation: CreateCategoryOperation,
    private readonly updateCategoryOperation: UpdateCategoryOperation,
    private readonly deleteCategoryOperation: DeleteCategoryOperation,
    private readonly getCategoryOperation: GetCategoryOperation,
    private readonly listCategoriesOperation: ListCategoriesOperation,
  ) {}

  create(userId: string, dto: CreateCategoryDto) {
    return this.createCategoryOperation.execute(userId, dto);
  }

  update(id: string, userId: string, dto: UpdateCategoryDto) {
    return this.updateCategoryOperation.execute(id, userId, dto);
  }

  remove(id: string, userId: string) {
    return this.deleteCategoryOperation.execute(id, userId);
  }

  findOne(id: string, userId: string) {
    return this.getCategoryOperation.execute(id, userId);
  }

  findAll(userId: string) {
    return this.listCategoriesOperation.execute(userId);
  }
}
