import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cors from 'cors'
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express'

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cors({
    origin: ['http://localhost:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization, set-cookie',
    credentials: true,
  }));

  await app.listen(3001);
}
bootstrap();