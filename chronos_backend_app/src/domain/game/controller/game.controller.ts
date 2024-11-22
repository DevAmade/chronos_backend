import { Body, Controller, NotFoundException, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { UUID } from 'node:crypto';

import { SupportController } from '../../../core/toolkit/support.controller';
import { XSSPipe } from '../../../core/pipe/xss.pipe';

import { Game } from '../model/game.model';
import { GameService } from '../service/game.service';
import { CreateGameDto } from '../dto/create_game.dto';
import { UpdateGameDto } from '../dto/update_game_dto';

@Controller('game')
export class GameController 
    extends SupportController<CreateGameDto, UpdateGameDto, Game> { 
        constructor(protected readonly gameService: GameService) {
            super(gameService);
        }

        @Post()
        async create(@Body(XSSPipe) data: CreateGameDto): Promise<Game | Error> {
            const existingDuplicate = await this.gameService.findOneByAttribute([{ name: data.name }, { cover_photo: data.coverPhoto }], 'or');

            if(existingDuplicate) {
                return new NotFoundException(); //TODO Unique exception
            }

            return await this.gameService.create(data);
        }
    
        @Put(':id')
        async update(
            @Param('id', ParseUUIDPipe) id: UUID,
            @Body(XSSPipe) data: UpdateGameDto,
        ): Promise<[affectedCount: number] | Error> {
            const existingGame = await this.gameService.findOneById(id);
            const existingDuplicate = await this.gameService.findOneByAttribute([{ name: data.name }, { cover_photo: data.coverPhoto }], 'or');

            if(!existingGame) {
                return new NotFoundException();
            }

            if(existingDuplicate) {
                return new NotFoundException(); //TODO Unique exception
            }

            return this.gameService.update(id, data);
        }
}