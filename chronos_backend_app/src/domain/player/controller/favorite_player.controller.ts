import { BadRequestException, Body, Controller, Delete, NotFoundException, Post } from '@nestjs/common';

import { XSSPipe } from '../../../core/pipe/xss.pipe';
import { UniqueException } from '../../../core/exception/unique_exception';

import { FavoritePlayer } from '../model/favorite_player.model';
import { PlayerService } from '../service/player.service';
import { FavoritePlayerService } from '../service/favorite_player.service';
import { FavoritePlayerDto } from '../dto/favorite_player.dto';

@Controller('favorite_player')
export class FavoritePlayerController  {

    constructor(
        private readonly favoritePlayerService: FavoritePlayerService,
        private readonly playerService: PlayerService,
    ) {}

    @Post()
    async addFavoritePlayer(@Body(XSSPipe) data: FavoritePlayerDto): Promise<FavoritePlayer | Error> {
        const isSameId = data.playerId === data.favoritePlayerId;
        const isPlayer1 = await this.playerService.findOneById(data.playerId);
        const isPlayer2 = await this.playerService.findOneById(data.favoritePlayerId);

        if(isSameId || !isPlayer1 || !isPlayer2) {
            throw new BadRequestException();
        }

        const existingDuplicate = await this.favoritePlayerService.findOneByAttribute(data.playerId, data.favoritePlayerId);

        if(existingDuplicate) {
            throw new UniqueException();
        }

        const createdFavoritePlayer = await this.favoritePlayerService.addFavoritePlayer(data);

        return createdFavoritePlayer;
    }

    @Delete()
    async removeFavoritePlayer(@Body() data: FavoritePlayerDto): Promise<void | Error> {
        const deleteFavoritePlayer = await this.favoritePlayerService.removeFavoritePlayer(data.playerId, data.favoritePlayerId);

        if(deleteFavoritePlayer === null) {
            throw new NotFoundException();
        }
    }
}