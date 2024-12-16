import { UUID } from "node:crypto";
import { IsNotEmpty, IsUUID } from "class-validator";

export class FavoritePlayerDto {
    @IsNotEmpty()
    @IsUUID()
    playerId: UUID;

    @IsNotEmpty()
    @IsUUID()
    favoritePlayerId: UUID;
}