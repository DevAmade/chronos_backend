import { UUID } from "node:crypto";
import { IsNotEmpty, IsUUID } from "class-validator";

import { IsResourceId } from "../../../core/toolkit/validator/resource_id.validator";
import { IsNotDuplicatedJoin } from "../../../core/toolkit/validator/not_duplicated_join.validator";

import { GameService } from "../../game/service/game.service";
import { GameOwnedService } from "../service/game_owned.service";
import { PlayerService } from "../service/player.service";

export class GameOwnedDto {
    @IsNotEmpty()
    @IsUUID()
    @IsResourceId(PlayerService)
    @IsNotDuplicatedJoin(GameOwnedService)
    playerId: UUID;

    @IsNotEmpty()
    @IsUUID()
    @IsResourceId(GameService)
    gameId: UUID;
}