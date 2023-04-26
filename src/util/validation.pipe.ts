import { HttpStatus, ValidationPipe } from '@nestjs/common';

export const validationPipe = new ValidationPipe({
  skipMissingProperties: false,
  transform: true,
  errorHttpStatusCode: HttpStatus.BAD_REQUEST,
  forbidUnknownValues: true,
  forbidNonWhitelisted: true,
});
