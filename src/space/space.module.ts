import { MiddlewareConsumer, Module, NestModule, forwardRef } from '@nestjs/common';
import { SpaceService } from './space.service';
import { SpaceGateway } from './space.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Space } from './entities/space.entity';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { SpaceContoller } from './space.controller';
import { MessageModule } from 'src/message/message.module';

@Module({
  imports: [TypeOrmModule.forFeature([Space]), UserModule, forwardRef(()=> MessageModule)],
  providers: [SpaceGateway, SpaceService, JwtService],
  controllers: [SpaceContoller],
  exports: [SpaceService, SpaceGateway]
})
export class SpaceModule {}
