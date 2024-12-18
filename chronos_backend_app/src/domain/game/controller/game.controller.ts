import { Body, Controller, Delete, Get, Inject, LoggerService, NotFoundException, Param, ParseUUIDPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { UUID } from 'node:crypto';

import { XSSPipe } from '../../../core/toolkit/pipe/xss.pipe';

import { AdminGuard } from '../../toolkit/guard/admin.guard';
import { AuthGuard } from '../../toolkit/guard/auth.guard';
import { Game } from '../model/game.model';
import { GameService } from '../service/game.service';
import { CreateGameDto } from '../dto/create_game.dto';
import { UpdateGameDto } from '../dto/update_game_dto';

@Controller('game')
export class GameController {
    
    constructor(
        private readonly gameService: GameService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly loggerService: LoggerService,
    ) {}

    @Post()
    @UseGuards(AdminGuard)
    async create(@Body(XSSPipe) data: CreateGameDto, @Req() req: Request): Promise<Game | Error> {
        const createdGame = await this.gameService.create(data);

        this.loggerService.log(
            `Game created: { Client IP: ${req.ip}, Game id: ${createdGame.id} }`,
            'GameController#create',
        );

        return createdGame;
    }

    @Put(':id')
    @UseGuards(AdminGuard)
    async update(
        @Param('id', ParseUUIDPipe) id: UUID,
        @Body(XSSPipe) data: UpdateGameDto,
        @Req() req: Request,
    ): Promise<[affectedCount: number] | Error> {
        const existingGame = await this.gameService.findOneById(id);

        if(!existingGame) {
            throw new NotFoundException();
        }

        const updatedGame = await this.gameService.update(id, data);

        this.loggerService.log(
            `Game updated: { Client IP: ${req.ip}, Game id: ${existingGame.id} }`,
            'GameController#update',
        );

        return updatedGame;
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    async findOneById(@Param('id', ParseUUIDPipe) id: UUID): Promise<Game | Error> {
        const findGame = await this.gameService.findOneById(id);

        if(!findGame) {
            throw new NotFoundException();
        }

        return findGame;
    }

    @Get()
    @UseGuards(AuthGuard)
    findAll(): Promise<Game[]> {
        return this.gameService.findAll();
    }

    @Delete(':id')
    @UseGuards(AdminGuard)
    async delete(@Param('id', ParseUUIDPipe) id: UUID, @Req() req: Request): Promise<void | Error> {
        const deleteGame = await this.gameService.delete(id);

        if(deleteGame === null) {
            throw new NotFoundException();
        }

        this.loggerService.log(
            `Game deleted: { Client IP: ${req.ip}, Game id: ${deleteGame.id} }`,
            'GameController#delete',
        );
    }
}