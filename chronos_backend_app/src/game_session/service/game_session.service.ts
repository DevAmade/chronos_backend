import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { SupportService } from '../../toolkit/support.service';
import { GameSession } from '../model/game_session.model';
import { CreateGameSessionDto } from '../dto/create_game_session.dto';
import { UpdateGameSessionDto } from '../dto/update_game_session.dto';

@Injectable()
export class GameSessionService 
    extends SupportService<CreateGameSessionDto, UpdateGameSessionDto, GameSession> {
        constructor(@InjectModel(GameSession) protected readonly model: typeof GameSession) {
            super(model);
        }
}