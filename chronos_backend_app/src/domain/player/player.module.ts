import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';

import { PlayerGuard } from '../toolkit/guard/player.guard';
import { AdminGuard } from '../toolkit/guard/admin.guard';
import { Player } from './model/player.model';
import { FavoritePlayer } from './model/favorite_player.model';
import { GameOwned } from './model/game_owned.model';
import { PlayerController } from './controller/player.controller';
import { FavoritePlayerController } from './controller/favorite_player.controller';
import { GameOwnedController } from './controller/game_owned.controller';
import { PlayerService } from './service/player.service';
import { FavoritePlayerService } from './service/favorite_player.service';
import { GameOwnedService } from './service/game_owned.service';

@Module({
    imports: [
        SequelizeModule.forFeature([Player, FavoritePlayer, GameOwned]),
        JwtModule,
    ],
    controllers: [
        PlayerController,
        FavoritePlayerController,
        GameOwnedController,
    ],
    providers: [
        PlayerService,
        FavoritePlayerService,
        GameOwnedService,
        PlayerGuard,
        AdminGuard,
    ],
    exports: [
        PlayerService,
    ],
})
export class PlayerModule {}