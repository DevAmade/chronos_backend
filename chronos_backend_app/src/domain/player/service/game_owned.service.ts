import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions } from 'sequelize/types';
import { UUID } from 'node:crypto';

import { GameOwned } from '../model/game_owned.model';
import { GameOwnedDto } from '../dto/game_owned.dto';

@Injectable()
export class GameOwnedService {
    constructor(@InjectModel(GameOwned) private readonly gameOwnedModel: typeof GameOwned) {}

    async findOneByAttribute(playerId: UUID, gameId: UUID): Promise<GameOwned> {
        const options: FindOptions = { 
            where: [{ player_id: playerId }, { game_id: gameId }],
        }

        return await this.gameOwnedModel.findOne(options);
    }

    async addGameOwned(gameOwnedDto: GameOwnedDto): Promise<GameOwned> {
        return await this.gameOwnedModel.create(gameOwnedDto as any);
    }

    async removeGameOwned(playerId: UUID, gameId: UUID): Promise<GameOwned> {
        const gameOwned = await this.findOneByAttribute(playerId, gameId);

        if(!gameOwned) {
            return null;
        }

        await gameOwned.destroy();

        return gameOwned;
    }
}