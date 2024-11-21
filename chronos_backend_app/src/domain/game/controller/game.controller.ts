import { Body, Controller, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
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
        constructor(protected readonly service: GameService) {
            super(service);
        }

        @Post()
        create(@Body(XSSPipe) data: CreateGameDto): Promise<Game> {
            return this.service.create(data);
        }
    
        @Put(':id')
        update(
            @Param('id', ParseUUIDPipe) id: UUID,
            @Body(XSSPipe) data: UpdateGameDto,
        ): Promise<[affectedCount: number] | Error> {
            return this.service.update(id, data);
        }
}