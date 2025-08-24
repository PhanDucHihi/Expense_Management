/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { AuthService } from './auth.service';
import { Public } from 'src/decorators/public.decorator';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UsePipes(new ValidationPipe())
  @Post('login')
  @HttpCode(200)
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const { accessToken, refreshToken, foundUser } =
      await this.authService.signIn(signInDto.email, signInDto.password);

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 2 * 60 * 60 * 1000,
    });

    return { accessToken, user: foundUser };
  }

  @Public()
  @Get('set-cookies')
  setCookies(@Res({ passthrough: true }) res: Response) {
    res.cookie('userId', '12345', { httpOnly: true, path: '/' });
    res.cookie('theme', 'dark', { maxAge: 3600000, path: '/' });
    res.cookie('language', 'en-US', {
      secure: true,
      sameSite: 'strict',
      path: '/',
    });
    return 'Multiple cookies set';
  }

  @Public()
  @Post('refresh-token')
  @HttpCode(200)
  async refreshToken(@Req() req: Request) {
    const refreshToken: string = (req.cookies as Record<string, string>)?.jwt;
    if (!refreshToken)
      throw new UnauthorizedException('Refresh token not found');

    const { accessToken, user } =
      await this.authService.refreshToken(refreshToken);

    return { accessToken, user };
  }
}
