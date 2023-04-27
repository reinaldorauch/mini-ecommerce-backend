import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { validationPipe } from '../src/util/validation.pipe';
import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';
import { LoginDto } from '../src/auth/dto/login.dto';
import { UserRole } from '../src/user/user.schema';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(validationPipe);
    app.use(cookieParser('haha_test_secret'));
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /auth/profile should return forbidden if no bearer token is provided', async () => {
    await request(app.getHttpServer())
      .get('/auth/profile')
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('GET /auth/profile should return the user info when valid token is provided', async () => {
    const creds: LoginDto = {
      email: 'reinaldorauch@gmail.com',
      password: 'amigen',
    };
    const accessToken = await request(app.getHttpServer())
      .post('/auth/login')
      .send(creds)
      .then((res) => res.body.accessToken);
    const { body } = await request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(HttpStatus.OK);
    expect(body).toMatchObject({
      name: 'Reinaldo Antonio Camargo Rauch',
      email: 'reinaldorauch@gmail.com',
    });
    expect(body.sub).toBeDefined();
  });

  it('POST /auth/login should return access token if credentials is valid', async () => {
    // sudo creds
    const creds: LoginDto = {
      email: 'reinaldorauch@gmail.com',
      password: 'amigen',
    };
    await request(app.getHttpServer())
      .post('/auth/login')
      .send(creds)
      .expect(HttpStatus.OK)
      .then((res) => {
        expect(res.body.accessToken).toBeDefined();
      });
  });

  it('POST /auth/login should return UNAUTHORIZED if credentials are invalid', async () => {
    // sudo creds
    const creds: LoginDto = {
      email: 'reinaldorauch@gmail.com',
      password: 'foca',
    };
    await request(app.getHttpServer())
      .post('/auth/login')
      .send(creds)
      .expect(HttpStatus.UNAUTHORIZED);
  });
});
