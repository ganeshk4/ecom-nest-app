import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class CustomerAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    let pass = false;
    const request = context.switchToHttp().getRequest();
    const headers = request.headers || {};
    const session = request.session;

    if (headers.secret === process.env.API_SECRET) {
      pass = true;
    }
    if (pass && session && session?.user?.id) {
      pass = true;
    } else {
      pass = false;
    }
    return pass;
  }
}
