import { IsNotEmpty, IsUUID } from "class-validator";
import { UUID } from "node:crypto";

import { IsResourceId } from "../../../core/toolkit/validator/resource_id.validator";
import { IsNotDuplicatedJoin } from "../../../core/toolkit/validator/not_duplicated_join.validator";

import { PlayerService } from "../../player/service/player.service";
import { GameSessionPlayerService } from "../service/game_session_player.service";
import { GameSessionService } from "../service/game_session.service";

export class GameSessionPlayerDto {
    @IsNotEmpty()
    @IsUUID()
    @IsResourceId(GameSessionService)
    @IsNotDuplicatedJoin(GameSessionPlayerService)
    gameSessionId: UUID;

    @IsNotEmpty()
    @IsUUID()
    @IsResourceId(PlayerService)
    playerId: UUID;
}