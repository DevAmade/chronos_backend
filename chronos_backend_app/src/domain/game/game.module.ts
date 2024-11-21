import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Game } from './model/game.model';
import { GameController } from './controller/game.controller';
import { GameService } from './service/game.service';

@Module({
    imports: [
        SequelizeModule.forFeature([Game]),
    ],
    controllers: [
        GameController,
    ],
    providers: [
        GameService,
    ],
})
export class GameModule {}