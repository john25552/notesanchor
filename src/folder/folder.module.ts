import { Module } from '@nestjs/common';
import { FolderService } from './folder.service';
import { FolderController } from './folder.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folder } from './entities/folder.entity';
import { LibraryModule } from 'src/library/library.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Folder]), LibraryModule, UserModule],
  controllers: [FolderController],
  providers: [FolderService],
  exports: [FolderService]
})
export class FolderModule {}
