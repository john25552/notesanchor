import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { UserModule } from 'src/user/user.module';
import { LibraryModule } from 'src/library/library.module';
import { FolderModule } from 'src/folder/folder.module';

@Module({
  imports: [TypeOrmModule.forFeature([File]), UserModule, LibraryModule, FolderModule],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
