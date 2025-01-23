import { PartialType } from "@nestjs/mapped-types"
import { IsBoolean, IsEnum, IsOptional } from "class-validator";

import { ProfileStatus } from "../validation/profile_status.enum";
import { CreatePlayerDto } from "./create_player.dto"

export class UpdatePlayerDto extends PartialType(CreatePlayerDto) {
    @IsOptional()
    @IsEnum(ProfileStatus)
    profileStatus: ProfileStatus;

    @IsOptional()
    @IsBoolean()
    banned: boolean;
}