import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/users.model';
import { S3Module } from '../s3/s3.module';
import { AuthModule } from '../auth/auth.module';
import { Token } from '../auth/token/entities/token.model';
import { ActionToken } from '../auth/token/entities/action-token.model';
import { Ads } from '../ads/entities/ads.model';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Ads, Token, ActionToken]),
    forwardRef(() => AuthModule),
    S3Module,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
