/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from 'src/bcypt/bcrypt.service';
import { UserService } from 'src/user/user.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private bcryptService: BcryptService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signIn(email: string, password: string): Promise<any> {
    const foundUser = await this.userService.findOneByEmail(email);
    const isMatch = await this.bcryptService.comparePassword(
      password,
      foundUser?.hashedPassword,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Email or password is invalid');
    }

    const payload = {
      sub: foundUser.id,
      username: foundUser.name,
      role: foundUser.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(
      {
        sub: foundUser.id,
      },
      {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '2h',
      },
    );

    return {
      foundUser,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string): Promise<any> {
    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        },
      );

      const user = await this.userService.findOne(payload.sub);

      const newAccessToken = await this.jwtService.signAsync({
        sub: user.id,
        username: user.name,
        role: user.role,
      });

      return { accessToken: newAccessToken, user };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
