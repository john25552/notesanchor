import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService
  ){}
  async create(createUserDto: CreateUserDto) {
    let isUser = await this.userRepository.findOneBy({email_address: createUserDto.email_address})
    if(isUser) throw new ConflictException('Email already exists')
    
    let hashedPassword = await new Promise<string>((resolve, reject) => {
      bcrypt.hash(createUserDto.password, 10, (err, hash) => {
        if(err) reject(err);
        resolve(hash);
      })
    })

    let user = this.userRepository.create()
    user.email_address = createUserDto.email_address
    user.password = hashedPassword
    
    const {password, createdAt, updatedAt, id, ...createdUser} = await this.userRepository.save(user)
    const payload = {sub: id, email: createdUser.email_address}

    return {access_token: await this.jwtService.signAsync(payload), user: createdUser};
  }


  findAll() {
    return `This action returns all user`;
  }

  async login(loginDto: LoginDto) {
    let isUser = await this.userRepository.findOneBy({email_address: loginDto.email_address})
    if (!isUser) throw new NotFoundException()

    let isAuthorized = bcrypt.compareSync(loginDto.password, isUser.password)

    if(!isAuthorized) throw new UnauthorizedException()

    const {password, createdAt, updatedAt, id, ...authorizedUser} = isUser
    const payload = {sub: id, email: authorizedUser.email_address}
    
    return {access_token: await this.jwtService.signAsync(payload), user: authorizedUser};
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
