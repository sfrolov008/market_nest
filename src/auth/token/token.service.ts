import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import * as process from 'process';

import { User } from '../../user/entities/users.model';
import { Token } from './entities/token.model';
import { ActionToken } from './entities/action-token.model';
import { IJwtPayload } from '../../common/interfaces/auth.interface';
import { ActionTokenEnum } from '../../common/enums/action-token.enum';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(Token) private tokensModel: typeof Token,
    @InjectModel(ActionToken) private actionTokensModel: typeof ActionToken,
  ) {}

  generateTokens(user: IJwtPayload) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      account: user.account,
      status: user.status,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET as string,
      expiresIn: '30m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET as string,
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  validateRefreshToken(token) {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });
    } catch (e) {
      return null;
    }
  }

  async saveToken(token, userId: string): Promise<Token> {
    const tokenData = await this.tokensModel.findOne({ where: { userId } });
    if (tokenData) {
      tokenData.refreshToken = token;
      return tokenData.save();
    }
    return this.tokensModel.create({
      refreshToken: token,
      userId: userId,
    });
  }

  async removeToken(refreshToken: string) {
    return this.tokensModel.destroy({ where: { refreshToken: refreshToken } });
  }

  async findToken(refreshToken: string) {
    return this.tokensModel.findOne({ where: { refreshToken: refreshToken } });
  }

  async generateActionToken(user: User, tokenType: ActionTokenEnum) {
    const payload = {
      id: user.id,
      email: user.email,
    };
    let secret = '';

    switch (tokenType) {
      case ActionTokenEnum.activate:
        secret = process.env.ACTIVATE_TOKEN_SECRET as string;
        break;
      case ActionTokenEnum.forgot:
        secret = process.env.FORGOT_TOKEN_SECRET as string;
        break;
    }
    const actionToken = this.jwtService.sign(payload, {
      secret,
      expiresIn: '7d',
    });
    await this.actionTokensModel.create({
      actionToken: actionToken,
      actionTokenType: tokenType,
      userId: user.id,
    });
    return actionToken;
  }

  validateActionToken(token: string, tokenType: ActionTokenEnum) {
    try {
      let secret = '';

      switch (tokenType) {
        case ActionTokenEnum.activate:
          secret = process.env.ACTIVATE_TOKEN_SECRET as string;
          break;
        case ActionTokenEnum.forgot:
          secret = process.env.FORGOT_TOKEN_SECRET as string;
          break;
      }
      return this.jwtService.verify(token, { secret });
    } catch (e) {
      throw new HttpException('Token is not valid', HttpStatus.UNAUTHORIZED);
    }
  }
}
