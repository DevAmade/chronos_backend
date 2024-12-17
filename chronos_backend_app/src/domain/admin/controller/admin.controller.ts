import { Body, Controller, Delete, Get, Inject, LoggerService, NotFoundException, Param, ParseUUIDPipe, Post, Put, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { UUID } from 'node:crypto';
import * as bcrypt from 'bcrypt';

import { HashPasswordPipe } from '../../../core/toolkit/pipe/hash_password.pipe';
import { XSSPipe } from '../../../core/toolkit/pipe/xss.pipe';

import { AdminGuard } from '../../guard/admin.guard';
import { ADMIN_JWT_TOKEN_EXPIRATION } from '../../config/module.config';
import { Admin } from '../model/admin.model';
import { AdminService } from '../service/admin.service';
import { CreateAdminDto } from '../dto/create_admin.dto';
import { UpdateAdminDto } from '../dto/update_admin.dto';
import { AuthAdminDto } from '../dto/auth_admin.dto';

@Controller('admin')
export class AdminController {
        
    constructor(
        private readonly adminService: AdminService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly loggerService: LoggerService,
    ) {}

    @Post('auth')
    async authAdmin(@Body() data: AuthAdminDto, @Req() req: Request): Promise<{ token: string } | Error> {
        const admin = await this.adminService.findOneByAttribute([{ pseudo: data.pseudo }]);

        if(!admin) {
            this.loggerService.warn(
                `Failed connection: { Client IP: ${req.ip}, Used identifier: ${data.pseudo} }`,
                'AdminController#auth',
            );

            throw new UnauthorizedException();
        }

        const isMatch = await bcrypt.compare(data.password, admin.password);

        if(!isMatch) {
            this.loggerService.warn(
                `Failed connection: { Client IP: ${req.ip}, Admin id: ${admin.id} }`,
                'AdminController#auth',
            );

            throw new UnauthorizedException();
        }

        this.loggerService.log(
            `Successful connection: { Client IP: ${req.ip}, Admin id: ${admin.id} }`,
            'AdminController#auth',
        );

        const payload = {
            id: admin.id,
            pseudo: admin.pseudo,
            admin: true,
        };

        return {
            token: await this.jwtService.signAsync(
                payload, 
                { expiresIn: ADMIN_JWT_TOKEN_EXPIRATION, secret: this.configService.get('JWT_KEY_ADMIN') },
            )
        }
    }

    @Post()
    @UseGuards(AdminGuard)
    async create(@Body(HashPasswordPipe, XSSPipe) data: CreateAdminDto, @Req() req: Request): Promise<Admin | Error> {
        const createdAdmin = await this.adminService.create(data);

        this.loggerService.log(
            `Admin created: { Client IP: ${req.ip}, Admin id: ${createdAdmin.id} }`,
            'AdminController#create',
        );

        return createdAdmin;
    }

    @Put(':id')
    @UseGuards(AdminGuard)
    async update(
        @Param('id', ParseUUIDPipe) id: UUID,
        @Body(HashPasswordPipe, XSSPipe) data: UpdateAdminDto,
        @Req() req: Request,
    ): Promise<[affectedCount: number] | Error> {
        const existingAdmin = await this.adminService.findOneById(id);

        if(!existingAdmin) {
            throw new NotFoundException();
        }

        const updatedAdmin = await this.adminService.update(id, data);

        this.loggerService.log(
            `Admin updated: { Client IP: ${req.ip}, Admin id: ${existingAdmin.id} }`,
            'AdminController#update',
        );

        return updatedAdmin;
    }

    @Get(':id')
    @UseGuards(AdminGuard)
    async findOneById(@Param('id', ParseUUIDPipe) id: UUID): Promise<Admin | Error> {
        const findAdmin = await this.adminService.findOneById(id);

        if(!findAdmin) {
            throw new NotFoundException();
        }

        return findAdmin;
    }

    @Get()
    @UseGuards(AdminGuard)
    findAll(): Promise<Admin[]> {
        return this.adminService.findAll();
    }

    @Delete(':id')
    @UseGuards(AdminGuard)
    async delete(@Param('id', ParseUUIDPipe) id: UUID, @Req() req: Request): Promise<void | Error> {
        const deleteAdmin = await this.adminService.delete(id);

        if(deleteAdmin === null) {
            throw new NotFoundException();
        }

        this.loggerService.log(
            `Admin deleted: { Client IP: ${req.ip}, Admin id: ${deleteAdmin.id} }`,
            'AdminController#delete',
        );
    }
}