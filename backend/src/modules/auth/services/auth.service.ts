import { Injectable } from '@nestjs/common';
import { RegisterUserOperation } from '../operation/register-user.operation';
import { LoginUserOperation } from '../operation/login-user.operation';
import { GetCurrentUserOperation } from '../operation/get-current-user.operation';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

// The module's public facade -- what the controller depends on. Each method
// delegates to the operation that actually does the work; operations stay
// swappable/testable in isolation without changing this class's shape.
@Injectable()
export class AuthService {
  constructor(
    private readonly registerUserOperation: RegisterUserOperation,
    private readonly loginUserOperation: LoginUserOperation,
    private readonly getCurrentUserOperation: GetCurrentUserOperation,
  ) {}

  register(dto: RegisterDto) {
    return this.registerUserOperation.execute(dto);
  }

  login(dto: LoginDto) {
    return this.loginUserOperation.execute(dto);
  }

  me(userId: string) {
    return this.getCurrentUserOperation.execute(userId);
  }
}
