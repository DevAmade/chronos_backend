import { IsNotEmpty, IsNumber, IsOptional, IsUUID, Length, Matches } from "class-validator";
import { UUID } from "node:crypto";

import { GAME_DESCRIPTION_MAX_LENGTH,
         GAME_DESCRIPTION_MIN_LENGTH,
         GAME_NAME_MAX_LENGTH, 
         GAME_NAME_MIN_LENGTH,
         GAME_NAME_REGEX } from "../validation/validation.config";

export class CreateGameDto {
    @IsNotEmpty()
    @IsUUID()
    editor_id: UUID;
    
    @IsNotEmpty()
    @Length(
        GAME_NAME_MIN_LENGTH,
        GAME_NAME_MAX_LENGTH,
    )
    @Matches(GAME_NAME_REGEX)
    name: string;

    @IsOptional()
    @Length(
        GAME_DESCRIPTION_MIN_LENGTH,
        GAME_DESCRIPTION_MAX_LENGTH,
    )
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