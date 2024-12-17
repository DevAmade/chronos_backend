import { IsDateString, IsNotEmpty, IsOptional, IsUrl, IsUUID, Length, Matches } from "class-validator";
import { UUID } from "node:crypto";

import { IsResourceId } from "../../../core/toolkit/validator/resource_id.validator";

import { PlayerService } from "../../player/service/player.service";
import { GameService } from "../../game/service/game.service";
import { GAME_SESSION_DESCRIPTION_MAX_LENGTH,
         GAME_SESSION_DESCRIPTION_MIN_LENGTH,
         GAME_SESSION_NAME_MAX_LENGTH,
         GAME_SESSION_NAME_MIN_LENGTH,
         GAME_SESSION_NAME_REGEX } from "../validation/validation.config";

export class CreateGameSessionDto {
    @IsNotEmpty()
    @IsUUID()
    @IsResourceId(PlayerService)
    organizerId: UUID;

    @IsNotEmpty()
    @IsUUID()
    @IsResourceId(GameService)
    gameId: UUID;

    @IsNotEmpty()
    @Length(
        GAME_SESSION_NAME_MIN_LENGTH,
        GAME_SESSION_NAME_MAX_LENGTH,
    )
    @Matches(GAME_SESSION_NAME_REGEX)
    name: string;

    @IsNotEmpty()
    @IsDateString()
    startDate: Date;

    @IsNotEmpty()
    @IsDateString()
    endDate: Date;

    @IsOptional()
    @Length(
        GAME_SESSION_DESCRIPTION_MIN_LENGTH,
        GAME_SESSION_DESCRIPTION_MAX_LENGTH,
    )
    description: string;

    @IsOptional()
    @IsUrl({ protocols: ['https'] })
    chatRoom: string;
}