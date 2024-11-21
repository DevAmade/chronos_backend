import { Body, Controller, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { UUID } from 'node:crypto';

import { SupportController } from '../../toolkit/support.controller';
import { Avatar } from '../model/avatar.model';
import { AvatarService } from '../service/avatar.service';
import { CreateAvatarDto } from '../dto/create_avatar.dto';
import { UpdateAvatarDto } from '../dto/update_avatar.dto';

@Controller('avatar')
export class AvatarController 
    extends SupportController<CreateAvatarDto, UpdateAvatarDto, Avatar> { 
        constructor(protected readonly service: AvatarService) {
            super(service);
        }

        @Post()
        create(@Body() data: CreateAvatarDto): Promise<Avatar> {
            return this.service.create(data);
        }
    
        @Put(':id')
        update(
            @Param('id', ParseUUIDPipe) id: UUID,
            @Body() data: UpdateAvatarDto,
        ): Promise<[affectedCount: number] | Error> {
            return this.service.update(id, data);
        }
}