import { Body, Controller, HttpCode, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { UUID } from 'node:crypto';

import { SupportController } from '../../toolkit/support.controller';
import { StatusCode } from '../../toolkit/status_code.enum';
import { GameSession } from '../model/game_session.model';
import { GameSessionService } from '../service/game_session.service';
import { CreateGameSessionDto } from '../dto/create_game_session.dto';
import { UpdateGameSessionDto } from '../dto/update_game_session.dto';

@Controller('game_session')
export class GameSessionController 
    extends SupportController<CreateGameSessionDto, UpdateGameSessionDto, GameSession> { 
        constructor(protected readonly service: GameSessionService) {
            super(service);
        }

        @Post()
        @HttpCode(StatusCode.CREATED)
        create(@Body() data: CreateGameSessionDto): Promise<GameSession> {
            return this.service.create(data);
        }
    
        @Put(':id')
        @HttpCode(StatusCode.SUCCESS)
        update(
            @Param('id', ParseUUIDPipe) id: UUID,
            @Body() data: UpdateGameSessionDto,
        ): Promise<[affectedCount: number]> {
            return this.service.update(id, data);
        }
}