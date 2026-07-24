import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { RegisterDto } from '../dto/register.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { User } from '../domain/user.domain';
import { UserRepository } from '../persistence/user.repository';
import { PasswordHashingService } from '../support/password-hashing.service';
import { AuthMapper } from '../support/auth.mapper';
import { EmailAlreadyRegisteredException } from '../support/auth.exceptions';

@Injectable()
export class RegisterUserOperation {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHashing: PasswordHashingService,
  ) {}

  async execute(dto: RegisterDto): Promise<UserResponseDto> {
    const email = dto.email.trim().toLowerCase();
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new EmailAlreadyRegisteredException(email);
    }

    const passwordHash = await this.passwordHashing.hash(dto.password);
    const user = User.create({
      id: randomUUID(),
      email,
      name: dto.name,
      passwordHash,
      createdAt: new Date(),
    });

    const saved = await this.userRepository.save({
      id: user.id,
      email: user.email,
      name: user.name,
      passwordHash: user.passwordHash,
    });

    return AuthMapper.toResponseDto(AuthMapper.toDomain(saved));
  }
}
