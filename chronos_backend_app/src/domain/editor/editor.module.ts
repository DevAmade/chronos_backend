import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Editor } from './model/editor.model';
import { EditorController } from './controller/editor.controller';
import { EditorService } from './service/editor.service';

@Module({
    imports: [
        SequelizeModule.forFeature([Editor]),
    ],
    controllers: [
        EditorController,
    ],
    providers: [
        EditorService,
    ],
})
export class EditorModule {}