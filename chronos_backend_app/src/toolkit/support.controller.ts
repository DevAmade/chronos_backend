import { Delete, Get, HttpCode, Param, ParseUUIDPipe } from '@nestjs/common';
import { Model } from 'sequelize-typescript';
import { UUID } from 'node:crypto';

import { SupportService } from './support.service';
import { StatusCode } from './status_code.enum';

export abstract class SupportController<C, U, M extends Model> {

    constructor(protected readonly service: SupportService<C, U, M>) {}

    @Get(':id')
    @HttpCode(StatusCode.SUCCESS)
    findOne(@Param('id', ParseUUIDPipe) id: UUID): Promise<M> {
        return this.service.findOne(id);
    }

    @Get()
    @HttpCode(StatusCode.SUCCESS)
    findAll(): Promise<M[]> {
        return this.service.findAll();
    }

    @Delete(':id')
    @HttpCode(StatusCode.NO_CONTENT)
    remove(@Param('id', ParseUUIDPipe) id: UUID): Promise<void> {
        return this.service.delete(id);
    }
}