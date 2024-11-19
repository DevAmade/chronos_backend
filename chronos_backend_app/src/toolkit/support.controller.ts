import { Body, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { Model } from 'sequelize-typescript';

import { SupportService } from './support.service';
import { StatusCode } from './status_code.enum';

export class SupportController<M extends Model<M>> {

    constructor(protected readonly service: SupportService<M>) {}

    @Get(':id')
    @HttpCode(StatusCode.SUCCESS)
    findOne(@Param('id') id: number): Promise<M> {
        return this.service.findOne(id);
    }

    @Get()
    @HttpCode(StatusCode.SUCCESS)
    findAll(): Promise<M[]> {
        return this.service.findAll();
    }

    @Post()
    @HttpCode(StatusCode.CREATED)
    create(@Body() data: any): Promise<M> {
        return this.service.create(data);
    }

    @Put(':id')
    @HttpCode(StatusCode.SUCCESS)
    update(@Param('id') id: number, @Body() data: any): Promise<[number, M[]]> {
        return this.service.update(id, data);
    }

    @Delete(':id')
    @HttpCode(StatusCode.NO_CONTENT)
    remove(@Param('id') id: number): Promise<void> {
        return this.service.remove(id);
    }
}