import { Controller } from '@nestjs/common';

import { SupportController } from '../../toolkit/support.controller';
import { Player } from '../model/player.model';
import { PlayerService } from '../service/player.service';

@Controller('player')
export class PlayerController extends SupportController<Player> {
    constructor(protected readonly service: PlayerService) {
        super(service);
    }
}