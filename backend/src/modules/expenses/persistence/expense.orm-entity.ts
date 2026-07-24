import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseOrmEntity } from '../../../database/base.orm-entity';
import { UserOrmEntity } from '../../auth/persistence/user.orm-entity';
import { CategoryOrmEntity } from '../../categories/persistence/category.orm-entity';

@Entity('expenses')
@Index(['userId', 'date'])
export class ExpenseOrmEntity extends BaseOrmEntity {
  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserOrmEntity;

  @Column({ name: 'category_id' })
  categoryId: string;

  @ManyToOne(() => CategoryOrmEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'category_id' })
  category: CategoryOrmEntity;

  @Column('numeric', { precision: 12, scale: 2 })
  amount: string;

  @Column()
  description: string;

  @Column({ type: 'date' })
  date: string;
}
