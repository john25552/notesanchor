import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SpaceService } from './space.service';
import { SpaceGateway } from './space.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Space } from './entities/space.entity';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Space]), UserModule],
  providers: [SpaceGateway, SpaceService, JwtService],
})
export class SpaceModule {}
