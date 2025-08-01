import { Injectable } from '@nestjs/common';
import { GOOGLE_CALLBACk_URL } from '../../common/config/config';
import axios from 'axios';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UserObject, JWT_Object } from './interfaces/interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  getRedirectUrl(): string {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    redirectUrl.searchParams.set('client_id', clientId);
    redirectUrl.searchParams.set('redirect_uri', GOOGLE_CALLBACk_URL);
    redirectUrl.searchParams.set('response_type', 'code');
    redirectUrl.searchParams.set('scope', 'email profile');
    return redirectUrl.toString();
  }

  async exchangeCodeForToken(code: string): Promise<any> {
    const { data } = await axios.post(
      'https://oauth2.googleapis.com/token',
      {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_CALLBACk_URL,
        grant_type: 'authorization_code',
      },
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );
    return data;
  }

  async getUserProfile(accessToken: string): Promise<any> {
    const { data } = await axios.get(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return data;
  }

  async createJWTToken(user: UserObject): Promise<JWT_Object> {
    const accessToken = await this.jwtService.signAsync(user);
    return {
      accessToken: accessToken,
    };
  }

  async registerUser(email: string, name: string): Promise<any> {
    let user = await this.userService.isExist(email);
    if (!user) user = await this.userService.create({ email, name });
    return this.createJWTToken({ email: email, id: user._id });
  }
}
