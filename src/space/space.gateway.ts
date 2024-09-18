import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WsException } from '@nestjs/websockets';
import { SpaceService } from './space.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/user/auth.guard';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  namespace: 'space',
  cors: {
    origin: "*",
    methods: ['GET', 'POST'],
    credentials: true,
  }
})

@UseGuards(AuthGuard)
export class SpaceGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private jwt_key = process.env.JWT;

  constructor(
    private readonly spaceService: SpaceService,
    private jwtService: JwtService
  ) {}
  
  @UseGuards(AuthGuard)
  @SubscribeMessage('createSpace')
  create(client: Socket, @MessageBody() createSpaceDto: CreateSpaceDto) {
    return this.spaceService.create(createSpaceDto);
  }
  
  @SubscribeMessage('signal')
  handleSignal(client: Socket, payload: { signalType: any; name: string, sdp: string }) {
    client.emit('signal', {id:client.id, payload})
  }
  
  async handleConnection(client: Socket, name: string){
    try{
      const cookies = client.handshake.headers.cookie
  
      if(!cookies) throw new WsException('Unathorized domain')
  
      const token = this.extractTokenFromCookie(cookies);
  
      if(!token) throw new WsException("Unathorized domain")
  
      try{
        const payload = await this.jwtService.verify(token, {secret: this.jwt_key})
        client['user'] = payload;
      } catch {
          throw new WsException("Unauthorized user")
      }
    } catch(error) {
      console.log("Error from new connection", error)
      client.disconnect()
    }
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
    return this.spaceService.findOne(id);
  }

  @SubscribeMessage('updateSpace')
  update(@MessageBody() updateSpaceDto: UpdateSpaceDto) {
    return this.spaceService.update(updateSpaceDto.id, updateSpaceDto);
  }

  @SubscribeMessage('removeSpace')
  remove(@MessageBody() id: number) {
    return this.spaceService.remove(id);
  }

  extractTokenFromCookie(cookies: string){
    const token = cookies.split('; ').find(row => row.startsWith('access_token='))
    return token ? token.split('=')[0] : undefined
  }
}
