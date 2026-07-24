import { Expense } from '../domain/expense.domain';
import { ExpenseOrmEntity } from '../persistence/expense.orm-entity';
import { ExpenseResponseDto } from '../dto/expense-response.dto';

export const ExpenseMapper = {
  toDomain(orm: ExpenseOrmEntity): Expense {
    return Expense.create({
      id: orm.id,
      userId: orm.userId,
      categoryId: orm.categoryId,
      amount: Number(orm.amount),
      description: orm.description,
      date: orm.date,
      createdAt: orm.createdAt,
    });
  },

  // Built straight from the ORM entity (with its joined category relation)
  // rather than the domain object, since the nested category summary is a
  // wire-format concern the domain model has no reason to know about.
  toResponseDto(orm: ExpenseOrmEntity): ExpenseResponseDto {
    return {
      id: orm.id,
      amount: Number(orm.amount),
      description: orm.description,
      date: orm.date,
      category: {
        id: orm.category.id,
        name: orm.category.name,
        color: orm.category.color,
      },
      createdAt: orm.createdAt,
    };
  },
};
