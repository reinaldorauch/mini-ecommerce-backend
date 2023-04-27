import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { validationPipe } from '../src/util/validation.pipe';
import { ProductModule } from '../src/product/product.module';
import { ProductService } from '../src/product/product.service';
import { ProductDto } from '../src/product/dto/product.dto';
import { faker } from '@faker-js/faker';

describe('ProductController (e2e)', () => {
  let app: INestApplication;
  let productService: ProductService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(validationPipe);
    await app.init();

    productService = app.select(ProductModule).get(ProductService);
    await productService.deleteAll();
  });

  afterEach(async () => {
    await productService.deleteAll();
    await app.close();
  });

  it('GET /product should list no products if there is no product in the database', async () => {
    await request(app.getHttpServer())
      .get('/product')
      .expect(200, { total: 0, data: [] });
  });

  it('POST /product should create a product in the database if it has proper credentials', async () => {
    const {
      body: { accessToken },
    } = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'reinaldorauch@gmail.com', password: 'amigen' });
    await request(app.getHttpServer())
      .post('/product')
      .set('Authorization', 'Bearer ' + accessToken)
      .send(createRandomProduct())
      .expect(HttpStatus.CREATED);
  });

  it('GET /product shoud list only the first 10 products in the database', async () => {
    const prods = Array.from(Array(11)).map((_) => createRandomProduct());
    for (const p of prods) {
      await productService.create(p);
    }
    await request(app.getHttpServer())
      .get('/product')
      .expect(200)
      .then((res) => {
        expect(res.body).toMatchObject({
          total: 11,
          data: prods
            .slice(0, 10)
            .map((p) => ({ ...p, price: Number(p.price) * 100 })),
        });
      });
  });
});

function createRandomProduct(): ProductDto {
  return {
    title: faker.random.words(5),
    price: faker.random.numeric(5),
    images: [faker.internet.url()],
    itemsInStock: faker.datatype.number(100),
  };
}
