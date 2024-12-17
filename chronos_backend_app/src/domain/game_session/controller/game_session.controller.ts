import { Body, Controller, Delete, Get, Inject, LoggerService, NotFoundException, Param, ParseUUIDPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { UUID } from 'node:crypto';

import { XSSPipe } from '../../../core/toolkit/pipe/xss.pipe';

import { AdminGuard } from '../../guard/admin.guard';
import { AuthGuard } from '../../guard/auth.guard';
import { CreatorSessionGuard } from '../../guard/creator_session.guard';
import { GameSession } from '../model/game_session.model';
import { GameSessionService } from '../service/game_session.service';
import { CreateGameSessionDto } from '../dto/create_game_session.dto';
import { UpdateGameSessionDto } from '../dto/update_game_session.dto';

@Controller('game_session')
export class GameSessionController {
    
    constructor(
        private readonly gameSessionService: GameSessionService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly loggerService: LoggerService,
    ) {}

    @Post()
    @UseGuards(AuthGuard)
    async create(@Body(XSSPipe) data: CreateGameSessionDto, @Req() req: Request): Promise<GameSession> {
        const createdGameSession = await this.gameSessionService.create(data);

        this.loggerService.log(
            `Game session created: { Client IP: ${req.ip}, Game session id: ${createdGameSession.id} }`,
            'GameSessionController#create',
        );

        return createdGameSession;
    }

    @Put(':id')
    @UseGuards(AuthGuard, CreatorSessionGuard)
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

    @Get(':id')
    @UseGuards(AuthGuard)
    async findOneById(@Param('id', ParseUUIDPipe) id: UUID): Promise<GameSession | Error> {
        const findGameSession = await this.gameSessionService.findOneById(id);

        if(!findGameSession) {
            throw new NotFoundException();
        }

        return findGameSession;
    }

    @Get()
    @UseGuards(AdminGuard)
    findAll(): Promise<GameSession[]> {
        return this.gameSessionService.findAll();
    }

    @Delete(':id')
    @UseGuards(AuthGuard, CreatorSessionGuard)
    async delete(@Param('id', ParseUUIDPipe) id: UUID, @Req() req: Request): Promise<void | Error> {
        const deleteGameSession = await this.gameSessionService.delete(id);

        if(deleteGameSession === null) {
            throw new NotFoundException();
        }

        this.loggerService.log(
            `Game session deleted: { Client IP: ${req.ip}, Game session id: ${deleteGameSession.id} }`,
            'GameSessionController#delete',
        );
    }
}