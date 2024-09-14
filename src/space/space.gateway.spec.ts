import { Test, TestingModule } from '@nestjs/testing';
import { SpaceGateway } from './space.gateway';
import { SpaceService } from './space.service';

describe('SpaceGateway', () => {
  let gateway: SpaceGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpaceGateway, SpaceService],
    }).compile();

    gateway = module.get<SpaceGateway>(SpaceGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
