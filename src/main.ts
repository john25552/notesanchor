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
    origin: ['https://notespages.netlify.app/', 'http://localhost:5173'], // Replace with your actual frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  }));

  await app.listen(3000);
}
bootstrap();