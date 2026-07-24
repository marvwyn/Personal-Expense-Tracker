import { Injectable, NotFoundException } from '@nestjs/common';
import { UserResponseDto } from '../dto/user-response.dto';
import { UserRepository } from '../persistence/user.repository';
import { AuthMapper } from '../support/auth.mapper';

@Injectable()
export class GetCurrentUserOperation {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return AuthMapper.toResponseDto(AuthMapper.toDomain(user));
  }
}
