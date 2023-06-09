import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { checkPassword } from '../user/user.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private secret = this.cfg.get<string>('SERVER_SECRET');

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly cfg: ConfigService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user || !(await checkPassword(user.passwordHash, password))) {
      throw new UnauthorizedException();
    }

    const payload = {
      name: user.name,
      email: user.email,
      sub: user._id.toString(),
    };

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: '1d',
        secret: this.secret,
      }),
    };
  }
}
