import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Player } from './model/player.model';
import { FavoritePlayer } from './model/favorite_player.model';
import { GameOwned } from './model/game_owned.model';
import { PlayerController } from './controller/player.controller';
import { PlayerService } from './service/player.service';
import { CrudService } from '@nestjsx/crud';

@Module({
    imports: [
        SequelizeModule.forFeature([Player, FavoritePlayer, GameOwned]),
    ],
    controllers: [
        PlayerController,
    ],
    providers: [
        PlayerService,
    ],
})
export class PlayerModule {}