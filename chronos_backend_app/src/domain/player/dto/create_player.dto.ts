import { UUID } from "node:crypto";
import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsStrongPassword, IsUUID, Length, Matches } from "class-validator";

import { IsResourceId } from "../../../core/toolkit/validator/resource_id.validator";
import { IsNotDuplicatedResource } from "../../../core/toolkit/validator/not_duplicated_resource.validator";

import { AvatarService } from "../../avatar/service/avatar.service";
import { Avatar } from "../../avatar/model/avatar.model";
import { PlayerService } from "../service/player.service";
import { Player } from "../model/player.model";
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
         PLAYER_LAST_NAME_MIN_LENGTH, 
         PLAYER_PHONE_NUMBER_COUNTRY_CODE } from "../validation/validation.config";

export class CreatePlayerDto {
    @IsOptional()
    @IsUUID()
    @IsResourceId(new AvatarService(Avatar))
    avatarId: UUID;

    @IsNotEmpty()
    @Length(
        PLAYER_PSEUDO_MIN_LENGTH,
        PLAYER_PSEUDO_MAX_LENGTH,
    )
    @Matches(PLAYER_PSEUDO_REGEX)
    @IsNotDuplicatedResource(new PlayerService(Player))
    pseudo: string;

    @IsNotEmpty()
    @Length(
        PLAYER_FIRST_NAME_MIN_LENGTH,
        PLAYER_FIRST_NAME_MAX_LENGTH,
    )
    @Matches(PLAYER_FIRST_NAME_REGEX)
    firstName: string;

    @IsNotEmpty()
    @Length(
        PLAYER_LAST_NAME_MIN_LENGTH,
        PLAYER_LAST_NAME_MAX_LENGTH,
    )
    @Matches(PLAYER_LAST_NAME_REGEX)
    lastName: string;

    @IsNotEmpty()
    @IsDateString()
    birthdate: Date;

    @IsOptional()
    @IsPhoneNumber(PLAYER_PHONE_NUMBER_COUNTRY_CODE)
    phoneNumber: string;

    @IsNotEmpty()
    @IsEmail()
    @IsNotDuplicatedResource(new PlayerService(Player))
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
}