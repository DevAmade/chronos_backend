import { Body, Controller, Inject, LoggerService, NotFoundException, Param, ParseUUIDPipe, Post, Put, Req } from '@nestjs/common';
import { Request } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
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
        constructor(
            protected readonly gameSessionService: GameSessionService,
            @Inject(WINSTON_MODULE_NEST_PROVIDER) protected readonly loggerService: LoggerService,
        ) {
            super(gameSessionService, loggerService);
        }

        @Post()
        async create(@Body(XSSPipe) data: CreateGameSessionDto, @Req() req: Request): Promise<GameSession> {
            const createdGameSession = await this.gameSessionService.create(data);

            this.loggerService.log(
                `Game session created: { Client IP: ${req.ip}, Game session id: ${createdGameSession.id} }`,
                'GameSessionController#create',
            );

            return createdGameSession;
        }
    
        @Put(':id')
        async update(
            @Param('id', ParseUUIDPipe) id: UUID,
            @Body(XSSPipe) data: UpdateGameSessionDto,
            @Req() req: Request,
        ): Promise<[affectedCount: number] | Error> {
            const existingGameSession = await this.gameSessionService.findOneById(id);

            if(!existingGameSession) {
                throw new NotFoundException();
            }

            const updatedGameSession = await this.gameSessionService.update(id, data);

            this.loggerService.log(
                `Game session updated: { Client IP: ${req.ip}, Game session id: ${existingGameSession.id} }`,
                'GameSessionController#update',
            );

            return updatedGameSession;
        }
}