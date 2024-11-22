import { Body, Controller, NotFoundException, Param, ParseUUIDPipe, Post, Put, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UUID } from 'node:crypto';
import * as bcrypt from 'bcrypt';

import { SupportController } from '../../../core/toolkit/support.controller';
import { HashPasswordPipe } from '../../../core/pipe/hash_password.pipe';
import { XSSPipe } from '../../../core/pipe/xss.pipe';

import { PLAYER_JWT_TOKEN_EXPIRATION } from '../../config/module.config';
import { Player } from '../model/player.model';
import { PlayerService } from '../service/player.service';
import { CreatePlayerDto } from '../dto/create_player.dto';
import { UpdatePlayerDto } from '../dto/update_player.dto';
import { AuthPlayerDto } from '../dto/auth_player.dto';

@Controller('player')
export class PlayerController 
    extends SupportController<CreatePlayerDto, UpdatePlayerDto, Player> {

        constructor(
            protected readonly playerService: PlayerService,
            private readonly jwtService: JwtService,
            private readonly configService: ConfigService,
        ) {
            super(playerService);
        }

        @Post('auth')
        async authPlayer(@Body() data: AuthPlayerDto): Promise<{ token: string } | Error> {
            const player = await this.playerService.findOneByAttribute([{ email: data.email }]);
    
            if(!player) {
                return new UnauthorizedException();
            }

            const isMatch = await bcrypt.compare(data.password, player.password);

            if(!isMatch) {
                return new UnauthorizedException();
            }

            const payload = { 
                id: player.id,
                pseudo: player.pseudo,
                name: player.lastName,
                firstName: player.firstName,
                email: player.email,
            };

            return {
                token: await this.jwtService.signAsync(
                    payload, 
                    { expiresIn: PLAYER_JWT_TOKEN_EXPIRATION, secret: this.configService.get('JWT_KEY_PLAYER') },
                )
            }
        }

        @Post()
        async create(@Body(HashPasswordPipe, XSSPipe) data: CreatePlayerDto): Promise<Player | Error> {
            const existingDuplicate = await this.playerService.findOneByAttribute([{ email: data.email }, { pseudo: data.pseudo }], 'or');

            if(existingDuplicate) {
                return new NotFoundException(); //TODO Unique exception
            }

            return await this.playerService.create(data);
        }
    
        @Put(':id')
        async update(
            @Param('id', ParseUUIDPipe) id: UUID,
            @Body(HashPasswordPipe, XSSPipe) data: UpdatePlayerDto,
        ): Promise<[affectedCount: number] | Error> {
            const existingPlayer = await this.playerService.findOneById(id);
            const existingDuplicate = await this.playerService.findOneByAttribute([{ email: data.email }, { pseudo: data.pseudo }], 'or');

            if(!existingPlayer) {
                return new NotFoundException();
            }

            if(existingDuplicate) {
                return new NotFoundException(); //TODO Unique exception
            }

            return this.playerService.update(id, data);
        }
}