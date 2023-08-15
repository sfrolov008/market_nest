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
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('User is not authorized or unavailable');
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = this.jwtService.verify(token);

    if (!decodedToken || !decodedToken.role) {
      throw new UnauthorizedException('User is not authorized or unavailable');
    }

    const userRole: string = decodedToken.role;
    if (!requiredRoles.includes(userRole)) {
      throw new UnauthorizedException('User is not authorized or unavailable');
    }

    return true;
  }
}
