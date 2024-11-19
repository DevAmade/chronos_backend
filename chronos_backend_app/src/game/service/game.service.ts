import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { SupportService } from '../../toolkit/support.service';
import { Game } from '../model/game.model';

@Injectable()
export class GameService extends SupportService<Game> {
    constructor(@InjectModel(Game) protected readonly model: typeof Game) {
        super(model);
    }
}