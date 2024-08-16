import { IsNotEmpty, IsString } from "class-validator"
import { Column } from "typeorm"

export class CreateMessageDto {
    @Column()
    @IsString()
    @IsNotEmpty()
    body: string

    @Column()
    @IsString()
    @IsNotEmpty()
    sender_id: string

    @Column()
    @IsString()
    @IsNotEmpty()
    reciever_id: string

    @Column()
    @IsNotEmpty()
    @IsString()
    type: "Group" | "Private"

}
