import { Delete, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { Model } from 'sequelize-typescript';
import { UUID } from 'node:crypto';

import { SupportService } from './support.service';

export abstract class SupportController<C, U, M extends Model> {

    constructor(protected readonly service: SupportService<C, U, M>) {}

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: UUID): Promise<M | Error> {
        return this.service.findOne(id);
    }

    @Get()
    findAll(): Promise<M[]> {
        return this.service.findAll();
    }

    @Delete(':id')
    delete(@Param('id', ParseUUIDPipe) id: UUID): Promise<void | Error> {
        return this.service.delete(id);
    }
}