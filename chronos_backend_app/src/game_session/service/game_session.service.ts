import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { SupportService } from '../../toolkit/support.service';
import { GameSession } from '../model/game_session.model';

@Injectable()
export class GameSessionService extends SupportService<GameSession> {
    constructor(@InjectModel(GameSession) protected readonly model: typeof GameSession) {
        super(model);
    }
}