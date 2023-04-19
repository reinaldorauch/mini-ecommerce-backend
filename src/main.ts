import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { HttpStatus, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: false,
      transform: true,
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
    }),
  );
  const cfg = app.get(ConfigService);
  await app.listen(cfg.get<number>('PORT', 3000));
}
bootstrap();
