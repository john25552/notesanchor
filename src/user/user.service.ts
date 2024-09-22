import { BadRequestException, ConflictException, Injectable, NotFoundException, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { LibraryService } from 'src/library/library.service';
import { CreateLibraryDto } from 'src/library/dto/create-library.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
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
    
    let newUser = await this.userRepository.save(user)

    if(!newUser) throw new ServiceUnavailableException('Unable to create user')

    const {password, createdAt, updatedAt, id, ...createdUser} = newUser;
    const payload = {sub: id, email: createdUser.email_address}

    return {access_token: this.jwtService.sign(payload, {secret: process.env.JWT_KEY}), user: createdUser};
  }

  async findOne(email: string){
    try{
      let user = await this.userRepository.findOneBy({email_address: email})
      if(!user) throw new BadRequestException(`No user with email ${email}`)
      
      return user
    } catch(error) {
      console.log("Error while retrieving user: ", error)
      throw new BadRequestException(error)
    }
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
    
    return {access_token: this.jwtService.sign(payload, {secret: process.env.JWT_KEY}), user: authorizedUser};
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
