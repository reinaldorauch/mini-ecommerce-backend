import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './../src/app.module';
import { validationPipe } from '../src/util/validation.pipe';

describe('CartController (e2e)', () => {
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

  it('GET /cart should return NOT_FOUND when no cookie is provided', () => {
    return request(app.getHttpServer())
      .get('/cart')
      .expect(HttpStatus.NOT_FOUND);
  });

  it('DELETE /cart should return NOT_FOUND when no cookie is provided', () => {
    return request(app.getHttpServer())
      .delete('/cart')
      .expect(HttpStatus.NOT_FOUND);
  });

  it('POST /cart should set a cookie when creating a new cart', async () => {
    const prod = { id: 'blabla', quantity: 1 };
    const server = app.getHttpServer();
    let id = '';
    await addProductRequest(request(server), prod)
      .expect(HttpStatus.CREATED)
      .expect((res) => {
        id = 'cart_id=' + res.headers['x-cart-id'];
        expect(res.headers['set-cookie'][0].split(';')[0]).toEqual(id);
      });
    await request(server)
      .delete('/cart')
      .set('Cookie', id + ';  Path=/')
      .expect(HttpStatus.OK);
  });

  it('GET /cart should list all added products in the cart when the cookie cart_id is set', async () => {
    const agent = request.agent(app.getHttpServer());
    const prods = [{ id: 'blabla', quantity: 1 }];
    await addProductRequest(agent, prods[0]);
    await agent.get('/cart').expect(HttpStatus.OK, prods);
    await agent.delete('/cart').expect(HttpStatus.OK);
  });

  it("POST /cart should add the quantity of an item if it's already in cart", async () => {
    const agent = request.agent(app.getHttpServer());
    const prod = { id: 'blabla', quantity: 1 };
    await addProductRequest(agent, prod);
    await addProductRequest(agent, prod);
    const prods = [{ id: 'blabla', quantity: 2 }];
    await agent.get('/cart').expect(HttpStatus.OK, prods);
    await agent.delete('/cart').expect(HttpStatus.OK);
  });

  it("POST /cart should subtract the quantity if it's negative", async () => {
    const agent = request.agent(app.getHttpServer());
    const prod1 = { id: 'blabla', quantity: 2 };
    await addProductRequest(agent, prod1);
    const prod2 = { id: 'blabla', quantity: -1 };
    await addProductRequest(agent, prod2);
    const prods = [{ id: 'blabla', quantity: 1 }];
    await agent.get('/cart').expect(HttpStatus.OK, prods);
    await agent.delete('/cart').expect(HttpStatus.OK);
  });

  it('POST /cart should remove the cart it the last product is removed from it', async () => {
    const agent = request.agent(app.getHttpServer());
    const prod1 = { id: 'blabla', quantity: 1 };
    await addProductRequest(agent, prod1);
    const prod2 = { id: 'blabla', quantity: -1 };
    await addProductRequest(agent, prod2);
    await agent.get('/cart').expect(HttpStatus.NOT_FOUND);
  });

  it('DELETE /cart should remove the cart', async () => {
    const agent = request.agent(app.getHttpServer());
    const prods = [{ id: 'blabla', quantity: 1 }];
    await addProductRequest(agent, prods[0]);
    await agent.get('/cart').expect(HttpStatus.OK, prods);
    await agent.delete('/cart').expect(HttpStatus.OK);
    await agent.get('/cart').expect(HttpStatus.NOT_FOUND);
  });
});

function addProductRequest(agent, prod) {
  return agent.post('/cart').send(prod);
}
