import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions } from 'sequelize/types';
import { UUID } from 'node:crypto';

import { FavoritePlayer } from '../model/favorite_player.model';
import { FavoritePlayerDto } from '../dto/favorite_player.dto';

@Injectable()
export class FavoritePlayerService {
    constructor(@InjectModel(FavoritePlayer) private readonly favoritePlayerModel: typeof FavoritePlayer) {}

    async findOneByAttribute(playerId: UUID, favoritePlayerId: UUID): Promise<FavoritePlayer> {
        const options: FindOptions = { 
            where: [{ player_id: playerId }, { favorite_player_id: favoritePlayerId }],
        }

        return await this.favoritePlayerModel.findOne(options);
    }

    async addFavoritePlayer(favoritePlayerDto: FavoritePlayerDto): Promise<FavoritePlayer> {
        return await this.favoritePlayerModel.create(favoritePlayerDto as any);
    }

    async removeFavoritePlayer(playerId: UUID, favoritePlayerId: UUID): Promise<FavoritePlayer> {
        const favoritePlayer = await this.findOneByAttribute(playerId, favoritePlayerId);

        if(!favoritePlayer) {
            return null;
        }

        await favoritePlayer.destroy();

        return favoritePlayer;
    }
}