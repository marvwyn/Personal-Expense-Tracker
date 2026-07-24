import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dto/login.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { UserRepository } from '../persistence/user.repository';
import { PasswordHashingService } from '../support/password-hashing.service';
import { InvalidCredentialsException } from '../support/auth.exceptions';
import { JwtPayload } from '../support/jwt-payload.type';

@Injectable()
export class LoginUserOperation {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHashing: PasswordHashingService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: LoginDto): Promise<AuthResponseDto> {
    const email = dto.email.trim().toLowerCase();
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new InvalidCredentialsException();
    }

    const passwordMatches = await this.passwordHashing.compare(
      dto.password,
      user.passwordHash,
    );
    if (!passwordMatches) {
      throw new InvalidCredentialsException();
    }

    const payload: JwtPayload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: { id: user.id, email: user.email, name: user.name },
    };
  }
}
