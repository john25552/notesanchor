import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res } from '@nestjs/common';
import { FolderService } from './folder.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { GetUser } from 'src/user/getuser.decorator';
import { AuthGuard } from 'src/user/auth.guard';
import { Response } from 'express';

@UseGuards(AuthGuard)
@Controller('folder')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Post('create')
  async create(@Body() createFolderDto: CreateFolderDto, @Res() response: Response, @GetUser() user: any) {
    let createFolder = await this.folderService.create(createFolderDto);
    return response.send(createFolder)
  }

  @Get()
  findAll() {
    return this.folderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.folderService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFolderDto: UpdateFolderDto) {
    return this.folderService.update(+id, updateFolderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.folderService.remove(+id);
  }
}
