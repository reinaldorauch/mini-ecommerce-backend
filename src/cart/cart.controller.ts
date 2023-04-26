import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CartService } from './cart.service';
import { Cookies } from '../util/cookies.decorator';
import { CartProductDto } from './dto/cart-product.dto';
import { ConfigService } from '@nestjs/config';

@Controller('cart')
export class CartController {
  constructor(
    private readonly svc: CartService,
    private readonly cfg: ConfigService,
  ) {}

  @Post()
  async add(
    @Body() dto: CartProductDto,
    @Res({ passthrough: true }) res: Response,
    @Cookies('cart_id') id?: string,
  ) {
    const newId = await this.svc.add(dto, id);
    if (!id) {
      if (this.cfg.get<string>('NODE_ENV', 'production') === 'testing') {
        res.setHeader('x-cart-id', newId);
      }
      res.cookie('cart_id', newId);
      res.status(HttpStatus.CREATED);
    } else {
      res.status(HttpStatus.OK);
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
    if (!(await this.svc.delete(id))) {
      throw new NotFoundException();
    }
  }
}
