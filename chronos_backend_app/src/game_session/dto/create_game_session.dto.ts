import { IsDate, IsNotEmpty, IsOptional, IsUrl, IsUUID, Length, Matches } from "class-validator";
import { UUID } from "node:crypto";

import { GAME_SESSION_DESCRIPTION_MAX_LENGTH,
         GAME_SESSION_DESCRIPTION_MIN_LENGTH,
         GAME_SESSION_NAME_MAX_LENGTH,
         GAME_SESSION_NAME_MIN_LENGTH,
         GAME_SESSION_NAME_REGEX } from "../validation/config_validation";

export class CreateGameSessionDto {
    @IsNotEmpty()
    @IsUUID()
    organizerId: UUID;

    @IsNotEmpty()
    @IsUUID()
    gameId: UUID;

    @IsNotEmpty()
    @Length(
        GAME_SESSION_NAME_MIN_LENGTH,
        GAME_SESSION_NAME_MAX_LENGTH
    )
    @Matches(GAME_SESSION_NAME_REGEX)
    name: string;

    @IsNotEmpty()
    @IsDate()
    startDate: Date;

    @IsNotEmpty()
    @IsDate()
    endDate: Date;

    @IsOptional()
    @Length(
        GAME_SESSION_DESCRIPTION_MIN_LENGTH,
        GAME_SESSION_DESCRIPTION_MAX_LENGTH
    )
    description: string;

    @IsOptional()
    @IsUrl({ protocols: ['https'] })
    chatRoom: string;
}