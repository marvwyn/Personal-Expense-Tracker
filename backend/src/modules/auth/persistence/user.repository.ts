import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserOrmEntity } from './user.orm-entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repository: Repository<UserOrmEntity>,
  ) {}

  findByEmail(email: string): Promise<UserOrmEntity | null> {
    return this.repository.findOne({ where: { email } });
  }

  findById(id: string): Promise<UserOrmEntity | null> {
    return this.repository.findOne({ where: { id } });
  }

  save(entity: Partial<UserOrmEntity>): Promise<UserOrmEntity> {
    return this.repository.save(entity);
  }
}
