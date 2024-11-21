import { UUID } from "node:crypto";
import { IsBase64, IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsStrongPassword, IsUUID, Length, Matches } from "class-validator";

import { CountryCodeEnum } from "../validation/country_code.enum";
import { PLAYER_PASSWORD_MIN_LENGTH,
         PLAYER_PASSWORD_MIN_LOWERCASE,
         PLAYER_PASSWORD_MIN_NUMBERS,
         PLAYER_PASSWORD_MIN_SYMBOLS,
         PLAYER_PASSWORD_MIN_UPPERCASE,
         PLAYER_PSEUDO_MAX_LENGTH,
         PLAYER_PSEUDO_MIN_LENGTH,
         PLAYER_PSEUDO_REGEX,
         PLAYER_FIRST_NAME_REGEX,
         PLAYER_FIRST_NAME_MIN_LENGTH,
         PLAYER_FIRST_NAME_MAX_LENGTH,
         PLAYER_LAST_NAME_REGEX,
         PLAYER_LAST_NAME_MAX_LENGTH,
         PLAYER_LAST_NAME_MIN_LENGTH } from "../validation/validation.config";

export class CreatePlayerDto {
    @IsOptional()
    @IsUUID()
    avatarId: UUID;

    @IsOptional()
    @IsBase64()
    avatarCustom: Buffer;

    @IsNotEmpty()
    @Length(
        PLAYER_PSEUDO_MIN_LENGTH,
        PLAYER_PSEUDO_MAX_LENGTH
    )
    @Matches(PLAYER_PSEUDO_REGEX)
    pseudo: string;

    @IsNotEmpty()
    @Length(
        PLAYER_FIRST_NAME_MIN_LENGTH,
        PLAYER_FIRST_NAME_MAX_LENGTH
    )
    @Matches(PLAYER_FIRST_NAME_REGEX)
    firstName: string;

    @IsNotEmpty()
    @Length(
        PLAYER_LAST_NAME_MIN_LENGTH,
        PLAYER_LAST_NAME_MAX_LENGTH
    )
    @Matches(PLAYER_LAST_NAME_REGEX)
    lastName: string;

    @IsNotEmpty()
    @IsDateString()
    birthdate: Date;

    @IsNotEmpty()
    @IsPhoneNumber()
    phoneNumber: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsStrongPassword({
        minLength: PLAYER_PASSWORD_MIN_LENGTH,
        minLowercase: PLAYER_PASSWORD_MIN_LOWERCASE,
        minUppercase: PLAYER_PASSWORD_MIN_UPPERCASE,
        minNumbers: PLAYER_PASSWORD_MIN_NUMBERS,
        minSymbols: PLAYER_PASSWORD_MIN_SYMBOLS,
    })
    password: string;

    @IsNotEmpty()
    @IsEnum(CountryCodeEnum)
    country: CountryCodeEnum;
}