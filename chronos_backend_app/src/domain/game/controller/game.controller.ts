import { Body, Controller, Inject, LoggerService, NotFoundException, Param, ParseUUIDPipe, Post, Put, Req } from '@nestjs/common';
import { Request } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { UUID } from 'node:crypto';

import { SupportController } from '../../../core/toolkit/support.controller';
import { XSSPipe } from '../../../core/toolkit/pipe/xss.pipe';

import { Game } from '../model/game.model';
import { GameService } from '../service/game.service';
import { CreateGameDto } from '../dto/create_game.dto';
import { UpdateGameDto } from '../dto/update_game_dto';

@Controller('game')
export class GameController 
    extends SupportController<CreateGameDto, UpdateGameDto, Game> { 
        constructor(
            protected readonly gameService: GameService,
            @Inject(WINSTON_MODULE_NEST_PROVIDER) protected readonly loggerService: LoggerService,
        ) {
            super(gameService, loggerService);
        }

        @Post()
        async create(@Body(XSSPipe) data: CreateGameDto, @Req() req: Request): Promise<Game | Error> {
            const createdGame = await this.gameService.create(data);

            this.loggerService.log(
                `Game created: { Client IP: ${req.ip}, Game id: ${createdGame.id} }`,
                'GameController#create',
            );

            return createdGame;
        }
    
        @Put(':id')
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
}