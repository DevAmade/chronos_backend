import { Body, Controller, Delete, NotFoundException, Post, UseGuards } from '@nestjs/common';

import { XSSPipe } from '../../../core/toolkit/pipe/xss.pipe';

import { AuthGuard } from '../../toolkit/guard/auth.guard';
import { ProfileGuard } from '../../toolkit/guard/profile.guard';
import { GameOwned } from '../model/game_owned.model';
import { GameOwnedService } from '../service/game_owned.service';
import { GameOwnedDto } from '../dto/game_owned.dto';

@Controller('game_owned')
@UseGuards(AuthGuard, ProfileGuard)
export class GameOwnedController  {

    constructor(private readonly gameOwnedService: GameOwnedService) {}

    @Post()
    async addGameOwned(@Body(XSSPipe) data: GameOwnedDto): Promise<GameOwned | Error> {
        const createdGameOwned = await this.gameOwnedService.addGameOwned(data);

        return createdGameOwned;
    }

    @Delete()
    async removeGameOwned(@Body() data: GameOwnedDto): Promise<void | Error> {
        const deleteGameOwned = await this.gameOwnedService.removeGameOwned(data.playerId, data.gameId);

        if(deleteGameOwned === null) {
            throw new NotFoundException();
        }
    }
}