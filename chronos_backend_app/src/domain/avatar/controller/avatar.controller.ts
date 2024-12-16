import { Body, Controller, Inject, LoggerService, NotFoundException, Param, ParseUUIDPipe, Post, Put, Req } from '@nestjs/common';
import { Request } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { UUID } from 'node:crypto';

import { SupportController } from '../../../core/toolkit/support.controller';
import { XSSPipe } from '../../../core/pipe/xss.pipe';
import { UniqueException } from '../../../core/exception/unique_exception';

import { Avatar } from '../model/avatar.model';
import { AvatarService } from '../service/avatar.service';
import { CreateAvatarDto } from '../dto/create_avatar.dto';
import { UpdateAvatarDto } from '../dto/update_avatar.dto';

@Controller('avatar')
export class AvatarController 
    extends SupportController<CreateAvatarDto, UpdateAvatarDto, Avatar> { 
        constructor(
            protected readonly avatarService: AvatarService,
            @Inject(WINSTON_MODULE_NEST_PROVIDER) protected readonly loggerService: LoggerService,
        ) {
            super(avatarService, loggerService);
        }

        @Post()
        async create(@Body(XSSPipe) data: CreateAvatarDto, @Req() req: Request): Promise<Avatar | Error> {
            const existingDuplicate = await this.avatarService.findOneByAttribute([{ name: data.name }]);

            if(existingDuplicate) {
                throw new UniqueException();
            }

            const createdAvatar = await this.avatarService.create(data);

            this.loggerService.log(
                `Avatar created: { Client IP: ${req.ip}, Avatar id: ${createdAvatar.id} }`,
                'AvatarController#create',
            );

            return createdAvatar;
        }
    
        @Put(':id')
        async update(
            @Param('id', ParseUUIDPipe) id: UUID,
            @Body(XSSPipe) data: UpdateAvatarDto,
            @Req() req: Request,
        ): Promise<[affectedCount: number] | Error> {
            const existingAvatar = await this.avatarService.findOneById(id);
            const existingDuplicate = await this.avatarService.findOneByAttribute([{ name: data.name }]);

            if(!existingAvatar) {
                throw new NotFoundException();
            }

            if(existingAvatar.name !== data.name && existingDuplicate) {
                throw new UniqueException();
            }

            const updatedAvatar = await this.avatarService.update(id, data);

            this.loggerService.log(
                `Avatar updated: { Client IP: ${req.ip}, Avatar id: ${existingAvatar.id} }`,
                'AvatarController#update',
            );

            return updatedAvatar;
        }
}