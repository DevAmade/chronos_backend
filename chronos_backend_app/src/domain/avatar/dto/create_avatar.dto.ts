import { IsBase64, IsNotEmpty, Length, Matches } from "class-validator";

import { AVATAR_NAME_MAX_LENGTH,
         AVATAR_NAME_MIN_LENGTH,
         AVATAR_NAME_REGEX } from "../validation/validation.config";

export class CreateAvatarDto {
    @IsNotEmpty()
    @Length(
        AVATAR_NAME_MIN_LENGTH,
        AVATAR_NAME_MAX_LENGTH
    )
    @Matches(AVATAR_NAME_REGEX)
    name: string;

    @IsNotEmpty()
    @IsBase64()
    photo: Buffer;
}