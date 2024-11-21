import { IsBase64, IsNotEmpty, IsNumber, IsOptional, Length, Matches } from "class-validator";

import { GAME_DESCRIPTION_MAX_LENGTH,
         GAME_DESCRIPTION_MIN_LENGTH,
         GAME_EDITOR_MAX_LENGTH,
         GAME_EDITOR_MIN_LENGTH,
         GAME_EDITOR_REGEX, 
         GAME_NAME_MAX_LENGTH, 
         GAME_NAME_MIN_LENGTH,
         GAME_NAME_REGEX } from "../validation/validation.config";

export class CreateGameDto {
    @IsNotEmpty()
    @Length(
        GAME_NAME_MIN_LENGTH,
        GAME_NAME_MAX_LENGTH
    )
    @Matches(GAME_NAME_REGEX)
    name: string;

    @IsOptional()
    @IsBase64()
    coverPhoto: Buffer;

    @IsNotEmpty()
    @Length(
        GAME_EDITOR_MIN_LENGTH,
        GAME_EDITOR_MAX_LENGTH
    )
    @Matches(GAME_EDITOR_REGEX)
    editor: string;

    @IsOptional()
    @Length(
        GAME_DESCRIPTION_MIN_LENGTH,
        GAME_DESCRIPTION_MAX_LENGTH
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