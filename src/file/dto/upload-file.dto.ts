import { IsNotEmpty, IsString } from "class-validator";

export class UploadFileDto {
    @IsString()
    @IsNotEmpty()
    associated_folder: string

    @IsString()
    @IsNotEmpty()
    associated_library: string

    @IsString()
    @IsNotEmpty()
    kind: string
}
