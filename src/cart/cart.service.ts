import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Redis } from 'ioredis';
import { CartProductDto } from './dto/cart-product.dto';

@Injectable()
export class CartService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async add(dto: CartProductDto, id?: string) {
    if (!id) {
      id = randomUUID();
    }
    if (dto.quantity) {
      await this.redis.hset('cart:' + id, { [dto.id]: dto.quantity });
    } else {
      await this.redis.hdel('cart:' + id, dto.id);
    }
    return id;
  }

  async list(id: string) {
    const list = await this.redis.hgetall('cart:' + id);
    return Object.entries(list).map((key, val) => ({
      id: key,
      quantity: Number(val),
    }));
  }

  async delete(id: string) {
    await this.redis.del('cart:' + id);
  }
}
