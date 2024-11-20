import { Body, Controller, HttpCode, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { UUID } from 'node:crypto';

import { SupportController } from '../../toolkit/support.controller';
import { StatusCode } from '../../toolkit/status_code.enum';
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
        @HttpCode(StatusCode.CREATED)
        create(@Body() data: CreateAvatarDto): Promise<Avatar> {
            return this.service.create(data);
        }
    
        @Put(':id')
        @HttpCode(StatusCode.SUCCESS)
        update(
            @Param('id', ParseUUIDPipe) id: UUID,
            @Body() data: UpdateAvatarDto,
        ): Promise<[affectedCount: number]> {
            return this.service.update(id, data);
        }
}