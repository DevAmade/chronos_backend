import { Body, Controller, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { UUID } from 'node:crypto';

import { SupportController } from '../../../core/toolkit/support.controller';
import { HashPasswordPipe } from '../../../core/pipe/hash_password.pipe';
import { XSSPipe } from '../../../core/pipe/xss.pipe';

import { Player } from '../model/player.model';
import { PlayerService } from '../service/player.service';
import { CreatePlayerDto } from '../dto/create_player.dto';
import { UpdatePlayerDto } from '../dto/update_player.dto';
import { AuthPlayerDto } from '../dto/auth_player.dto';

@Controller('player')
export class PlayerController 
    extends SupportController<CreatePlayerDto, UpdatePlayerDto, Player> {
        constructor(protected readonly service: PlayerService) {
            super(service);
        }

        @Post('auth')
        authPlayer(@Body() data: AuthPlayerDto): Promise<{ token: string } | Error> {
            return this.service.authenticatePlayer(data);
        }

        @Post()
        create(@Body(HashPasswordPipe, XSSPipe) data: CreatePlayerDto): Promise<Player> {
            return this.service.create(data);
        }
    
        @Put(':id')
        update(
            @Param('id', ParseUUIDPipe) id: UUID,
            @Body(HashPasswordPipe, XSSPipe) data: UpdatePlayerDto,
        ): Promise<[affectedCount: number] | Error> {
            return this.service.update(id, data);
        }
}