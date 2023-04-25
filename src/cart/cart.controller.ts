import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CartService } from './cart.service';
import { Cookies } from 'src/util/cookies.decorator';
import { CartProductDto } from './dto/cart-product.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly svc: CartService) {}

  @HttpCode(HttpStatus.OK)
  @Patch()
  async add(
    @Body() dto: CartProductDto,
    @Res({ passthrough: true }) res: Response,
    @Cookies('cart_id') id?: string,
  ) {
    const newId = await this.svc.add(dto, id);
    if (!id) {
      res.cookie('cart_id', newId);
    }
  }

  @Get()
  list(@Cookies('cart_id') id?: string) {
    if (!id) throw new NotFoundException();
    return this.svc.list(id);
  }

  @Delete()
  async delete(@Cookies('cart_id') id?: string) {
    if (!id) throw new NotFoundException();
    await this.svc.delete(id);
  }
}
