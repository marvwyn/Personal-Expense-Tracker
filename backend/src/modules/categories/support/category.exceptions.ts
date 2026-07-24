import { HttpStatus } from '@nestjs/common';
import { DomainException } from '../../../common/exceptions/domain.exception';

export class CategoryNotFoundException extends DomainException {
  constructor() {
    super('Category not found', HttpStatus.NOT_FOUND);
  }
}

export class CategoryNameTakenException extends DomainException {
  constructor(name: string) {
    super(`Category "${name}" already exists`, HttpStatus.CONFLICT);
  }
}

export class CategoryInUseException extends DomainException {
  constructor() {
    super(
      'Category cannot be deleted while expenses reference it',
      HttpStatus.CONFLICT,
    );
  }
}
