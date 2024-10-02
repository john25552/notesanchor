import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WsException, ConnectedSocket } from '@nestjs/websockets';
import { SpaceService } from './space.service';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { Namespace, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/user/auth.guard';
import { MessageService } from 'src/message/message.service';
import { GetUser } from 'src/user/getuser.decorator';

@UseGuards(AuthGuard)
@WebSocketGateway({namespace: 'space', cors: { origin: '*', credentials: true }})

export class SpaceGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly spaceService: SpaceService,
    private messagesService: MessageService,
  ) {}

  @WebSocketServer() namespace: Namespace;
  

  @SubscribeMessage('create_room')
  async handleCreateRoom(@ConnectedSocket() client: Socket, @MessageBody() payload: {room: string}, @GetUser() user: any) {
    console.log("Client ", client.id, " wants to create room ", payload.room)
    client.join(payload.room)
    let message = await this.messagesService.create({
      body: `Created room ${payload.room}`,
      sender_id: user.email,
      receiver_id: payload.room,
      type: 'Space'
    }, user)

    console.log("Now rooms in namespace are ", this.namespace.adapter.rooms)

    this.namespace.emit('space_message', message)
  }

  @SubscribeMessage('space_message')
  async handleMessage(@ConnectedSocket() client: Socket, @MessageBody() payload: {body: string, receiver: string }, @GetUser() user: any){
    let message = await this.messagesService.create({
      body: payload.body,
      sender_id: user.email,
      receiver_id: payload.receiver,
      type: 'Space'
    }, user)

    this.namespace.to(message.createdMessage.receiver).emit('space_message', message)
  }

  @SubscribeMessage('join')
  async handleJoin(@MessageBody() payload: {room: string}, @ConnectedSocket() client: Socket,  @GetUser() user: any){
    console.log("Got a join request to room ", payload.room)
    // let member = this.spaceService.findMember(user.email, payload.room)
    // if(member) {
      client.join(payload.room)
      console.log("Member with id ", client.id, " added to room")
      console.log("Rooms are ", this.namespace.adapter.rooms)

      let messages = await this.messagesService.findAll(payload.room)
      client.emit('messages', messages)
      this.namespace.except(client.id).emit('new_client', client.id)

    // }
  }
  
  @SubscribeMessage('connectPeer')
  handleSignal(@ConnectedSocket() client: Socket, @MessageBody() peerId: string) {

    this.namespace.except(client.id).emit('connectPeer', peerId)
  }

  @SubscribeMessage('candidate')
  handleCandidate(@ConnectedSocket() client: Socket, @MessageBody() payload: { signalType: any; client: string, candidate: string, room: string }){
    console.log("Got candidate for ", payload.client, " from ", client.id)

    this.namespace.except(client.id).emit('candidate', {
      signalType: payload.signalType,
      candidate: payload.candidate,
      client: client.id,
    })
  }
  
  async handleConnection(@ConnectedSocket() client: Socket, @MessageBody() payload: {room: string}){
    this.namespace.except(client.id).emit('new_client', client.id)
  }

  handleDisconnect(){
    console.log("client disconnected")
  }

  @SubscribeMessage('findAllSpace')
  findAll() {
    return this.spaceService.findAll();
  }

  @SubscribeMessage('findOneSpace')
  findOne(@MessageBody() id: number) {

  }

  @SubscribeMessage('updateSpace')
  update(@MessageBody() updateSpaceDto: UpdateSpaceDto) {
    return this.spaceService.update(updateSpaceDto.id, updateSpaceDto);
  }

  @SubscribeMessage('removeSpace')
  remove(@MessageBody() id: number) {
    return this.spaceService.remove(id);
  }
}
