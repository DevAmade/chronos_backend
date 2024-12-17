import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';

import { PlayerGuard } from '../guard/player.guard';
import { AdminGuard } from '../guard/admin.guard';
import { Game } from './model/game.model';
import { GameController } from './controller/game.controller';
import { GameService } from './service/game.service';

@Module({
    imports: [
        SequelizeModule.forFeature([Game]),
        JwtModule,
    ],
    controllers: [
        GameController,
    ],
    providers: [
        GameService,
        PlayerGuard,
        AdminGuard,
    ],
    exports: [
        GameService,
    ],
})
export class GameModule {}