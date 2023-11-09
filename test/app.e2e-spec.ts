import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';

const mockCreateDto: mockCreateDtoInterface = {
  name: 'Julia',
  surname: 'Test',
  email: 'email@email.com',
  date: new Date(1995, 11, 17)
}

interface mockCreateDtoInterface {
  name: string
  surname: string
  email: string
  date: Date
}

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let createdEventId: string


  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: () => ({
            type: 'sqlite',
            database: ':memory:',
            entities: [path.resolve(__dirname, '../src/**/*.entity{.ts,.js}')],
            synchronize: true,
            logging: false,
          }),
        }),
        AppModule,
      ],
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

  it('(POST) - create new event', async () => {
    return request(app.getHttpServer())
      .post('/event')
      .send(mockCreateDto)
      .expect(201)
      .then((res) => {
        expect(res.body.name).toBe('Julia')
        createdEventId = res.body.id;
      });
  });

  it('(GET) - get all events', async () => {
    return request(app.getHttpServer())
      .get('/event')
      .expect(200)
  });

  it('(GET) - getEventById, show return event with correct id', async () => {
    return request(app.getHttpServer())
      .get(`/event/${createdEventId}`)
      .expect(200)
      .then((res) => expect(res.body.name).toBe('Julia'));
  });

  it('(GET) - getEventById, show throw not found with incorrect id', async () => {
    return request(app.getHttpServer())
      .get('/event/12345')
      .expect(404)
  });

  it('(PATCH) - update trip, should return successfully', async () => {
    return request(app.getHttpServer())
      .patch(`/event/${createdEventId}?name=Marcela&surname=Test&email=email@test.com&date=2023-11-02T12:34:56.789Z`)
      .expect(200)
      .then((res) => {
        expect(res.body.name).toBe('Marcela');
      });
  });

  it('(PATCH) - update trip, should return successfully', async () => {
    return request(app.getHttpServer())
      .patch(`/event/${createdEventId}`)
      .expect(400)
  });

  it('(DELETE) - delete trip, should delete trip from favourites successfully', async () => {
    return request(app.getHttpServer())
      .delete(`/event/${createdEventId}`)
      .expect(200)
      .then((res) => {
        expect(res.body.name).toBeUndefined();
      });
    });
});