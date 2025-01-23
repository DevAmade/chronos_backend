import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';

import { PlayerGuard } from '../toolkit/guard/player.guard';
import { AdminGuard } from '../toolkit/guard/admin.guard';
import { Editor } from './model/editor.model';
import { EditorController } from './controller/editor.controller';
import { EditorService } from './service/editor.service';

@Module({
    imports: [
        SequelizeModule.forFeature([Editor]),
        JwtModule,
    ],
    controllers: [
        EditorController,
    ],
    providers: [
        EditorService,
        PlayerGuard,
        AdminGuard,
    ],
})
export class EditorModule {}