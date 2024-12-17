import { UUID } from "node:crypto";
import { IsNotEmpty, IsUUID } from "class-validator";

import { IsResourceId } from "../../../core/toolkit/validator/resource_id.validator";
import { IsNotDuplicatedJoin } from "../../../core/toolkit/validator/not_duplicated_join.validator";

import { FavoritePlayerService } from "../service/favorite_player.service";
import { PlayerService } from "../service/player.service";

export class FavoritePlayerDto {
    @IsNotEmpty()
    @IsUUID()
    @IsResourceId(PlayerService)
    @IsNotDuplicatedJoin(FavoritePlayerService)
    playerId: UUID;

    @IsNotEmpty()
    @IsUUID()
    @IsResourceId(PlayerService)
    favoritePlayerId: UUID;
}