import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly cfg: ConfigService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user || !(await user.checkPassword(password))) {
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
