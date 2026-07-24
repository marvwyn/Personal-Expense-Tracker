import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryOrmEntity } from './category.orm-entity';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(CategoryOrmEntity)
    private readonly repository: Repository<CategoryOrmEntity>,
  ) {}

  findAllForUser(userId: string): Promise<CategoryOrmEntity[]> {
    return this.repository.find({ where: { userId }, order: { name: 'ASC' } });
  }

  findByIdForUser(
    id: string,
    userId: string,
  ): Promise<CategoryOrmEntity | null> {
    return this.repository.findOne({ where: { id, userId } });
  }

  findByNameForUser(
    name: string,
    userId: string,
  ): Promise<CategoryOrmEntity | null> {
    return this.repository.findOne({ where: { name, userId } });
  }

  save(entity: Partial<CategoryOrmEntity>): Promise<CategoryOrmEntity> {
    return this.repository.save(entity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
