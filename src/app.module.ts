import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

import { ProductModule } from './product/product.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CartModule } from './cart/cart.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ImageModule } from './image/image.module';
import { HealthcheckModule } from './healthcheck/healthcheck.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    {
      ...JwtModule.registerAsync({
        inject: [ConfigService],
        useFactory: async (cfg: ConfigService) => {
          return {
            global: true,
            secret: cfg.getOrThrow<string>('SERVER_SECRET'),
            signOptions: { expiresIn: '60s' },
          };
        },
      }),
      global: true, // not sure why this is needed
    },
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (cfg: ConfigService) => {
        return {
          uri: cfg.get<string>('DATABASE_URL', 'mongodb://localhost:27017'),
        };
      },
    }),
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (cfg: ConfigService) => {
        return {
          config: {
            url: cfg.get<string>('REDIS_URL', 'redis://localhost:6379'),
          },
        };
      },
    }),
    AuthModule,
    UserModule,
    ProductModule,
    CartModule,
    ImageModule,
    HealthcheckModule,
  ],
})
export class AppModule {}
