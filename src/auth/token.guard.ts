import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenGuard implements CanActivate {
  private secret = this.cfg.get<string>('SERVER_SECRET');
  private isProd = this.cfg.get<string>('NODE_ENV') === 'production';
  private logger = new Logger(TokenGuard.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly cfg: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    if (!this.isProd) {
      this.logger.debug('Checking access for route ' + request.path);
    }

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      if (!this.isProd) {
        this.logger.debug('Unauthorized: Token is not present');
      }
      throw new UnauthorizedException();
    }

    if (!this.isProd) {
      this.logger.debug('Got token: ' + token);
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.secret,
      });

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch {
      if (!this.isProd) {
        this.logger.debug('Unauthorized: Token is not valid');
      }

      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
