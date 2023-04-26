import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
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
    if (dto.quantity) {
      await this.redis.hincrby(CART_KEY_NAMESPACE + id, dto.id, dto.quantity);
    } else {
      await this.redis.hdel(CART_KEY_NAMESPACE + id, dto.id);
    }
    return id;
  }

  async list(id: string) {
    const list = await this.redis.hgetall(CART_KEY_NAMESPACE + id);
    return Object.entries(list).map(([key, val]) => ({
      id: key,
      quantity: Number(val),
    }));
  }

  async delete(id: string) {
    await this.redis.del(CART_KEY_NAMESPACE + id);
  }
}
