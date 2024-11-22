import { Body, Controller, NotFoundException, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { UUID } from 'node:crypto';

import { SupportController } from '../../../core/toolkit/support.controller';
import { XSSPipe } from '../../../core/pipe/xss.pipe';

import { Avatar } from '../model/avatar.model';
import { AvatarService } from '../service/avatar.service';
import { CreateAvatarDto } from '../dto/create_avatar.dto';
import { UpdateAvatarDto } from '../dto/update_avatar.dto';

@Controller('avatar')
export class AvatarController 
    extends SupportController<CreateAvatarDto, UpdateAvatarDto, Avatar> { 
        constructor(protected readonly avatarService: AvatarService) {
            super(avatarService);
        }

        @Post()
        async create(@Body(XSSPipe) data: CreateAvatarDto): Promise<Avatar | Error> {
            const existingDuplicate = await this.avatarService.findOneByAttribute([{ name: data.name }, { photo: data.photo }], 'or');

            if(existingDuplicate) {
                return new NotFoundException(); //TODO Unique exception
            }

            return await this.avatarService.create(data);
        }
    
        @Put(':id')
        async update(
            @Param('id', ParseUUIDPipe) id: UUID,
            @Body(XSSPipe) data: UpdateAvatarDto,
        ): Promise<[affectedCount: number] | Error> {
            const existingAvatar = await this.avatarService.findOneById(id);
            const existingDuplicate = await this.avatarService.findOneByAttribute([{ name: data.name }, { photo: data.photo }], 'or');

            if(!existingAvatar) {
                return new NotFoundException();
            }

            if(existingDuplicate) {
                return new NotFoundException(); //TODO Unique exception
            }

            return this.avatarService.update(id, data);
        }
}