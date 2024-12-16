import { BadRequestException, Body, Controller, Delete, NotFoundException, Post } from '@nestjs/common';

import { XSSPipe } from '../../../core/pipe/xss.pipe';
import { UniqueException } from '../../../core/exception/unique_exception';

import { PlayerService } from '../../player/service/player.service';
import { GameSessionPlayer } from '../model/game_session_player.model';
import { GameSessionService } from '../service/game_session.service';
import { GameSessionPlayerService } from '../service/game_session_player.service';
import { GameSessionPlayerDto } from '../dto/game_session_player.dto';

@Controller('game_session_player')
export class GameSessionPlayerController  {

    constructor(
        private readonly gameSessionPlayerService: GameSessionPlayerService,
        private readonly playerService: PlayerService,
        private readonly gameSessionService: GameSessionService,
    ) {}

    @Post()
    async addGameSessionPlayer(@Body(XSSPipe) data: GameSessionPlayerDto): Promise<GameSessionPlayer | Error> {
        const isPlayer = await this.playerService.findOneById(data.playerId);
        const isGameSession = await this.gameSessionService.findOneById(data.gameSessionId);

        if(!isPlayer || !isGameSession) {
            throw new BadRequestException();
        }

        const existingDuplicate = await this.gameSessionPlayerService.findOneByAttribute(data.playerId, data.gameSessionId);

        if(existingDuplicate) {
            throw new UniqueException();
        }

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