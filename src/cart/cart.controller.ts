import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CartService } from './cart.service';
import { CartProductDto } from './dto/cart-product.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly svc: CartService) {}

  @Post()
  async add(
    @Body() { cartId: id, ...dto }: CartProductDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const newId = await this.svc.add(dto, id);
    if (!id) {
      res.status(HttpStatus.CREATED);
      res.json({ cartId: newId });
    } else {
      res.status(HttpStatus.OK);
    }
  }

  @Get(':cartId')
  list(@Param('cartId') id: string) {
    return this.svc.list(id);
  }

  @Delete(':cartId')
  async delete(@Param('cartId') id: string) {
    if (!(await this.svc.delete(id))) {
      throw new NotFoundException();
    }
  }
}
