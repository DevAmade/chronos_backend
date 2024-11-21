import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Avatar } from './model/avatar.model';
import { AvatarController } from './controller/avatar.controller';
import { AvatarService } from './service/avatar.service';

@Module({
    imports: [
        SequelizeModule.forFeature([Avatar]),
    ],
    controllers: [
        AvatarController,
    ],
    providers: [
        AvatarService,
    ],
})
export class AvatarModule {}