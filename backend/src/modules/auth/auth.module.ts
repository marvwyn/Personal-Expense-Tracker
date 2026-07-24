import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './controller/auth.controller';
import { RegisterUserOperation } from './operation/register-user.operation';
import { LoginUserOperation } from './operation/login-user.operation';
import { GetCurrentUserOperation } from './operation/get-current-user.operation';
import { AuthService } from './services/auth.service';
import { PasswordHashingService } from './support/password-hashing.service';
import { UserOrmEntity } from './persistence/user.orm-entity';
import { UserRepository } from './persistence/user.repository';
import { JwtStrategy } from './support/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('jwt.secret'),
        signOptions: { expiresIn: config.get<number>('jwt.expirySeconds') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    RegisterUserOperation,
    LoginUserOperation,
    GetCurrentUserOperation,
    PasswordHashingService,
    UserRepository,
    JwtStrategy,
  ],
  exports: [UserRepository],
})
export class AuthModule {}
