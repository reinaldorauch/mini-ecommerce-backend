import { CanActivate, ExecutionContext } from '@nestjs/common';
import { UserRole } from '../user/user.schema';

export class IsAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return request?.user?.role !== UserRole.Admin;
  }
}
