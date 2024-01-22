import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './transform.interceptor';
import { createDocument } from 'swagger/swagger';
import { SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.setGlobalPrefix('api/v1');
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!req.secure) {
      return res.redirect(['https://', req.get('Host'), req.url].join(''));
    }
    next();
  });
  expressApp.set('trust proxy', true);
  SwaggerModule.setup('api', app, createDocument(app));
  await app.listen(process.env.PORT || 80);
}
bootstrap();
