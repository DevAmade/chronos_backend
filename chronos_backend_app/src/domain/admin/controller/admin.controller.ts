import { Body, Controller, Param, ParseUUIDPipe, Post, Put, UsePipes } from '@nestjs/common';
import { UUID } from 'node:crypto';

import { SupportController } from '../../../core/toolkit/support.controller';
import { HashPasswordPipe } from '../../../core/pipe/hash_password.pipe';

import { Admin } from '../model/admin.model';
import { AdminService } from '../service/admin.service';
import { CreateAdminDto } from '../dto/create_admin.dto';
import { UpdateAdminDto } from '../dto/update_admin.dto';
import { AuthAdminDto } from '../dto/auth_admin.dto';

@Controller('admin')
export class AdminController 
    extends SupportController<CreateAdminDto, UpdateAdminDto, Admin> { 
        constructor(protected readonly service: AdminService) {
            super(service);
        }

        @Post('auth')
        authAdmin(@Body() data: AuthAdminDto): Promise<any> {
            return this.service.authenticateAdmin(data);
        }

        @Post()
        @UsePipes(HashPasswordPipe)
        create(@Body() data: CreateAdminDto): Promise<Admin> {
            return this.service.create(data);
        }
    
        @Put(':id')
        update(
            @Param('id', ParseUUIDPipe) id: UUID,
            @Body() data: UpdateAdminDto,
        ): Promise<[affectedCount: number] | Error> {
            return this.service.update(id, data);
        }
}