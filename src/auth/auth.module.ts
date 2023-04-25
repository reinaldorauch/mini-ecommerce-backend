import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenGuard } from './token.guard';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, TokenGuard],
  exports: [TokenGuard],
})
export class AuthModule {}
