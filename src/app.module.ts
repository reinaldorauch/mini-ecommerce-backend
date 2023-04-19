import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (cfg: ConfigService) => {
        return {
          uri: cfg.get<string>('DATABASE_URL', 'mongodb://localhost:27017'),
        };
      },
    }),
    ProductModule,
  ],
})
export class AppModule {}
