import { PartialType } from "@nestjs/mapped-types";

import { CreateGameDto } from "./create_game.dto";

export class UpdateGameDto extends PartialType(CreateGameDto) {}