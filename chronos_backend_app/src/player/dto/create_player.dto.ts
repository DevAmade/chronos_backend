import { UUID } from "node:crypto";
import { IsBase64, IsDateString, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsStrongPassword, IsUUID, Length, Matches } from "class-validator";

import { REGEX_NORMALIZE } from "../../toolkit/regex";

export class CreatePlayerDto {
    @IsOptional()
    @IsUUID()
    avatarId: UUID;

    @IsOptional()
    @IsBase64()
    avatarCustom: Buffer;

    @IsNotEmpty()
    @Length(3, 15)
    pseudo: string;

    @IsNotEmpty()
    @Matches(REGEX_NORMALIZE)
    firstName: string;

    @IsNotEmpty()
    @Matches(REGEX_NORMALIZE)
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
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
    password: string;

    @IsNotEmpty()
    @IsString()
    country: string;
}