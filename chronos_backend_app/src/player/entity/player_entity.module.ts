import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';

import { Player } from './player.entity';
import { FavoritePlayer } from './favorite_player.entity';
import { GameOwned } from './game_owned.entity';

@Module({
    imports: [SequelizeModule.forFeature([Player, FavoritePlayer, GameOwned])],
    exports: [SequelizeModule],
})
export class PlayerEntityModule {}