import { Body, Controller, HttpCode, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { UUID } from 'node:crypto';

import { SupportController } from '../../toolkit/support.controller';
import { StatusCode } from '../../toolkit/status_code.enum';
import { Admin } from '../model/admin.model';
import { AdminService } from '../service/admin.service';
import { CreateAdminDto } from '../dto/create_admin.dto';
import { UpdateAdminDto } from '../dto/update_admin.dto';

@Controller('admin')
export class AdminController 
    extends SupportController<CreateAdminDto, UpdateAdminDto, Admin> { 
        constructor(protected readonly service: AdminService) {
            super(service);
        }

        @Post()
        @HttpCode(StatusCode.CREATED)
        create(@Body() data: CreateAdminDto): Promise<Admin> {
            return this.service.create(data);
        }
    
        @Put(':id')
        @HttpCode(StatusCode.SUCCESS)
        update(
            @Param('id', ParseUUIDPipe) id: UUID,
            @Body() data: UpdateAdminDto,
        ): Promise<[affectedCount: number]> {
            return this.service.update(id, data);
        }
}