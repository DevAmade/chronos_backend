import { Body, Controller, Delete, Get, Inject, LoggerService, NotFoundException, Param, ParseUUIDPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { UUID } from 'node:crypto';

import { XSSPipe } from '../../../core/toolkit/pipe/xss.pipe';

import { AdminGuard } from '../../toolkit/guard/admin.guard';
import { AuthGuard } from '../../toolkit/guard/auth.guard';
import { Avatar } from '../model/avatar.model';
import { AvatarService } from '../service/avatar.service';
import { CreateAvatarDto } from '../dto/create_avatar.dto';
import { UpdateAvatarDto } from '../dto/update_avatar.dto';

@Controller('avatar')
export class AvatarController {
    
    constructor(
        private readonly avatarService: AvatarService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly loggerService: LoggerService,
    ) {}

    @Post()
    @UseGuards(AdminGuard)
    async create(@Body(XSSPipe) data: CreateAvatarDto, @Req() req: Request): Promise<Avatar | Error> {
        const createdAvatar = await this.avatarService.create(data);

        this.loggerService.log(
            `Avatar created: { Client IP: ${req.ip}, Avatar id: ${createdAvatar.id} }`,
            'AvatarController#create',
        );

        return createdAvatar;
    }

    @Put(':id')
    @UseGuards(AdminGuard)
    async update(
        @Param('id', ParseUUIDPipe) id: UUID,
        @Body(XSSPipe) data: UpdateAvatarDto,
        @Req() req: Request,
    ): Promise<[affectedCount: number] | Error> {
        const existingAvatar = await this.avatarService.findOneById(id);

        if(!existingAvatar) {
            throw new NotFoundException();
        }

        const updatedAvatar = await this.avatarService.update(id, data);

        this.loggerService.log(
            `Avatar updated: { Client IP: ${req.ip}, Avatar id: ${existingAvatar.id} }`,
            'AvatarController#update',
        );

        return updatedAvatar;
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    async findOneById(@Param('id', ParseUUIDPipe) id: UUID): Promise<Avatar | Error> {
        const findAvatar = await this.avatarService.findOneById(id);

        if(!findAvatar) {
            throw new NotFoundException();
        }

        return findAvatar;
    }

    @Get()
    @UseGuards(AuthGuard)
    findAll(): Promise<Avatar[]> {
        return this.avatarService.findAll();
    }

    @Delete(':id')
    @UseGuards(AdminGuard)
    async delete(@Param('id', ParseUUIDPipe) id: UUID, @Req() req: Request): Promise<void | Error> {
        const deleteAvatar = await this.avatarService.delete(id);

        if(deleteAvatar === null) {
            throw new NotFoundException();
        }

        this.loggerService.log(
            `Avatar deleted: { Client IP: ${req.ip}, Avatar id: ${deleteAvatar.id} }`,
            'AvatarController#delete',
        );
    }
}