import { IsDate, IsNotEmpty, IsOptional, IsString, IsUrl, IsUUID, Length } from "class-validator";
import { UUID } from "node:crypto";

export class CreateGameSessionDto {
    @IsNotEmpty()
    @IsUUID()
    organizerId: UUID;

    @IsNotEmpty()
    @IsUUID()
    gameId: UUID;

    @IsNotEmpty()
    @Length(3, 15)
    name: string;

    @IsNotEmpty()
    @IsDate()
    startDate: Date;

    @IsNotEmpty()
    @IsDate()
    endDate: Date;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsUrl()
    chatRoom: string;
}