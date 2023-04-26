import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { validationPipe } from './util/validation.pipe';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(validationPipe);
  const cfg = app.get(ConfigService);
  app.use(cookieParser(cfg.getOrThrow<string>('SERVER_SECRET')));
  await app.listen(cfg.get<number>('PORT', 3000));
}
bootstrap();
