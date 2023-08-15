import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';

import { User } from '../../user/entities/users.model';
import { Token } from './entities/token.model';
import { ActionToken } from './entities/action-token.model';
import { TokenService } from './token.service';


@Module({
  imports: [SequelizeModule.forFeature([Token, ActionToken, User])],
  providers: [TokenService, JwtService],
  exports: [TokenService],
})
export class TokenModule {}
