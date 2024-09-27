import { Body, Controller, Get, Param, Post, Res, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthGuard } from "src/user/auth.guard";
import { SpaceService } from "./space.service";
import { CreateSpaceDto } from "./dto/create-space.dto";
import { GetUser } from "src/user/getuser.decorator";
import { Response } from "express";

@UseGuards(AuthGuard)
@Controller('space')
export class SpaceContoller {
    constructor(
        private readonly spaceService: SpaceService
    ){}

    @UsePipes(new ValidationPipe({transform: true}))
    @Post('create')
    async create(@Body() createSpaceDto: CreateSpaceDto, @GetUser() user: any, @Res() response: Response){
        let createdSpace = await this.spaceService.create(createSpaceDto, user)
        console.log("Space created is: ", createdSpace)
        return response.send(createdSpace)
    }

    @Get()
    async findAll(@Res() response: Response){
        let spaces = await this.spaceService.findAll()
        return response.send(spaces)
    }

    @Get(':id')
    async findOne(@Param() id: string, @Res() response: Response){
        let space = await this.spaceService.findOne(id)
        return response.send(space)
    }

    @Post('join/:id')
    async join(@Param() id: {id: string}, @GetUser() user: any, @Res() response: Response){
        let isSucceful = await this.spaceService.join(id, user)
        return response.send(isSucceful)
    }

}