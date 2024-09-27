import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cors from 'cors'
import { IoAdapter } from '@nestjs/platform-socket.io';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useWebSocketAdapter(new IoAdapter(app));
  // app.use(cors({
  //   origin: [/https:\/\/.*notipage\.netlify\.app$/], // Allow any subdomain of notipage.netlify.app
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   allowedHeaders: 'Content-Type, Authorization, set-cookie',
  //   credentials: true,
  // }));
  
  app.enableCors({
    origin: [/https:\/\/.*notipage\.netlify\.app$/], // Allow any subdomain of notipage.netlify.app
    methods: 'GET,POST,PUT,DELETE', // Specify allowed methods
      allowedHeaders: 'Content-Type, Authorization, set-cookie',
    credentials: true, // Allow credentials like cookies
  });

  await app.listen(3000);
}
bootstrap();