import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Redis } from 'ioredis';
import { Connection, ConnectionStates } from 'mongoose';

@Injectable()
export class HealthcheckService {
  constructor(
    @InjectConnection() private readonly mongoConnection: Connection,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  healthcheck() {
    return Promise.all([this.mongoCheck(), this.redisCheck()]);
  }

  async mongoCheck() {
    if (this.mongoConnection.readyState !== ConnectionStates.connected) {
      throw new InternalServerErrorException('mongo failed');
    }

    const collections = await this.mongoConnection.db
      .listCollections()
      .toArray();

    // TODO: Fetch registered collections from somewere
    const expectedCollections = ['users', 'products'];

    for (const c of expectedCollections) {
      if (!collections.find((dbCollection) => dbCollection.name === c)) {
        throw new InternalServerErrorException('mongo failed');
      }
    }
  }

  async redisCheck() {
    if ((await this.redis.ping()) !== 'PONG') {
      throw new InternalServerErrorException('redis failed');
    }
  }
}
