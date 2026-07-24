import { HttpStatus } from '@nestjs/common';
import { DomainException } from '../../../common/exceptions/domain.exception';

export class EmailAlreadyRegisteredException extends DomainException {
  constructor(email: string) {
    super(`Email "${email}" is already registered`, HttpStatus.CONFLICT);
  }
}

export class InvalidCredentialsException extends DomainException {
  constructor() {
    super('Invalid email or password', HttpStatus.UNAUTHORIZED);
  }
}
