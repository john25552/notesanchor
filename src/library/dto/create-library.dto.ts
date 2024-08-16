import { IsNotEmpty, IsString } from "class-validator";

export class CreateLibraryDto {
    @IsString()
    @IsNotEmpty()
    name: string
}
