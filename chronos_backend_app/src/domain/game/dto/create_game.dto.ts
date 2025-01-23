import { IsNotEmpty, IsNumber, IsOptional, IsUUID, Length, Matches } from "class-validator";
import { UUID } from "node:crypto";

import { IsResourceId } from "../../../core/toolkit/validator/resource_id.validator";
import { IsNotDuplicatedResource } from "../../../core/toolkit/validator/not_duplicated_resource.validator";

import { EditorService } from "../../editor/service/editor.service";
import { Editor } from "../../editor/model/editor.model";
import { GameService } from "../service/game.service";
import { Game } from "../model/game.model";
import { GAME_DESCRIPTION_MAX_LENGTH,
         GAME_DESCRIPTION_MIN_LENGTH,
         GAME_NAME_MAX_LENGTH, 
         GAME_NAME_MIN_LENGTH,
         GAME_NAME_REGEX } from "../validation/validation.config";

export class CreateGameDto {
    @IsOptional()
    @IsUUID()
    @IsResourceId(new EditorService(Editor))
    editorId: UUID;
    
    @IsNotEmpty()
    @Length(
        GAME_NAME_MIN_LENGTH,
        GAME_NAME_MAX_LENGTH,
    )
    @Matches(GAME_NAME_REGEX)
    @IsNotDuplicatedResource(new GameService(Game))
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