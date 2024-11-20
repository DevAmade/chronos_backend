import { IsBase64, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateGameDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsBase64()
    coverPhoto: Buffer;

    @IsNotEmpty()
    @IsString()
    editor: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    minNumberPlayers: number;

    @IsNotEmpty()
    @IsNumber()
    maxNumberPlayers: number;

    @IsNotEmpty()
    @IsNumber()
    PEGI: number;
}