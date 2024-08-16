import { IsNotEmpty, IsString } from "class-validator";

export class CreateFileDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    body: string

    @IsNotEmpty()
    @IsString()
    type: 'pdf' | 'docx' | 'excel' | 'json' | 'text' | 'mackdown'
}
