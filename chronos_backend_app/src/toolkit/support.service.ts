import { Model, Repository } from 'sequelize-typescript';
import { UpdateOptions } from 'sequelize/types';
import { UUID } from 'node:crypto';

export abstract class SupportService<C, U, M extends Model> {
    
    constructor(protected readonly model: Repository<M>) {}

    async findOne(id: UUID): Promise<M> {
        try {
            return await this.model.findByPk(id);
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

    async update(id: UUID, data: U): Promise<[affectedCount: number]> {
        try {
            const options: UpdateOptions = { where: { id }, returning: true };
            return await this.model.update(data, options);
        } catch(err) {
            throw new Error(err);
        }
    }

    async delete(id: UUID): Promise<void> {
        try {
            const deleteModel = await this.findOne(id);
            await deleteModel.destroy();
        } catch(err) {
            throw new Error(err);
        }
    }
}