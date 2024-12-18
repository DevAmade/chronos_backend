import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { UUID } from "node:crypto";

import { IsResourceId } from "../../../core/toolkit/validator/resource_id.validator";

import { PlayerService } from "../../player/service/player.service";
import { GameSessionService } from "../service/game_session.service";

export class GameSessionPlayerDto {
    @IsOptional()
    @IsUUID()
    @IsResourceId(GameSessionService)
    gameSessionId: UUID;

    @IsNotEmpty()
    @IsUUID()
    @IsResourceId(PlayerService)
    playerId: UUID;
}