import { IsNotEmpty, IsUUID } from "class-validator";
import { UUID } from "node:crypto";

export class CreateGameSessionPlayerDto {
    @IsNotEmpty()
    @IsUUID()
    gameSessionId: UUID;

    @IsNotEmpty()
    @IsUUID()
    gameSessionPlayerId: UUID;
}