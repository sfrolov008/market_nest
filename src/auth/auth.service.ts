import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import * as process from 'process';

import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import { TokenService } from './token/token.service';
import { Token } from './token/entities/token.model';
import { ActionToken } from './token/entities/action-token.model';
import { LoginDto, RegistrationDto } from './dtos/auth.dto';
import { ActionTokenEnum } from '../common/enums/action-token.enum';
import { MailEnum } from '../common/enums/mail.enum';
import { UserStatusEnum } from '../common/enums/user-status.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,

    @InjectModel(Token) private tokenModel: typeof Token,
    @InjectModel(ActionToken) private actionTokenModel: typeof ActionToken,
  ) {}

  async registration(userData: RegistrationDto) {
    const existUser = await this.userService.findByEmail(userData.email);
    if (existUser) {
      throw new HttpException(
        `User with ${userData.email} already exist`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await bcrypt.hash(userData.password, 5);
    const user = await this.userService.create({
      ...userData,
      password: hashPassword,
    });
    if (user) {
      const actionToken = await this.tokenService.generateActionToken(
        user,
        ActionTokenEnum.activate,
      );
      const activationLink = `${process.env.API_URL}/activate/${actionToken}`;
      await this.mailService.send(user.email, 'ACTIVATE', MailEnum.ACTIVATE, {
        link: activationLink,
      });
      const tokens = this.tokenService.generateTokens(user);
      await this.tokenService.saveToken(tokens.refreshToken, user.id);
      return { ...tokens, user };
    }
  }

  async login(loginData: LoginDto) {
    const existUser = await this.userService.findByEmail(loginData.email);
    if (!existUser) {
      throw new HttpException(
        `!Incorrect email or password`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const isPassValid = await bcrypt.compare(
      loginData.password,
      existUser.password,
    );
    if (!isPassValid) {
      throw new HttpException(
        '!Incorrect email or password',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.userService.getOne(existUser.id);
    const tokens = this.tokenService.generateTokens(user);
    await this.tokenService.saveToken(tokens.refreshToken, user.id);
    return { ...tokens, user };
  }

  async logout(refreshToken: string) {
    await this.tokenService.removeToken(refreshToken);
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    const userData = this.tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await this.tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw new UnauthorizedException();
    }
    const user = await this.userService.getOne(userData.id);
    const tokens = this.tokenService.generateTokens(user);
    await this.tokenService.saveToken(tokens.refreshToken, user.id);
    return { ...tokens, user };
  }

  async activateAccount(token: string) {
    const checkedToken = this.tokenService.validateActionToken(
      token,
      ActionTokenEnum.activate,
    );
    const user = await this.userService.getOne(checkedToken.id);
    await user.update({ status: UserStatusEnum.active });
    await this.actionTokenModel.destroy({
      where: {
        userId: checkedToken.id,
        actionTokenType: ActionTokenEnum.activate,
      },
    });
  }

  async sendResetEmail(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with ${email} not found`);
    }
    const actionToken = await this.tokenService.generateActionToken(
      user,
      ActionTokenEnum.forgot,
    );
    const forgotLink = `${process.env.API_URL}/forgot/password/${actionToken}`;
    await this.mailService.send(user.email, 'FORGOT', MailEnum.FORGOT, {
      link: forgotLink,
    });
  }

  async setNewPassword(token: string, password: string) {
    const checkedToken = this.tokenService.validateActionToken(
      token,
      ActionTokenEnum.forgot,
    );
    const user = await this.userService.getOne(checkedToken.id);
    const hashPassword = await bcrypt.hash(password, 5);
    await user.update({ password: hashPassword });
    await this.actionTokenModel.destroy({
      where: {
        userId: checkedToken.id,
        actionTokenType: ActionTokenEnum.forgot,
      },
    });
  }
}
