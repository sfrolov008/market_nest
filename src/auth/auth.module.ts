import { forwardRef, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import * as process from 'process';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { User } from '../user/entities/users.model';
import { S3Module } from '../s3/s3.module';
import { MailModule } from '../mail/mail.module';
import { MailService } from '../mail/mail.service';
import { UserService } from '../user/user.service';
import { Token } from './token/entities/token.model';
import { ActionToken } from './token/entities/action-token.model';
import { TokenService } from './token/token.service';
import { TokenModule } from './token/token.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.ACCESS_TOKEN_SECRET || 'access_token_secret',
      signOptions: {
        expiresIn: '30m',
      },
    }),
    forwardRef(() => UserModule),
    TokenModule,
    S3Module,
    MailModule,
    SequelizeModule.forFeature([Token, ActionToken, User]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, TokenService, UserService, MailService],
  exports: [AuthService],
})
export class AuthModule {}
