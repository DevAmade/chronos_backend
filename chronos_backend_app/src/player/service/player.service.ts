import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { SupportService } from '../../toolkit/support.service';
import { Player } from '../model/player.model';

@Injectable()
export class PlayerService extends SupportService<Player> {
    constructor(@InjectModel(Player) protected readonly model: typeof Player) {
        super(model);
    }
}