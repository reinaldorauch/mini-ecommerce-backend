import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Redis } from 'ioredis';
import { CartProductDto } from './dto/cart-product.dto';

const CART_KEY_NAMESPACE = 'cart:';

@Injectable()
export class CartService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async add(dto: CartProductDto, id?: string) {
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
    return Object.entries(list).map(([key, val]) => ({
      id: key,
      quantity: Number(val),
    }));
  }

  delete(id: string) {
    return this.redis.del(CART_KEY_NAMESPACE + id);
  }
}
