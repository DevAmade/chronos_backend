import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';

import { PlayerGuard } from '../toolkit/guard/player.guard';
import { AdminGuard } from '../toolkit/guard/admin.guard';
import { Avatar } from './model/avatar.model';
import { AvatarController } from './controller/avatar.controller';
import { AvatarService } from './service/avatar.service';

@Module({
    imports: [
        SequelizeModule.forFeature([Avatar]),
        JwtModule,
    ],
    controllers: [
        AvatarController,
    ],
    providers: [
        AvatarService,
        PlayerGuard,
        AdminGuard,
    ],
    exports: [
        AvatarService,
    ],
})
export class AvatarModule {}