export interface AppConfig {
  port: number;
  corsOrigin: string;
  database: {
    url: string;
  };
  jwt: {
    secret: string;
    expirySeconds: number;
  };
}

export default (): AppConfig => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  database: {
    url: process.env.DATABASE_URL as string,
  },
  jwt: {
    secret: process.env.JWT_SECRET as string,
    // Seconds, not a duration string like "1d" -- keeps the type a plain
    // number, which @nestjs/jwt's expiresIn accepts without extra casting.
    expirySeconds: parseInt(process.env.JWT_EXPIRY ?? '86400', 10),
  },
});
