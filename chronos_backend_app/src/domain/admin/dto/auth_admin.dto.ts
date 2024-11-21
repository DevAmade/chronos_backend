import { IsNotEmpty, IsString } from "class-validator";

export class AuthAdminDto {
    @IsNotEmpty()
    @IsString()
    pseudo: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}