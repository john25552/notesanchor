import { Controller, Get, Post, Body, Patch, Param, Delete, Res, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto, @Res() response: Response) {
      const {user, access_token} = await this.userService.create(createUserDto);
      response.cookie('access_token', access_token, {httpOnly: true, secure: false})
      return response.send(user)
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() response: Response) {
      const {user, access_token} = await this.userService.login(loginDto);
      response.cookie('access_token', access_token, {httpOnly: true, secure: false})
      return response.send(user)
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
