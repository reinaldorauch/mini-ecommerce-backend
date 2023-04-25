import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { checkPassword } from 'src/user/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
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
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
