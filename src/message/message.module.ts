import { Module, forwardRef } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageGateway } from './message.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { MessageController } from './message.controller';
import { ChatModule } from 'src/chat/chat.module';
import { SpaceModule } from 'src/space/space.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), ChatModule, SpaceModule, forwardRef(()=> UserModule) ],
  controllers: [MessageController],
  providers: [MessageGateway, MessageService],
  exports: [MessageService, TypeOrmModule]
})
export class MessageModule {}
