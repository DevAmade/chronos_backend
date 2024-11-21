import { IsBase64, IsNotEmpty, IsOptional, IsStrongPassword, IsUUID, Length, Matches } from "class-validator";
import { UUID } from "node:crypto";

import { ADMIN_PASSWORD_MIN_LENGTH,
         ADMIN_PASSWORD_MIN_LOWERCASE,
         ADMIN_PASSWORD_MIN_NUMBERS,
         ADMIN_PASSWORD_MIN_SYMBOLS,
         ADMIN_PASSWORD_MIN_UPPERCASE,
         ADMIN_PSEUDO_MAX_LENGTH,
         ADMIN_PSEUDO_MIN_LENGTH,
         ADMIN_PSEUDO_REGEX } from "../validation/validation.config";

export class CreateAdminDto {
    @IsOptional()
    @IsUUID()
    avatarId: UUID;

    @IsOptional()
    @IsBase64()
    avatarCustom: Buffer;

    @IsNotEmpty()
    @Length(
        ADMIN_PSEUDO_MIN_LENGTH,
        ADMIN_PSEUDO_MAX_LENGTH
    )
    @Matches(ADMIN_PSEUDO_REGEX)
    pseudo: string;

    @IsNotEmpty()
    @IsStrongPassword({
        minLength: ADMIN_PASSWORD_MIN_LENGTH,
        minLowercase: ADMIN_PASSWORD_MIN_LOWERCASE,
        minUppercase: ADMIN_PASSWORD_MIN_UPPERCASE,
        minNumbers: ADMIN_PASSWORD_MIN_NUMBERS,
        minSymbols: ADMIN_PASSWORD_MIN_SYMBOLS,
    })
    password: string;
}