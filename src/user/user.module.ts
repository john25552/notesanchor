import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: {expiresIn: '1h'},
      global: true
  })],
  controllers: [UserController],
  providers: [UserService, AuthGuard],
  exports: [TypeOrmModule, UserService]
})
export class UserModule {}
