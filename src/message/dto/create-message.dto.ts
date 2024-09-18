import { IsNotEmpty, IsString } from "class-validator"

export class CreateMessageDto {
    @IsString()
    @IsNotEmpty()
    body: string

    @IsString()
    @IsNotEmpty()
    sender_id: string

    @IsString()
    @IsNotEmpty()
    reciever_id: string

    @IsNotEmpty()
    @IsString()
    type: "Group" | "Private"

}
