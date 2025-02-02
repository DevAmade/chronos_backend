import { IsString, IsEmail, IsNotEmpty } from "class-validator";

export class AuthPlayerDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}