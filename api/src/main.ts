import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
    origin: [
      'http://localhost:15000',
    ] 
  });
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.use(
    session({
      secret: 'ecom-poc-secret',
      cookie: { maxAge: 1000*60*60*24 },
      resave: false,
      saveUninitialized: true,
    }),
  );
  await app.listen(15005);
}
bootstrap();
