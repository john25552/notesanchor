import { IsNotEmpty, IsString } from "class-validator";

export class CreateCommentDto {
    @IsNotEmpty()
    @IsString()
    target: 'post' | 'file'

    @IsNotEmpty()
    @IsString()
    body: string
}
