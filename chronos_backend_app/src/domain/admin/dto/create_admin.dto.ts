import { IsNotEmpty, IsOptional, IsStrongPassword, IsUUID, Length, Matches, Validate } from "class-validator";
import { UUID } from "node:crypto";

import { IsResourceId } from "../../../core/toolkit/validator/resource_id.validator";
import { IsNotDuplicatedResource } from "../../../core/toolkit/validator/not_duplicated_resource.validator";

import { AvatarService } from "../../avatar/service/avatar.service";
import { Avatar } from "../../avatar/model/avatar.model";
import { AdminService } from "../service/admin.service";
import { Admin } from "../model/admin.model";
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
    @IsResourceId(new AvatarService(Avatar))
    avatarId: UUID;

    @IsNotEmpty()
    @Length(
        ADMIN_PSEUDO_MIN_LENGTH,
        ADMIN_PSEUDO_MAX_LENGTH,
    )
    @Matches(ADMIN_PSEUDO_REGEX)
    @IsNotDuplicatedResource(new AdminService(Admin))
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