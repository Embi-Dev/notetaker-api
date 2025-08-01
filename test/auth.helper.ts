import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

export const getTestToken = (userId: string, roles: string[] = []) => {
  const configService = new ConfigService();
  return jwt.sign(
    {
      sub: userId,
      roles,
    },
    configService.get('JWT_SECRET') || 'test-secret',
    { expiresIn: '1h' },
  );
};
