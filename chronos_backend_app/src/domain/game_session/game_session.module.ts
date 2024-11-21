import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { GameSession } from './model/game_session.model';
import { GameSessionPlayer } from './model/game_session_player.model';
import { GameSessionController } from './controller/game_session.controller';
import { GameSessionService } from './service/game_session.service';

@Module({
    imports: [
        SequelizeModule.forFeature([GameSession, GameSessionPlayer]),
    ],
    controllers: [
        GameSessionController,
    ],
    providers: [
        GameSessionService,
    ],
})
export class GameSessionModule {}