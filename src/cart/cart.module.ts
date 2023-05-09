import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { ProductModule } from '../product/product.module';

@Module({
  controllers: [CartController],
  providers: [CartService],
  imports: [ProductModule],
})
export class CartModule {}
