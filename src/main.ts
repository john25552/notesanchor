import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cors from 'cors'
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.enableCors({origin: '*', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'})

  app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  }));

  await app.listen(3001);
}
bootstrap();
