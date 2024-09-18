import { IsNotEmpty, IsString } from "class-validator"

export class CreateSpaceDto {
    @IsString()
    @IsNotEmpty()
    name: string
}
