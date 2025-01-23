import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { SupportService } from '../../../core/toolkit/support.service';

import { Game } from '../model/game.model';
import { CreateGameDto } from '../dto/create_game.dto';
import { UpdateGameDto } from '../dto/update_game_dto';

@Injectable()
export class GameService 
    extends SupportService<CreateGameDto, UpdateGameDto, Game> {
        constructor(@InjectModel(Game) protected readonly gameModel: typeof Game) {
            super(gameModel);
        }
}