import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { UserModule } from '../src/user/user.module';
import { UserRole } from '../src/user/user.schema';
import { UserService } from '../src/user/user.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const svc = app.select(UserModule).get(UserService);

  await svc.create({
    name: 'Reinaldo Antonio Camargo Rauch',
    email: 'reinaldorauch@gmail.com',
    password: 'amigen',
    confirmPassword: 'amigen',
    role: UserRole.Admin,
  });

  const logger = new Logger('bootstrap-admin');

  logger.log('Done adding user.');
}
bootstrap();
