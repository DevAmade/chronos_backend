import { IsNotEmpty, IsUUID } from "class-validator";
import { UUID } from "node:crypto";

export class GameSessionPlayerDto {
    @IsNotEmpty()
    @IsUUID()
    gameSessionId: UUID;

    @IsNotEmpty()
    @IsUUID()
    playerId: UUID;
}