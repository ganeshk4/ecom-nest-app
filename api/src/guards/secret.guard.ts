import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class SecretAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const request = context.switchToHttp().getRequest();
    const headers = request.headers || {};
    if (headers.secret !== process.env.API_SECRET) {
      return false;
    }
    return true;
  }
}