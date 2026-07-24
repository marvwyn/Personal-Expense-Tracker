import { Injectable } from '@nestjs/common';
import { CategoryResponseDto } from '../dto/category-response.dto';
import { CategoryRepository } from '../persistence/category.repository';
import { CategoryMapper } from '../support/category.mapper';
import { CategoryNotFoundException } from '../support/category.exceptions';

@Injectable()
export class GetCategoryOperation {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(id: string, userId: string): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findByIdForUser(id, userId);
    if (!category) {
      throw new CategoryNotFoundException();
    }
    return CategoryMapper.toResponseDto(CategoryMapper.toDomain(category));
  }
}
