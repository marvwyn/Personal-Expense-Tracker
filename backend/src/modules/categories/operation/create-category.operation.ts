import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { CategoryResponseDto } from '../dto/category-response.dto';
import { Category } from '../domain/category.domain';
import { CategoryRepository } from '../persistence/category.repository';
import { CategoryMapper } from '../support/category.mapper';
import { CategoryNameTakenException } from '../support/category.exceptions';

@Injectable()
export class CreateCategoryOperation {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(
    userId: string,
    dto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const existing = await this.categoryRepository.findByNameForUser(
      dto.name.trim(),
      userId,
    );
    if (existing) {
      throw new CategoryNameTakenException(dto.name);
    }

    const category = Category.create({
      id: randomUUID(),
      userId,
      name: dto.name,
      color: dto.color,
      icon: dto.icon,
      createdAt: new Date(),
    });

    const saved = await this.categoryRepository.save({
      id: category.id,
      userId: category.userId,
      name: category.name,
      color: category.color,
      icon: category.icon,
    });

    return CategoryMapper.toResponseDto(CategoryMapper.toDomain(saved));
  }
}
