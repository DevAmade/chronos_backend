import { Body, Controller, Delete, Get, Inject, LoggerService, NotFoundException, Param, ParseUUIDPipe, Post, Put, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { UUID } from 'node:crypto';
import * as bcrypt from 'bcrypt';

import { HashPasswordPipe } from '../../../core/toolkit/pipe/hash_password.pipe';
import { XSSPipe } from '../../../core/toolkit/pipe/xss.pipe';

import { AdminGuard } from '../../toolkit/guard/admin.guard';
import { AuthGuard } from '../../toolkit/guard/auth.guard';
import { ProfileGuard } from '../../toolkit/guard/profile.guard';
import { PLAYER_JWT_TOKEN_EXPIRATION } from '../../config/module.config';
import { Player } from '../model/player.model';
import { PlayerService } from '../service/player.service';
import { CreatePlayerDto } from '../dto/create_player.dto';
import { UpdatePlayerDto } from '../dto/update_player.dto';
import { AuthPlayerDto } from '../dto/auth_player.dto';

@Controller('player')
export class PlayerController {

    constructor(
        private readonly playerService: PlayerService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly loggerService: LoggerService,
    ) {}

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
            admin: false,
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
    @UseGuards(AuthGuard, ProfileGuard)
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

    @Get(':id')
    @UseGuards(AuthGuard)
    async findOneById(@Param('id', ParseUUIDPipe) id: UUID): Promise<Player | Error> {
        const findPlayer = await this.playerService.findOneById(id);

        if(!findPlayer) {
            throw new NotFoundException();
        }

        return findPlayer;
    }

    @Get()
    @UseGuards(AdminGuard)
    findAll(): Promise<Player[]> {
        return this.playerService.findAll();
    }

    @Delete(':id')
    @UseGuards(AuthGuard, ProfileGuard)
    async delete(@Param('id', ParseUUIDPipe) id: UUID, @Req() req: Request): Promise<void | Error> {
        const deletePlayer = await this.playerService.delete(id);

        if(deletePlayer === null) {
            throw new NotFoundException();
        }

        this.loggerService.log(
            `Player deleted: { Client IP: ${req.ip}, Player id: ${deletePlayer.id} }`,
            'PlayerController#delete',
        );
    }
}