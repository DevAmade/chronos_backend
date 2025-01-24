import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions } from 'sequelize/types';
import { UUID } from 'node:crypto';

import { GameSessionPlayer } from '../model/game_session_player.model';
import { GameSessionPlayerDto } from '../dto/game_session_player.dto';

@Injectable()
export class GameSessionPlayerService {
    constructor(@InjectModel(GameSessionPlayer) private readonly gameSessionPlayerModel: typeof GameSessionPlayer) {}

    async findOneByAttribute(playerId: UUID, gameSessionId: UUID): Promise<GameSessionPlayer> {
        const options: FindOptions = { 
            where: [{ game_session_id: gameSessionId }, { player_id: playerId }],
        }

        return await this.gameSessionPlayerModel.findOne(options);
    }

    async addGameSessionPlayer(gameSessionPlayerDto: GameSessionPlayerDto): Promise<GameSessionPlayer> {
        return await this.gameSessionPlayerModel.create(gameSessionPlayerDto as any);
    }

    async removeGameSessionPlayer(playerId: UUID, gameSessionId: UUID): Promise<GameSessionPlayer> {
        const gameSessionPlayer = await this.findOneByAttribute(playerId, gameSessionId);

        if(!gameSessionPlayer) {
            return null;
        }

        await gameSessionPlayer.destroy();

        return gameSessionPlayer;
    }
}