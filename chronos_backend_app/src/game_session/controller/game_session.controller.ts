import { Controller } from '@nestjs/common';

import { SupportController } from '../../toolkit/support.controller';
import { GameSession } from '../model/game_session.model';
import { GameSessionService } from '../service/game_session.service';

@Controller('game_session')
export class GameSessionController extends SupportController<GameSession> { 
    constructor(protected readonly service: GameSessionService) {
        super(service);
    }
}