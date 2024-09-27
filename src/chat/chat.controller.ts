import { Body, Controller, Get, Param, Post, Res, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthGuard } from "src/user/auth.guard";
import { ChatService } from "./chat.service";
import { CreateChatDto } from "./dto/create-chat.dto";
import { Response } from "express";
import { GetUser } from "src/user/getuser.decorator";

@UseGuards(AuthGuard)
@Controller('chat')
export class ChatController {
    constructor(
        private chatService: ChatService
    ){}

    @UsePipes(new ValidationPipe({transform: true}))
    @Post('create')
    async create(@Body() createChatDto: CreateChatDto, @Res() response: Response, @GetUser() user: any){
        let createdChat = await this.chatService.create(createChatDto, user)

        return response.send(createdChat)
    }

    // Get all chats associated to a specific(logged in) user
    @Get()
    async findAll(@Res() response: Response, @GetUser() user: any){
        let chats = await this.chatService.findAll(user)
        return response.send(chats)
    }

    // Request for joining a chat room
    @Post('join:id')
    async join(@Param() id: string, @Res() response: Response, @GetUser() user: any){
        let isSuccessful = await this.chatService.join(id, user)
        return response.send(isSuccessful)
    }
}