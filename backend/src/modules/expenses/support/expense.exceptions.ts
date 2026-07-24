import { HttpStatus } from '@nestjs/common';
import { DomainException } from '../../../common/exceptions/domain.exception';

export class ExpenseNotFoundException extends DomainException {
  constructor() {
    super('Expense not found', HttpStatus.NOT_FOUND);
  }
}

export class ExpenseCategoryMismatchException extends DomainException {
  constructor() {
    super(
      'Category does not belong to the current user',
      HttpStatus.BAD_REQUEST,
    );
  }
}
