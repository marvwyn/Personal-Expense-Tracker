import { Column, Entity } from 'typeorm';
import { BaseOrmEntity } from '../../../database/base.orm-entity';

@Entity('users')
export class UserOrmEntity extends BaseOrmEntity {
  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column()
  name: string;
}
