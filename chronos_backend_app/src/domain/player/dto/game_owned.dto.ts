import { UUID } from "node:crypto";
import { IsNotEmpty, IsUUID } from "class-validator";

export class GameOwnedDto {
    @IsNotEmpty()
    @IsUUID()
    playerId: UUID;

    @IsNotEmpty()
    @IsUUID()
    gameId: UUID;
}