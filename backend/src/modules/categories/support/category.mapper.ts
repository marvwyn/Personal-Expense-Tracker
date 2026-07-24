import { Category } from '../domain/category.domain';
import { CategoryOrmEntity } from '../persistence/category.orm-entity';
import { CategoryResponseDto } from '../dto/category-response.dto';

export const CategoryMapper = {
  toDomain(orm: CategoryOrmEntity): Category {
    return Category.create({
      id: orm.id,
      userId: orm.userId,
      name: orm.name,
      color: orm.color,
      icon: orm.icon,
      createdAt: orm.createdAt,
    });
  },

  toResponseDto(category: Category): CategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      color: category.color,
      icon: category.icon,
      createdAt: category.createdAt,
    };
  },
};
