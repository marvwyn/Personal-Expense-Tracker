import { User } from '../domain/user.domain';
import { UserOrmEntity } from '../persistence/user.orm-entity';
import { UserResponseDto } from '../dto/user-response.dto';

export const AuthMapper = {
  toDomain(orm: UserOrmEntity): User {
    return User.create({
      id: orm.id,
      email: orm.email,
      name: orm.name,
      passwordHash: orm.passwordHash,
      createdAt: orm.createdAt,
    });
  },

  toResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };
  },
};
