import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { UUID } from "node:crypto";

import { IsResourceId } from "../../../core/toolkit/validator/resource_id.validator";

import { PlayerService } from "../../player/service/player.service";
import { Player } from "../../player/model/player.model";
import { GameSessionService } from "../service/game_session.service";
import { GameSession } from "../model/game_session.model";

export class GameSessionPlayerDto {
    @IsOptional()
    @IsUUID()
    @IsResourceId(new GameSessionService(GameSession))
    gameSessionId: UUID;

    @IsNotEmpty()
    @IsUUID()
    @IsResourceId(new PlayerService(Player))
    playerId: UUID;
}