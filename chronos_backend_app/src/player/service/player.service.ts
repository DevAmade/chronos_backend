import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { SupportService } from '../../toolkit/support.service';
import { Player } from '../model/player.model';
import { CreatePlayerDto } from '../dto/create_player.dto';
import { UpdatePlayerDto } from '../dto/update_player.dto';

@Injectable()
export class PlayerService 
    extends SupportService<CreatePlayerDto, UpdatePlayerDto, Player> {
        constructor(@InjectModel(Player) protected readonly model: typeof Player) {
            super(model);
        }
}