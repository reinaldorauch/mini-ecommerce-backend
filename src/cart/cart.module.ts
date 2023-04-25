import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
