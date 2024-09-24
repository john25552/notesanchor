import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UsePipes, ValidationPipe, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { AuthGuard } from 'src/user/auth.guard';
import { GetUser } from 'src/user/getuser.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { UploadFileDto } from './dto/upload-file.dto';

@UseGuards(AuthGuard)
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @UsePipes(new ValidationPipe({transform: true}))
  @Post('create')
  @UseInterceptors(FileInterceptor('file'))
  async create(@Body() createFileDto: CreateFileDto, @Res() response: Response, @GetUser() user: any, @UploadedFile() file: Express.Multer.File) {
    let createdFile = await this.fileService.create(createFileDto, file, user)
    return response.send(createdFile)
  }

  @UsePipes(new ValidationPipe({transform: true}))
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@Body() uploadFileDto: UploadFileDto, @Res() response: Response, @GetUser() user: any, @UploadedFile() file: Express.Multer.File){
    let files= await this.fileService.upload(uploadFileDto, file, user)
    return response.send(files)
  }

  @Get()
  async findAll(@GetUser() user: any, @Res() response: Response) {
    let files = await this.fileService.findAll(user);
    return response.send(files)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fileService.findOne(+id);
  }

  @Patch('update:id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.fileService.update(+id, updateFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fileService.remove(+id);
  }
}
