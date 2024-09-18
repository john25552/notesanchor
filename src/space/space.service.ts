import { Injectable } from '@nestjs/common';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Space } from './entities/space.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SpaceService {
  constructor(
    @InjectRepository(Space)
    private spaceRepository: Repository<Space>
  ){}
  create(createSpaceDto: CreateSpaceDto) {
    let newSpace = this.spaceRepository.create()
    newSpace.name = createSpaceDto.name
    newSpace.owner
  }

  findAll() {
    return `This action returns all space`;
  }

  findOne(id: number) {
    return `This action returns a #${id} space`;
  }

  update(id: number, updateSpaceDto: UpdateSpaceDto) {
    return `This action updates a #${id} space`;
  }

  remove(id: number) {
    return `This action removes a #${id} space`;
  }
}
