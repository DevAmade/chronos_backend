import { Body, Controller, NotFoundException, Param, ParseUUIDPipe, Post, Put, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UUID } from 'node:crypto';
import * as bcrypt from 'bcrypt';

import { SupportController } from '../../../core/toolkit/support.controller';
import { HashPasswordPipe } from '../../../core/pipe/hash_password.pipe';
import { XSSPipe } from '../../../core/pipe/xss.pipe';

import { ADMIN_JWT_TOKEN_EXPIRATION } from 'src/domain/config/module.config';
import { Admin } from '../model/admin.model';
import { AdminService } from '../service/admin.service';
import { CreateAdminDto } from '../dto/create_admin.dto';
import { UpdateAdminDto } from '../dto/update_admin.dto';
import { AuthAdminDto } from '../dto/auth_admin.dto';

@Controller('admin')
export class AdminController 
    extends SupportController<CreateAdminDto, UpdateAdminDto, Admin> {
        
        constructor(
            protected readonly adminService: AdminService,
            private readonly jwtService: JwtService,
            private readonly configService: ConfigService,
        ) {
            super(adminService);
        }

        @Post('auth')
        async authAdmin(data: AuthAdminDto): Promise<{ token: string } | Error> {
            const admin = await this.adminService.findOneByAttribute([{ email: data.pseudo }]);

            if(!admin) {
                return new UnauthorizedException();
            }

            const isMatch = await bcrypt.compare(data.password, admin.password);

            if(!isMatch) {
                return new UnauthorizedException();
            }

            const payload = {
                id: admin.id,
                pseudo: admin.pseudo,
            };

            return {
                token: await this.jwtService.signAsync(
                    payload, 
                    { expiresIn: ADMIN_JWT_TOKEN_EXPIRATION, secret: this.configService.get('JWT_KEY_ADMIN') },
                )
            }
        }

        @Post()
        async create(@Body(HashPasswordPipe, XSSPipe) data: CreateAdminDto): Promise<Admin | Error> {
            const existingDuplicate = await this.adminService.findOneByAttribute([{ pseudo: data.pseudo }]);

            if(existingDuplicate) {
                return new NotFoundException(); //TODO Unique exception
            }

            return await this.adminService.create(data);
        }
    
        @Put(':id')
        async update(
            @Param('id', ParseUUIDPipe) id: UUID,
            @Body(HashPasswordPipe, XSSPipe) data: UpdateAdminDto,
        ): Promise<[affectedCount: number] | Error> {
            const existingAdmin = await this.adminService.findOneById(id);
            const existingDuplicate = await this.adminService.findOneByAttribute([{ pseudo: data.pseudo }]);

            if(!existingAdmin) {
                return new NotFoundException();
            }

            if(existingDuplicate) {
                return new NotFoundException(); //TODO Unique exception
            }

            return this.adminService.update(id, data);
        }
}