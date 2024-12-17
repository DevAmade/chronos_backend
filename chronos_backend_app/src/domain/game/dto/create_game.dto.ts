import { IsNotEmpty, IsNumber, IsOptional, IsUUID, Length, Matches } from "class-validator";
import { UUID } from "node:crypto";

import { IsResourceId } from "../../../core/toolkit/validator/resource_id.validator";
import { IsNotDuplicatedResource } from "../../../core/toolkit/validator/not_duplicated_resource.validator";

import { EditorService } from "../../editor/service/editor.service";
import { GameService } from "../service/game.service";
import { GAME_DESCRIPTION_MAX_LENGTH,
         GAME_DESCRIPTION_MIN_LENGTH,
         GAME_NAME_MAX_LENGTH, 
         GAME_NAME_MIN_LENGTH,
         GAME_NAME_REGEX } from "../validation/validation.config";

export class CreateGameDto {
    @IsNotEmpty()
    @IsUUID()
    @IsResourceId(EditorService)
    editorId: UUID;
    
    @IsNotEmpty()
    @Length(
        GAME_NAME_MIN_LENGTH,
        GAME_NAME_MAX_LENGTH,
    )
    @Matches(GAME_NAME_REGEX)
    @IsNotDuplicatedResource(GameService)
    name: string;

    @IsOptional()
    @Length(
        GAME_DESCRIPTION_MIN_LENGTH,
        GAME_DESCRIPTION_MAX_LENGTH,
    )
    description: string;

    @IsNotEmpty()
    @IsNumber()
    minNumberPlayers: number;

    @IsNotEmpty()
    @IsNumber()
    maxNumberPlayers: number;

    @IsNotEmpty()
    @IsNumber()
    pegi: number;
}