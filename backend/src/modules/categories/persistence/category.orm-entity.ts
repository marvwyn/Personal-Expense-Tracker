import { Column, Entity, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseOrmEntity } from '../../../database/base.orm-entity';
import { UserOrmEntity } from '../../auth/persistence/user.orm-entity';

@Entity('categories')
@Index(['userId', 'name'], { unique: true })
export class CategoryOrmEntity extends BaseOrmEntity {
  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserOrmEntity;

  @Column()
  name: string;

  // Explicit `type: 'varchar'` -- TypeORM can't infer a column type from a
  // `string | null` union via reflect-metadata (it reflects as `Object`).
  @Column({ type: 'varchar', nullable: true })
  color: string | null;

  @Column({ type: 'varchar', nullable: true })
  icon: string | null;
}
