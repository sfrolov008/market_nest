import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { User } from '../user/entities/users.model';
import { LoginDto, RegistrationDto } from './dtos/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ description: 'Registration new user' })
  @ApiResponse({ status: 201, type: User })
  @Post('/registration')
  async registration(
    @Res() res: Response,
    @Body() data: RegistrationDto,
  ): Promise<Response<User>> {
    const userData = await this.authService.registration(data);
    if ('refreshToken' in userData) {
      return res
        .cookie('refreshToken', userData.refreshToken, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
        })
        .status(HttpStatus.CREATED)
        .json(userData);
    }
  }

  @ApiOperation({ description: 'Login' })
  @ApiResponse({ status: 200 })
  @Post('login')
  async login(@Res() res: Response, @Body() loginData: LoginDto) {
    const userData = await this.authService.login(loginData);
    if ('refreshToken' in userData) {
      return res
        .cookie('refreshToken', userData.refreshToken, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
        })
        .status(HttpStatus.OK)
        .json(userData);
    }
  }
  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({ status: 200 })
  @Post('logout')
  async logout(@Req() req: any, @Res() res: Response) {
    const { refreshToken } = req.cookies;
    res
      .clearCookie('refreshToken')
      .status(HttpStatus.OK)
      .json(await this.authService.logout(refreshToken));
  }

  @ApiOperation({ description: 'Refresh access to the app' })
  @Post('refresh')
  async refresh(@Res() res: Response, @Req() req: any) {
    const { refreshToken } = req.cookies;
    const userData = await this.authService.refresh(refreshToken);
    if ('refreshToken' in userData) {
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.status(HttpStatus.OK).json(userData);
    }
  }

  @ApiOperation({ description: 'Activate new  user account' })
  @Patch('/activate/:token')
  async activateAccount(@Param('token') actionToken: string) {
    await this.authService.activateAccount(actionToken);
  }
  @ApiOperation({ description: 'Reset forgotten password' })
  @Post('/password/forgot')
  async sendResetEmail(@Body() body: { email: string }) {
    await this.authService.sendResetEmail(body.email);
  }
  @ApiOperation({ description: 'Set new password' })
  @Patch('/password/forgot/:token')
  async setNewPassword(
    @Param('token') actionToken: string,
    @Body() body: { password: string },
  ) {
    await this.authService.setNewPassword(actionToken, body.password);
  }
}
