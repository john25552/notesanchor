import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { LibraryService } from './library.service';
import { CreateLibraryDto } from './dto/create-library.dto';
import { UpdateLibraryDto } from './dto/update-library.dto';
import { Response } from 'express';
import { GetUser } from 'src/user/getuser.decorator';
import { AuthGuard } from 'src/user/auth.guard';

@UseGuards(AuthGuard)
@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @UsePipes(new ValidationPipe({transform: true}))
  @Post('create')
  async create(@Body() createLibraryDto: CreateLibraryDto, @Res() response:  Response, @GetUser() user: any) {
    const createdLibrary = await this.libraryService.create(createLibraryDto, user);
    console.log('Responding with library: ', createdLibrary)
    return response.send(createdLibrary)
  }

  @Get()
  async findAll(@GetUser() user: any, @Res() response: Response) {
    let libraries = await this.libraryService.findAll(user.email);
    return response.send(libraries)
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() response: Response) {
    let library = await this.libraryService.findOne(id);
    return response.send(library)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLibraryDto: UpdateLibraryDto) {
    return this.libraryService.update(+id, updateLibraryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.libraryService.remove(+id);
  }
}
