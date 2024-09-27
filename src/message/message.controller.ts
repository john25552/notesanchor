import { Body, Controller, Get, Param, Post, Res, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { Response } from "express";
import { ChatService } from "src/chat/chat.service";
import { CreateChatDto } from "src/chat/dto/create-chat.dto";
import { AuthGuard } from "src/user/auth.guard";
import { GetUser } from "src/user/getuser.decorator";
import { MessageService } from "./message.service";
import { CreateMessageDto } from "./dto/create-message.dto";

@UseGuards(AuthGuard)
@Controller('message')
export class MessageController {
    constructor(
        private messageService: MessageService
    ){}

    @UsePipes(new ValidationPipe({transform: true}))
    @Post('create')
    async create(@Body() createMessageDto: CreateMessageDto, @Res() response: Response, @GetUser() user: any){
        let createdMessage = await this.messageService.create(createMessageDto, user)
        return response.send(createdMessage)
    }

    @Get(":id")
    async findAll(@Res() response: Response, @Param() id: string){
        let messages = await this.messageService.findAll(id)
        return response.send(messages)
    }
}