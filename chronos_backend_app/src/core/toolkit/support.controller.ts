import { Delete, Get, NotFoundException, Param, ParseUUIDPipe } from '@nestjs/common';
import { Model } from 'sequelize-typescript';
import { UUID } from 'node:crypto';

import { SupportService } from './support.service';

export abstract class SupportController<C, U, M extends Model> {

    constructor(protected readonly service: SupportService<C, U, M>) {}

    @Get(':id')
    async findOneById(@Param('id', ParseUUIDPipe) id: UUID): Promise<M | Error> {
        const findModel = await this.service.findOneById(id);

        if(!findModel) {
            return new NotFoundException();
        }

        return findModel;
    }

    @Get()
    findAll(): Promise<M[]> {
        return this.service.findAll();
    }

    @Delete(':id')
    async delete(@Param('id', ParseUUIDPipe) id: UUID): Promise<void | Error> {
        const deleteModel = await this.service.delete(id);

        if(deleteModel === null) {
            return new NotFoundException();
        }
    }
}