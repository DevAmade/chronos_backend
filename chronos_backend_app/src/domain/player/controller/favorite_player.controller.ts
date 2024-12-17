import { Body, Controller, Delete, NotFoundException, Post, UseGuards } from '@nestjs/common';

import { XSSPipe } from '../../../core/toolkit/pipe/xss.pipe';

import { AuthGuard } from '../../guard/auth.guard';
import { FavoritePlayer } from '../model/favorite_player.model';
import { FavoritePlayerService } from '../service/favorite_player.service';
import { FavoritePlayerDto } from '../dto/favorite_player.dto';

@Controller('favorite_player')
@UseGuards(AuthGuard)
export class FavoritePlayerController  {

    constructor(private readonly favoritePlayerService: FavoritePlayerService) {}

    @Post()
    async addFavoritePlayer(@Body(XSSPipe) data: FavoritePlayerDto): Promise<FavoritePlayer | Error> {
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