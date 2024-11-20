import { IsBase64, IsNotEmpty, IsString } from "class-validator";

export class CreateAvatarDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsBase64()
    photo: Buffer;
}