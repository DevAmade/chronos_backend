import { UUID } from "node:crypto";
import { IsNotEmpty, IsUUID } from "class-validator";

import { IsResourceId } from "../../../core/toolkit/validator/resource_id.validator";
import { IsNotDuplicatedJoin } from "../../../core/toolkit/validator/not_duplicated_join.validator";

import { FavoritePlayerService } from "../service/favorite_player.service";
import { FavoritePlayer } from "../model/favorite_player.model";
import { PlayerService } from "../service/player.service";
import { Player } from "../model/player.model";

export class FavoritePlayerDto {
    @IsNotEmpty()
    @IsUUID()
    @IsResourceId(new PlayerService(Player))
    @IsNotDuplicatedJoin(new FavoritePlayerService(FavoritePlayer))
    playerId: UUID;

    @IsNotEmpty()
    @IsUUID()
    @IsResourceId(new PlayerService(Player))
    favoritePlayerId: UUID;
}