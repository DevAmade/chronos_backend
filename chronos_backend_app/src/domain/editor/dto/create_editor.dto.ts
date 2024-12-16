import { IsNotEmpty, Length, Matches } from "class-validator";

import { EDITOR_NAME_MAX_LENGTH,
         EDITOR_NAME_MIN_LENGTH,
         EDITOR_NAME_REGEX } from "../validation/validation.config";

export class CreateEditorDto {
    @IsNotEmpty()
    @Length(
        EDITOR_NAME_MIN_LENGTH,
        EDITOR_NAME_MAX_LENGTH,
    )
    @Matches(EDITOR_NAME_REGEX)
    name: string;
}