import { PartialType } from "@nestjs/mapped-types";

import { CreateAvatarDto } from "./create_avatar.dto";

export class UpdateAvatarDto extends PartialType(CreateAvatarDto) {}