import { Body, Controller, HttpCode, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { UUID } from 'node:crypto';

import { SupportController } from '../../toolkit/support.controller';
import { StatusCode } from '../../toolkit/status_code.enum';
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
        @HttpCode(StatusCode.CREATED)
        create(@Body() data: CreateGameDto): Promise<Game> {
            return this.service.create(data);
        }
    
        @Put(':id')
        @HttpCode(StatusCode.SUCCESS)
        update(
            @Param('id', ParseUUIDPipe) id: UUID,
            @Body() data: UpdateGameDto,
        ): Promise<[affectedCount: number]> {
            return this.service.update(id, data);
        }
}