import { NotFoundException } from '@nestjs/common';
import { Model, Repository } from 'sequelize-typescript';
import { UpdateOptions } from 'sequelize/types';
import { UUID } from 'node:crypto';

export abstract class SupportService<C, U, M extends Model> {
    
    constructor(protected readonly model: Repository<M>) {}

    async findOne(id: UUID): Promise<M | Error> {
        try {
            const findModel = await this.model.findByPk(id);

            if(!findModel) {
                return new NotFoundException();
            }

            return findModel;
        } catch(err) {
            throw new Error(err);
        }
    }

    async findAll(): Promise<M[]> {
        try {
            return await this.model.findAll();
        } catch(err) {
            throw new Error(err);
        }
    }

    async create(data: C): Promise<M> {
        try {
            return await this.model.create(data as any);
        } catch(err) {
            throw new Error(err);
        } 
    }

    async update(id: UUID, data: U): Promise<[affectedCount: number] | Error> {
        try {
            const options: UpdateOptions = { where: { id }, returning: true };
            const updateModel = await this.model.update(data, options);

            if(updateModel[0] === 0) {
                return new NotFoundException();
            }

            return updateModel;
        } catch(err) {
            throw new Error(err);
        }
    }

    async delete(id: UUID): Promise<void | Error> {
        try {
            const deleteModel = await this.model.findByPk(id);

            if(!deleteModel) {
                return new NotFoundException();
            }

            await deleteModel.destroy();
        } catch(err) {
            throw new Error(err);
        }
    }
}