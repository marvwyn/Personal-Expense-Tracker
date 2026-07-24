import { HttpStatus } from '@nestjs/common';

// Base class for every module-level exception (support/*.exceptions.ts).
// Carries its own HTTP status mapping so the global filter can translate it
// without a growing if/else chain of instanceof checks per exception type.
export abstract class DomainException extends Error {
  constructor(
    message: string,
    public readonly status: HttpStatus,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}
