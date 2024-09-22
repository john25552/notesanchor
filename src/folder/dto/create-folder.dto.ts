import { IsNotEmpty, IsString } from "class-validator";

export class CreateFolderDto {
    @IsString()
    @IsNotEmpty()
    name: string
    
    @IsString()
    @IsNotEmpty()
    associated_library: string
}
