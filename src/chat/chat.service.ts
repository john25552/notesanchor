import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Raw, Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    private userService: UserService
  ){}

  async create(createChatDto: CreateChatDto, user: any) {
    try {
      let creator = await this.userService.findOne(user.email)

      let newChat = this.chatRepository.create({
        name: createChatDto.name,
        owner: creator,
        participants: [creator.email_address, createChatDto.name]
      })

      let {owner, ...createdChat} = await this.chatRepository.save(newChat)
      return {owner: owner.email_address, chat: createdChat};
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  // Find all chats related to the logged in user
  async findAll(user: any) {
    try {
      let chats = await this.chatRepository.find({
        where: {participants: Raw(participants => `JSON_CONTAINS(${participants}, '${JSON.stringify([user.email])}')`)},
        relations: ['owner'],
      })
  
      let operationalChats = chats.map((value) => {
        let chat = {
          name: value.name, id: value.id,
          owner: value.owner.email_address,
          participants: value.participants
        }
  
        return chat
      })

      return operationalChats;
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findOne(id: string) {
    try {
      let chat = await this.chatRepository.findOneBy({id: id})

      return chat;
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  // Join a given chat of provided Id
  async join(id: string, user: any) {
    try{
      let chat = await this.chatRepository.findOneBy({id: id})
      chat.participants.push(user.email)
      this.chatRepository.save(chat)
      
      return true
    } catch (error){
      throw new BadRequestException(error)
    }
  }

  async findParticipants(chatId: string) {
    try {
      let chat = await this.chatRepository.findOneBy({id: chatId})

      return chat.participants
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
