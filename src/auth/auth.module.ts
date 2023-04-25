import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { TokenGuard } from './token.guard';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        return {
          secret: cfg.getOrThrow<string>('SERVER_SECRET'),
          signOptions: { expiresIn: '60s' },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenGuard],
  exports: [TokenGuard],
})
export class AuthModule {}
