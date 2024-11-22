import { Body, Controller, NotFoundException, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { UUID } from 'node:crypto';

import { SupportController } from '../../../core/toolkit/support.controller';
import { XSSPipe } from '../../../core/pipe/xss.pipe';

import { GameSession } from '../model/game_session.model';
import { GameSessionService } from '../service/game_session.service';
import { CreateGameSessionDto } from '../dto/create_game_session.dto';
import { UpdateGameSessionDto } from '../dto/update_game_session.dto';

@Controller('game_session')
export class GameSessionController 
    extends SupportController<CreateGameSessionDto, UpdateGameSessionDto, GameSession> { 
        constructor(protected readonly gameSessionService: GameSessionService) {
            super(gameSessionService);
        }

        @Post()
        async create(@Body(XSSPipe) data: CreateGameSessionDto): Promise<GameSession> {
            return await this.gameSessionService.create(data);
        }
    
        @Put(':id')
        async update(
            @Param('id', ParseUUIDPipe) id: UUID,
            @Body(XSSPipe) data: UpdateGameSessionDto,
        ): Promise<[affectedCount: number] | Error> {
            const existingGameSession = await this.gameSessionService.findOneById(id);

            if(!existingGameSession) {
                return new NotFoundException();
            }

            return this.gameSessionService.update(id, data);
        }
}