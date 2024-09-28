import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, WsException } from '@nestjs/websockets';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { GetUser } from 'src/user/getuser.decorator';
import { Namespace, Server, Socket } from 'socket.io';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from 'src/user/auth.guard';
import { ChatService } from 'src/chat/chat.service';
import { send } from 'process';

@UseGuards(AuthGuard)
@WebSocketGateway({namespace: 'message', cors: { origin: '*', credentials: true }})

export class MessageGateway {
  constructor(
    private readonly messageService: MessageService,
    private readonly chatService: ChatService
  ) {}

  @WebSocketServer()
  namespace: Namespace;

  // @UsePipes(new ValidationPipe())
  @SubscribeMessage('create_message')
  async create(@MessageBody() createMessageDto: CreateMessageDto, @ConnectedSocket() client: Socket, @GetUser() user: any) {
    let message = await this.messageService.create(createMessageDto, user) 
    console.log("Sending message over socket room ", message.createdMessage.receiver)
    console.log("Sockets are ", this.namespace.adapter.rooms)
    this.namespace.emit('chat_message', message)
  }

  // Room must be a chatId or Message receiver
  @SubscribeMessage('join_room')
  async joinRoom(
    @MessageBody() payload: { room: string },
    @ConnectedSocket() client: Socket,
    @GetUser() user: any,
  ) {
    console.log("Joining room", payload.room);
    
    let participants = await this.chatService.findParticipants(payload.room);
  
  
    client.join(payload.room);
    console.log(`Client ${client.id} joined room:`, payload.room);
    console.log("Rooms after join:", this.namespace.adapter.rooms);
  }

  @SubscribeMessage('findAllMessage')
  findAll() {

  }

  @SubscribeMessage('findOneMessage')
  findOne(@MessageBody() id: number) {

  }

  @SubscribeMessage('updateMessage')
  update(@MessageBody() updateMessageDto: UpdateMessageDto) {

  }

  @SubscribeMessage('removeMessage')
  remove(@MessageBody() id: number) {

  }
}
