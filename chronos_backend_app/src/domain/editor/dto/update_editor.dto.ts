import { PartialType } from "@nestjs/mapped-types";

import { CreateEditorDto } from "./create_editor.dto";

export class UpdateEditorDto extends PartialType(CreateEditorDto) {}