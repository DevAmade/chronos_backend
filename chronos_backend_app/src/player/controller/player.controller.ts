import { Body, Controller, HttpCode, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { UUID } from 'node:crypto';

import { SupportController } from '../../toolkit/support.controller';
import { StatusCode } from '../../toolkit/status_code.enum';
import { Player } from '../model/player.model';
import { PlayerService } from '../service/player.service';
import { CreatePlayerDto } from '../dto/create_player.dto';
import { UpdatePlayerDto } from '../dto/update_player.dto';

@Controller('player')
export class PlayerController 
    extends SupportController<CreatePlayerDto, UpdatePlayerDto, Player> {
        constructor(protected readonly service: PlayerService) {
            super(service);
        }

        @Post()
        @HttpCode(StatusCode.CREATED)
        create(@Body() data: CreatePlayerDto): Promise<Player> {
            return this.service.create(data);
        }
    
        @Put(':id')
        @HttpCode(StatusCode.SUCCESS)
        update(
            @Param('id', ParseUUIDPipe) id: UUID,
            @Body() data: UpdatePlayerDto,
        ): Promise<[affectedCount: number]> {
            return this.service.update(id, data);
        }
}