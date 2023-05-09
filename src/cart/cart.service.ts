import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Redis } from 'ioredis';
import { CartProductDto } from './dto/cart-product.dto';
import { ProductService } from '../product/product.service';

const CART_KEY_NAMESPACE = 'cart:';

@Injectable()
export class CartService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly productService: ProductService,
  ) {}

  async add(dto: Omit<CartProductDto, 'cartId'>, id?: string) {
    if (!id) {
      id = randomUUID();
    }
    const key = CART_KEY_NAMESPACE + id;
    const result = await this.redis.hincrby(key, dto.id, dto.quantity);
    if (result <= 0) {
      await this.redis.hdel(key, dto.id);
    }
    return id;
  }

  async list(id: string) {
    const key = CART_KEY_NAMESPACE + id;
    if (!(await this.redis.exists(key))) {
      throw new NotFoundException();
    }
    const list = await this.redis.hgetall(key);

    const rawCart = Object.entries(list).map(([key, val]) => ({
      id: key,
      quantity: Number(val),
    }));

    const prods = await this.productService.mapProds(
      rawCart.map(({ id }) => id),
    );

    return rawCart.map((item, index) => ({
      ...item,
      title: prods[index].title,
      price: prods[index].price,
    }));
  }

  delete(id: string) {
    return this.redis.del(CART_KEY_NAMESPACE + id);
  }
}
