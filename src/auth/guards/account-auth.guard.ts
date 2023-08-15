import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AccountsGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredAccounts = this.reflector.get<string[]>(
      'accounts',
      context.getHandler(),
    );

    if (!requiredAccounts || requiredAccounts.length === 0) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('User is not authorized or unavailable');
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = this.jwtService.verify(token);

    if (!decodedToken || !decodedToken.account) {
      throw new UnauthorizedException('User is not authorized or unavailable');
    }

    const userAccount: string = decodedToken.account;

    if (!requiredAccounts.includes(userAccount)) {
      throw new UnauthorizedException('User is not authorized or unavailable');
    }

    return true;
  }
}
