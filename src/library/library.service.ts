import { Injectable } from '@nestjs/common';
import { CreateLibraryDto } from './dto/create-library.dto';
import { UpdateLibraryDto } from './dto/update-library.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Library } from './entities/library.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class LibraryService {
  constructor(
    @InjectRepository(Library)
    private libraryRepository: Repository<Library>
  ){}
  async create(createLibraryDto: CreateLibraryDto, user: User) {
    let library = this.libraryRepository.create({
      name: createLibraryDto.name,
      owner: user
    })
    this.libraryRepository.save(library)
    return this.libraryRepository.find({
      where: {owner: user},
      relations: ['files']
    });
  }

  findAll() {
    return `This action returns all library`;
  }

  findOne(id: number) {
    return `This action returns a #${id} library`;
  }

  update(id: number, updateLibraryDto: UpdateLibraryDto) {
    return `This action updates a #${id} library`;
  }

  remove(id: number) {
    return `This action removes a #${id} library`;
  }
}
