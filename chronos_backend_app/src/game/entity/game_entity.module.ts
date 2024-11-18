import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Game } from './game.entity';

@Module({
    imports: [SequelizeModule.forFeature([Game])],
    exports: [SequelizeModule],
})
export class GameEntityModule {}