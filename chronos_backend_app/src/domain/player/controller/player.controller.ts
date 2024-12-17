import { Body, Controller, Inject, LoggerService, NotFoundException, Param, ParseUUIDPipe, Post, Put, Req, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { UUID } from 'node:crypto';
import * as bcrypt from 'bcrypt';

import { SupportController } from '../../../core/toolkit/support.controller';
import { HashPasswordPipe } from '../../../core/toolkit/pipe/hash_password.pipe';
import { XSSPipe } from '../../../core/toolkit/pipe/xss.pipe';

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
            @Inject(WINSTON_MODULE_NEST_PROVIDER) protected readonly loggerService: LoggerService,
        ) {
            super(playerService, loggerService);
        }

        @Post('auth')
        async auth(@Body() data: AuthPlayerDto, @Req() req: Request): Promise<{ token: string } | Error> {
            const player = await this.playerService.findOneByAttribute([{ email: data.email }]);
    
            if(!player) {
                this.loggerService.warn(
                    `Failed connection: { Client IP: ${req.ip}, Used identifier: ${data.email} }`,
                    'PlayerController#auth',
                );

                throw new UnauthorizedException();
            }

            const isMatch = await bcrypt.compare(data.password, player.password);

            if(!isMatch) {
                this.loggerService.warn(
                    `Failed connection: { Client IP: ${req.ip}, Player id: ${player.id} }`,
                    'PlayerController#auth',
                );

                throw new UnauthorizedException();
            }

            this.loggerService.log(
                `Successful connection: { Client IP: ${req.ip}, Player id: ${player.id} }`,
                'PlayerController#auth',
            );

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
        async create(@Body(HashPasswordPipe, XSSPipe) data: CreatePlayerDto, @Req() req: Request): Promise<Player | Error> {
            const createdPlayer = await this.playerService.create(data);

            this.loggerService.log(
                `Player created: { Client IP: ${req.ip}, Player id: ${createdPlayer.id} }`,
                'PlayerController#create',
            );

            return createdPlayer;
        }
    
        @Put(':id')
        async update(
            @Param('id', ParseUUIDPipe) id: UUID,
            @Body(HashPasswordPipe, XSSPipe) data: UpdatePlayerDto,
            @Req() req: Request,
        ): Promise<[affectedCount: number] | Error> {
            const existingPlayer = await this.playerService.findOneById(id);

            if(!existingPlayer) {
                throw new NotFoundException();
            }

            const updatedPlayer = await this.playerService.update(id, data);

            this.loggerService.log(
                `Player updated: { Client IP: ${req.ip}, Player id: ${existingPlayer.id} }`,
                'PlayerController#update',
            );

            return updatedPlayer;
        }
}