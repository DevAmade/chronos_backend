import { PartialType } from "@nestjs/mapped-types";
import { CreateGameSessionDto } from "./create_game_session.dto";

export class UpdateGameSessionDto extends PartialType(CreateGameSessionDto) {}