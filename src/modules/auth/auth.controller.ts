import { Controller, Get, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  getRedirectUrl(@Res() res: Response): void {
    const url = this.authService.getRedirectUrl();
    return res.redirect(url);
  }

  @Get('google/callback')
  async authorizeUser(@Query('code') code: string): Promise<string> {
    const authorization = await this.authService.exchangeCodeForToken(code);
    const userInfo = await this.authService.getUserProfile(
      authorization.access_token,
    );
    const accessToken = await this.authService.registerUser(
      userInfo.email || '',
      userInfo.name || '',
    );
    return JSON.stringify(accessToken);
  }
}
