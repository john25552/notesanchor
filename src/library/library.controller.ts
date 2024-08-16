import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards } from '@nestjs/common';
import { LibraryService } from './library.service';
import { CreateLibraryDto } from './dto/create-library.dto';
import { UpdateLibraryDto } from './dto/update-library.dto';
import { Response } from 'express';
import { User } from 'src/user/entities/user.entity';
import { GetUser } from 'src/user/getuser.decorator';
import { AuthGuard } from 'src/user/auth.guard';

@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  async create(@Body() createLibraryDto: CreateLibraryDto, @Res() response:  Response, @GetUser() user: User) {
    const libraries = await this.libraryService.create(createLibraryDto, user);
    return response.send(libraries)
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.libraryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.libraryService.findOne(+id);
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
