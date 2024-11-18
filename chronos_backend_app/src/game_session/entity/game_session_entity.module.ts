import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { GameSession } from './game_session.entity';
import { GameSessionPlayer } from './game_session_player.entity';

@Module({
    imports: [SequelizeModule.forFeature([GameSession, GameSessionPlayer])],
    exports: [SequelizeModule],
})
export class GameSessionEntityModule {}