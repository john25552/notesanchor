import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UsePipes, ValidationPipe, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { AuthGuard } from 'src/user/auth.guard';
import { GetUser } from 'src/user/getuser.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@UseGuards(AuthGuard)
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @UsePipes(new ValidationPipe({transform: true}))
  @Post('create')
  @UseInterceptors(FileInterceptor('file'))
  async create(@Body() createFileDto: CreateFileDto, @Res() response: Response, @GetUser() user: any, @UploadedFile() file: Express.Multer.File) {
    let createdFile = await this.fileService.create(createFileDto, file, user)
    console.log("Responding with file: ", createdFile)
    return response.send(createdFile)
  }

  @Get()
  async findAll(@GetUser() user: any, @Res() response: Response) {
    let files = await this.fileService.findAll(user);
    console.log("Returning files: ", files)
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
