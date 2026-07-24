import { Injectable } from '@nestjs/common';
import { CategoryResponseDto } from '../dto/category-response.dto';
import { CategoryRepository } from '../persistence/category.repository';
import { CategoryMapper } from '../support/category.mapper';

@Injectable()
export class ListCategoriesOperation {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(userId: string): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryRepository.findAllForUser(userId);
    return categories.map((c) =>
      CategoryMapper.toResponseDto(CategoryMapper.toDomain(c)),
    );
  }
}
