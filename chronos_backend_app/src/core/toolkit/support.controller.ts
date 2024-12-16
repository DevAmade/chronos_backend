import { Delete, Get, LoggerService, NotFoundException, Param, ParseUUIDPipe, Req } from '@nestjs/common';
import { Request } from 'express';
import { Model } from 'sequelize-typescript';
import { UUID } from 'node:crypto';

import { SupportService } from './support.service';

export abstract class SupportController<C, U, M extends Model> {

    constructor(
        protected readonly service: SupportService<C, U, M>,
        protected readonly loggerService: LoggerService,
    ) {}

    @Get(':id')
    async findOneById(@Param('id', ParseUUIDPipe) id: UUID): Promise<M | Error> {
        const findModel = await this.service.findOneById(id);

        if(!findModel) {
            throw new NotFoundException();
        }

        return findModel;
    }

    @Get()
    findAll(): Promise<M[]> {
        return this.service.findAll();
    }

    @Delete(':id')
    async delete(@Param('id', ParseUUIDPipe) id: UUID, @Req() req: Request): Promise<void | Error> {
        const deleteModel = await this.service.delete(id);

        if(deleteModel === null) {
            throw new NotFoundException();
        }

        this.loggerService.log(
            `Item deleted: { Client IP: ${req.ip}, Item id: ${deleteModel.id} }`,
            'SupportController#delete',
        );
    }
}