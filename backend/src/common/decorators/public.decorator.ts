import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

// Opts a single route out of the global JwtAuthGuard (register, login, health).
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
