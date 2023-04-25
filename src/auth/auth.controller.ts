import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { TokenGuard } from './token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly svc: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.svc.signIn(dto.email, dto.password);
  }

  @UseGuards(TokenGuard)
  @Get('profile')
  profile(@Request() req) {
    return req.user;
  }
}
