import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';

import { PlayerGuard } from '../guard/player.guard';
import { AdminGuard } from '../guard/admin.guard';
import { GameSession } from './model/game_session.model';
import { GameSessionPlayer } from './model/game_session_player.model';
import { GameSessionController } from './controller/game_session.controller';
import { GameSessionPlayerController } from './controller/game_session_player.controller';
import { GameSessionService } from './service/game_session.service';
import { GameSessionPlayerService } from './service/game_session_player.service';

@Module({
    imports: [
        SequelizeModule.forFeature([GameSession, GameSessionPlayer]),
        JwtModule,
    ],
    controllers: [
        GameSessionController,
        GameSessionPlayerController,
    ],
    providers: [
        GameSessionService,
        GameSessionPlayerService,
        PlayerGuard,
        AdminGuard,
    ],
})
export class GameSessionModule {}