import { Module } from '@nestjs/common';
import { SpaceService } from './space.service';
import { SpaceGateway } from './space.gateway';

@Module({
  providers: [SpaceGateway, SpaceService],
})
export class SpaceModule {}
