import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageModule } from './message/message.module';
import { LibraryModule } from './library/library.module';
import { FileModule } from './file/file.module';
import { CommentModule } from './comment/comment.module';
import { ConfigModule } from '@nestjs/config';
import { SpaceModule } from './space/space.module';
import { FolderModule } from './folder/folder.module';

@Module({
  imports: [UserModule, TypeOrmModule.forRootAsync({
    useFactory: async ()=> {
      try {
        return {
          type: 'mysql',
          host: process.env.DATABASE_HOST,
          port: Number(process.env.DATABASE_PORT),
          username: process.env.DATABASE_USER,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_NAME,
          autoLoadEntities: true,
          synchronize: true,
        }
      } catch (error) {
        console.log(error)
        Logger.error('Database connection error', error);
        throw error;
      }
    }
    }), MessageModule, LibraryModule, FileModule, CommentModule, ConfigModule.forRoot({isGlobal: true}), SpaceModule, FolderModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
