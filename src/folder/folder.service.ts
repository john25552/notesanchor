import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Folder } from './entities/folder.entity';
import { Repository } from 'typeorm';
import { LibraryService } from 'src/library/library.service';

@Injectable()
export class FolderService {

  constructor(
    @InjectRepository(Folder)
    private folderRepository: Repository<Folder>,
    readonly libraryService: LibraryService
  ){}

  async create(createFolderDto: CreateFolderDto) {
    try {
      console.log('Looking for library with id: ', createFolderDto.associated_library)
      let library = await this.libraryService.findOne(createFolderDto.associated_library)

      if(!library) throw new BadRequestException(`Specified associated library does exist`)

      let newFolder = this.folderRepository.create({
        name: createFolderDto.name,
        associated_library: library
      })

      let createdFolder = await this.folderRepository.save(newFolder)
      
      return createdFolder
      
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  findAll() {
    return `This action returns all folder`;
  }

  async findOne(id: string) {
    try{
      let folder = await this.folderRepository.findOneBy({id: id})
      if(!folder) throw new BadRequestException(`Folder with id ${id} not found`)

      return folder
    } catch(error){
      throw new BadRequestException(error)
    }
  }

  update(id: number, updateFolderDto: UpdateFolderDto) {
    return `This action updates a #${id} folder`;
  }

  remove(id: number) {
    return `This action removes a #${id} folder`;
  }
}
