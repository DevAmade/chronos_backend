import { Body, Controller, Delete, NotFoundException, Post } from '@nestjs/common';

import { XSSPipe } from '../../../core/toolkit/pipe/xss.pipe';

import { GameSessionPlayer } from '../model/game_session_player.model';
import { GameSessionPlayerService } from '../service/game_session_player.service';
import { GameSessionPlayerDto } from '../dto/game_session_player.dto';

@Controller('game_session_player')
export class GameSessionPlayerController  {

    constructor(private readonly gameSessionPlayerService: GameSessionPlayerService) {}

    @Post()
    async addGameSessionPlayer(@Body(XSSPipe) data: GameSessionPlayerDto): Promise<GameSessionPlayer | Error> {
        const createdGameSessionPlayer = await this.gameSessionPlayerService.addGameSessionPlayer(data);

        return createdGameSessionPlayer;
    }

    @Delete()
    async removeGameSessionPlayer(@Body() data: GameSessionPlayerDto): Promise<void | Error> {
        const deleteGameSessionPlayer = await this.gameSessionPlayerService.removeGameSessionPlayer(data.playerId, data.gameSessionId);

        if(deleteGameSessionPlayer === null) {
            throw new NotFoundException();
        }
    }
}