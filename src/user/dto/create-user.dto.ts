import { IsEmail, IsNotEmpty, IsString } from "class-validator"
import { Column } from "typeorm"

export class CreateUserDto {
    @Column()
    @IsString()
    full_name: string

    @Column()
    @IsEmail()
    @IsNotEmpty()
    email_address: string

    @Column()
    @IsString()
    @IsNotEmpty()
    password: string
}
