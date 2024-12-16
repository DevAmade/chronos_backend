import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { PlayerModule } from '../player/player.module';
import { GameSession } from './model/game_session.model';
import { GameSessionPlayer } from './model/game_session_player.model';
import { GameSessionController } from './controller/game_session.controller';
import { GameSessionPlayerController } from './controller/game_session_player.controller';
import { GameSessionService } from './service/game_session.service';
import { GameSessionPlayerService } from './service/game_session_player.service';

@Module({
    imports: [
        SequelizeModule.forFeature([GameSession, GameSessionPlayer]),
        PlayerModule,
    ],
    controllers: [
        GameSessionController,
        GameSessionPlayerController,
    ],
    providers: [
        GameSessionService,
        GameSessionPlayerService,
    ],
})
export class GameSessionModule {}