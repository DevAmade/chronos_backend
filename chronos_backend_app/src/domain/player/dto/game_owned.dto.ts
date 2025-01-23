import { UUID } from "node:crypto";
import { IsNotEmpty, IsUUID } from "class-validator";

import { IsResourceId } from "../../../core/toolkit/validator/resource_id.validator";
import { IsNotDuplicatedJoin } from "../../../core/toolkit/validator/not_duplicated_join.validator";

import { GameService } from "../../game/service/game.service";
import { Game } from "../../game/model/game.model";
import { GameOwnedService } from "../service/game_owned.service";
import { GameOwned } from "../model/game_owned.model";
import { PlayerService } from "../service/player.service";
import { Player } from "../model/player.model";

export class GameOwnedDto {
    @IsNotEmpty()
    @IsUUID()
    @IsResourceId(new PlayerService(Player))
    @IsNotDuplicatedJoin(new GameOwnedService(GameOwned))
    playerId: UUID;

    @IsNotEmpty()
    @IsUUID()
    @IsResourceId(new GameService(Game))
    gameId: UUID;
}