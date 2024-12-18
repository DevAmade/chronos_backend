import { BadRequestException, Body, Controller, Delete, NotFoundException, UseGuards } from '@nestjs/common';

import { AuthGuard } from '../../toolkit/guard/auth.guard';
import { PlayerSessionGuard } from '../../toolkit/guard/player_session.guard';
import { GameSessionPlayerService } from '../service/game_session_player.service';
import { GameSessionPlayerDto } from '../dto/game_session_player.dto';

@Controller('game_session_player')
@UseGuards(AuthGuard, PlayerSessionGuard)
export class GameSessionPlayerController  {

    constructor(private readonly gameSessionPlayerService: GameSessionPlayerService) {}

    @Delete()
    async removeGameSessionPlayer(@Body() data: GameSessionPlayerDto): Promise<void | Error> {
        if(!data.gameSessionId) {
            throw new BadRequestException();
        }

        const deleteGameSessionPlayer = await this.gameSessionPlayerService.removeGameSessionPlayer(data.playerId, data.gameSessionId);

        if(deleteGameSessionPlayer === null) {
            throw new NotFoundException();
        }
    }
}