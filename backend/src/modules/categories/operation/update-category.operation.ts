import { Injectable } from '@nestjs/common';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CategoryResponseDto } from '../dto/category-response.dto';
import { Category } from '../domain/category.domain';
import { CategoryRepository } from '../persistence/category.repository';
import { CategoryMapper } from '../support/category.mapper';
import {
  CategoryNameTakenException,
  CategoryNotFoundException,
} from '../support/category.exceptions';

@Injectable()
export class UpdateCategoryOperation {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(
    id: string,
    userId: string,
    dto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const existing = await this.categoryRepository.findByIdForUser(id, userId);
    if (!existing) {
      throw new CategoryNotFoundException();
    }

    if (dto.name && dto.name.trim() !== existing.name) {
      const nameTaken = await this.categoryRepository.findByNameForUser(
        dto.name.trim(),
        userId,
      );
      if (nameTaken) {
        throw new CategoryNameTakenException(dto.name);
      }
    }

    const merged = Category.create({
      id: existing.id,
      userId: existing.userId,
      name: dto.name ?? existing.name,
      color: dto.color ?? existing.color,
      icon: dto.icon ?? existing.icon,
      createdAt: existing.createdAt,
    });

    const saved = await this.categoryRepository.save({
      id: merged.id,
      userId: merged.userId,
      name: merged.name,
      color: merged.color,
      icon: merged.icon,
    });

    return CategoryMapper.toResponseDto(CategoryMapper.toDomain(saved));
  }
}
