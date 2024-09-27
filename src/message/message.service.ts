import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { SpaceService } from 'src/space/space.service';
import { ChatService } from 'src/chat/chat.service';
import { Chat } from 'src/chat/entities/chat.entity';

@Injectable()
export class MessageService {

  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private userService: UserService, 
    private spaceService: SpaceService,
    private chatService: ChatService
  ){}

  async create(createMessageDto: CreateMessageDto, user: any) {
    try {

      let sender = await this.userService.findOne(user.email)
      let receiver: string;
      let chat: Chat

      if(createMessageDto.type == 'Space')
        receiver = (await this.spaceService.findOne(createMessageDto.receiver_id)).space.id

      else {
        chat = await this.chatService.findOne(createMessageDto.receiver_id)
        receiver = chat.id
      }

      let message = this.messageRepository.create({
        body: createMessageDto.body,
        owner: sender,
        sender: sender.email_address,
        receiver: receiver,
        target: createMessageDto.type != 'Space' ? chat.name : createMessageDto.receiver_id,
        type: createMessageDto.type
      })

      let {owner, ...createdMessage} = await this.messageRepository.save(message)
      return {owner: owner.email_address, createdMessage}
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findAll(chatId: string) {
    try {
      let messages = await this.messageRepository.find({
        where: {receiver: chatId},
        order: {sentAt: 'ASC'}
      })
      
      let operationalMessages = messages.map(value => {
        let message = {
          id: value.id,
          body: value.body,
          owner: value.sender,
          receiver: value.receiver,
          sender: value.sender,
          sentAt: value.sentAt,
          target: value.target,
          type: value.type
        }

        
        return message
      })
      
      return operationalMessages
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
