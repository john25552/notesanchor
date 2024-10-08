import { IsNotEmpty, IsString } from "class-validator";

export class CreateFileDto {
    @IsString()
    associated_folder: string

    @IsString()
    @IsNotEmpty()
    associated_library: string
}
