import { IsBase64, IsNotEmpty, IsOptional, IsStrongPassword, IsUUID, Length } from "class-validator";
import { UUID } from "node:crypto";

export class CreateAdminDto {
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
    @IsStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
    password: string;
}