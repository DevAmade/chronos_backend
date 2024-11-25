import { Body, Controller, Inject, LoggerService, NotFoundException, Param, ParseUUIDPipe, Post, Put, Req, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
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
            @Inject(WINSTON_MODULE_NEST_PROVIDER) protected readonly loggerService: LoggerService,
        ) {
            super(adminService, loggerService);
        }

        @Post('auth')
        async authAdmin(data: AuthAdminDto, @Req() req: Request): Promise<{ token: string } | Error> {
            const admin = await this.adminService.findOneByAttribute([{ email: data.pseudo }]);

            if(!admin) {
                this.loggerService.warn(
                    `Failed connection: { Client IP: ${req.ip}, Used identifier: ${data.pseudo} }`,
                    'AdminController#auth',
                );

                return new UnauthorizedException();
            }

            const isMatch = await bcrypt.compare(data.password, admin.password);

            if(!isMatch) {
                this.loggerService.warn(
                    `Failed connection: { Client IP: ${req.ip}, Admin id: ${admin.id} }`,
                    'AdminController#auth',
                );

                return new UnauthorizedException();
            }

            this.loggerService.log(
                `Successful connection: { Client IP: ${req.ip}, Admin id: ${admin.id} }`,
                'AdminController#auth',
            );

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
        async create(@Body(HashPasswordPipe, XSSPipe) data: CreateAdminDto, @Req() req: Request): Promise<Admin | Error> {
            const existingDuplicate = await this.adminService.findOneByAttribute([{ pseudo: data.pseudo }]);

            if(existingDuplicate) {
                return new NotFoundException(); //TODO Unique exception
            }

            const createdAdmin = await this.adminService.create(data);

            this.loggerService.log(
                `Admin created: { Client IP: ${req.ip}, Admin id: ${createdAdmin.id} }`,
                'AdminController#create',
            );

            return createdAdmin;
        }
    
        @Put(':id')
        async update(
            @Param('id', ParseUUIDPipe) id: UUID,
            @Body(HashPasswordPipe, XSSPipe) data: UpdateAdminDto,
            @Req() req: Request,
        ): Promise<[affectedCount: number] | Error> {
            const existingAdmin = await this.adminService.findOneById(id);
            const existingDuplicate = await this.adminService.findOneByAttribute([{ pseudo: data.pseudo }]);

            if(!existingAdmin) {
                return new NotFoundException();
            }

            if(existingAdmin.pseudo !== data.pseudo && existingDuplicate) {
                return new NotFoundException(); //TODO Unique exception
            }

            const updatedAdmin = await this.adminService.update(id, data);

            this.loggerService.log(
                `Admin updated: { Client IP: ${req.ip}, Admin id: ${existingAdmin.id} }`,
                'AdminController#update',
            );

            return updatedAdmin;
        }
}