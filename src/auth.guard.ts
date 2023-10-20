import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { log } from 'console';
import { fstat } from 'fs';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('guard');
    const request: Request = context.switchToHttp().getRequest();

    // throw new UnauthorizedException();
    return false;
  }
}
