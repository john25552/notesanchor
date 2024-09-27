import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Space } from './entities/space.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class SpaceService {
  constructor(
    @InjectRepository(Space)
    private spaceRepository: Repository<Space>,
    private userService: UserService
  ){}
  async create(createSpaceDto: CreateSpaceDto, user: any) {
    try{
      let creator = await this.userService.findOne(user.email)

      let newSpace = this.spaceRepository.create({
        name: createSpaceDto.name,
        owner: creator,
        participants: [creator.email_address],
        description: createSpaceDto.description
      })

      let {owner, ...createdSpace} = await this.spaceRepository.save(newSpace)

      let space = {space: createdSpace, owner: owner.email_address}
      return space
    } catch(error){
      throw new BadRequestException(error)
    }
  }

  async findAll() {
    console.log("Request for all spaces made")
    try {
      let spaces = await this.spaceRepository.find({relations: ['owner']})
      let operationalSpaces = spaces.map((value) => {
        let space = {
          name: value.name, id: value.id,
          owner: value.owner.email_address,
          participants: value.participants,
          description: value.description
        }

        return space
      })

      return operationalSpaces
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findMember(member: string, spaceId: string) {
    try {
      if (!member)
        throw new WsException('Empty member object')

      let space = await this.spaceRepository.findOneBy({id: spaceId})
      let participant = space.participants.find(participant => participant == member)

      if (!participant) throw new WsException('Member is not a space participant')

      return participant
    } catch (error) {
      throw new WsException('Unathorized member')
    }
  }

  async join(id: {id: string}, user: any){
    try {
      let space = await this.spaceRepository.findOneBy({id: id.id.split(':')[1]})
      if(!space.participants.includes(user.email)){
        space.participants.push(user.email)
        this.spaceRepository.save(space)
      }
      return true
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findOne(id: string) {
    try {
      let {owner, ...space} = await this.spaceRepository.findOne({
        where: {id: id},
        relations: ['owner']
      })
      return {owner: owner.email_address, space}
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  update(id: number, updateSpaceDto: UpdateSpaceDto) {
    return `This action updates a #${id} space`;
  }

  remove(id: number) {
    return `This action removes a #${id} space`;
  }
}
