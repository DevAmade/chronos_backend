import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { SupportService } from '../../../core/toolkit/support.service';

import { Editor } from '../model/editor.model';
import { CreateEditorDto } from '../dto/create_editor.dto';
import { UpdateEditorDto } from '../dto/update_editor.dto';

@Injectable()
export class EditorService 
    extends SupportService<CreateEditorDto, UpdateEditorDto, Editor> {
        constructor(@InjectModel(Editor) protected readonly editorModel: typeof Editor) {
            super(editorModel);
        }
}