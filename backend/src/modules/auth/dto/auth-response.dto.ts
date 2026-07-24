import { UserResponseDto } from './user-response.dto';

export interface AuthResponseDto {
  accessToken: string;
  user: Pick<UserResponseDto, 'id' | 'email' | 'name'>;
}
