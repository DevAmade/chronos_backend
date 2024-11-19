import { Controller } from '@nestjs/common';

import { SupportController } from '../../toolkit/support.controller';
import { Game } from '../model/game.model';
import { GameService } from '../service/game.service';

@Controller('game')
export class GameController extends SupportController<Game> { 
    constructor(protected readonly service: GameService) {
        super(service);
    }
}