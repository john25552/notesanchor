import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { UpdateChatDto } from './dto/update-chat.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/user/auth.guard';

@UseGuards(AuthGuard)
@WebSocketGateway({namespace: '/chat', cors: true})
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  handleConnect(){

  }

  @SubscribeMessage('findAllChat')
  findAll() {

  }

  @SubscribeMessage('findOneChat')
  findOne(@MessageBody() id: number) {

  }

  @SubscribeMessage('updateChat')
  update(@MessageBody() updateChatDto: UpdateChatDto) {
    
  }

  @SubscribeMessage('removeChat')
  remove(@MessageBody() id: number) {
    return this.chatService.remove(id);
  }
}
