import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateLibraryDto } from './dto/create-library.dto';
import { UpdateLibraryDto } from './dto/update-library.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Library } from './entities/library.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class LibraryService {
  constructor(
    @InjectRepository(Library)
    private libraryRepository: Repository<Library>,
    readonly userService: UserService
  ){}

  async create(createLibraryDto: CreateLibraryDto, user: any) {
    console.log("user is",user.email)
    
    try{
      let creator = await this.userService.findOne(user.email)

      let library = this.libraryRepository.create({
        name: createLibraryDto.name,
        owner: creator,
        files: [],
        folders:[]
      })
      
      let {owner, ...newLibrary} = await this.libraryRepository.save(library)
      let createdLibrary = {
        owner: owner.id,
        library: newLibrary
      }

      return createdLibrary
      
    } catch(error){
      throw new BadRequestException(error)
    }
  }

  async findAll(email: string) {
    try{
      let libraries = await this.libraryRepository.find({
        where: {owner: {email_address: email}},
        relations: ['folders', 'files'],
        order: {updatedAt: 'asc'}
      })

      return libraries
    } catch(error){
      throw new BadRequestException(error)
    }
  }

  async findOne(id: string) {
    try{
      let library = await this.libraryRepository.findOneBy({id: id})
      if(!library) throw new BadRequestException(`Couldn't find library of id ${id}`)

      return library
    } catch(error){
      console.log('Error while retrieving library: ', error)

      throw new BadRequestException(error)
    }
  }

  update(id: number, updateLibraryDto: UpdateLibraryDto) {
    return `This action updates a #${id} library`;
  }

  remove(id: number) {
    return `This action removes a #${id} library`;
  }
}
