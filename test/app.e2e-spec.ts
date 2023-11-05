import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';



const mockEvent: mockEventInterface = {
  id: '1befbb09-782a-4924-9e51-98f8ec8069ee',
  name: 'Julia',
  surname: 'Test',
  email: 'email@email.com',
  date: new Date(1995, 11, 17)
};

interface mockEventInterface {
  id: string
  name: string
  surname: string
  email: string
  date: Date
}

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello!');
  });
  it('(GET) - get all events', async () => {
    return request(app.getHttpServer())
      .get('/event')
      .expect(200)
  });

  it('(POST) - create new event', async () => {
    return request(app.getHttpServer())
      .post('/event')
      .send(mockEvent)
      .expect(201)
      .then((res) => expect(res.body.name).toBe('Julia'));
  });
});