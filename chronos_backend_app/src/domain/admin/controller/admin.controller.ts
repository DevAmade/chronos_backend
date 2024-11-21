import { Body, Controller, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { UUID } from 'node:crypto';

import { SupportController } from '../../../core/toolkit/support.controller';
import { HashPasswordPipe } from '../../../core/pipe/hash_password.pipe';
import { XSSPipe } from '../../../core/pipe/xss.pipe';

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
        authAdmin(@Body() data: AuthAdminDto): Promise<{ token: string } | Error> {
            return this.service.authenticateAdmin(data);
        }

        @Post()
        create(@Body(HashPasswordPipe, XSSPipe) data: CreateAdminDto): Promise<Admin> {
            return this.service.create(data);
        }
    
        @Put(':id')
        update(
            @Param('id', ParseUUIDPipe) id: UUID,
            @Body(HashPasswordPipe, XSSPipe) data: UpdateAdminDto,
        ): Promise<[affectedCount: number] | Error> {
            return this.service.update(id, data);
        }
}