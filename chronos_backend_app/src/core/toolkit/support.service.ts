import { Model, Repository } from 'sequelize-typescript';
import { UpdateOptions, FindOptions } from 'sequelize/types';
import { Op } from 'sequelize';
import { UUID } from 'node:crypto';

export abstract class SupportService<C, U, M extends Model> {
    
    constructor(protected readonly model: Repository<M>) {}

    async findOneById(id: UUID): Promise<M> {
        return await this.model.findByPk(id);
    }

    /*
    * Example of a prepared Sequelize ORM request
    */
    async findOneByAttribute(
        findOptions: { [attribute: string]: any }[],
        operator?: 'or',
    ): Promise<M> {
        let options: FindOptions;

        if(!operator) {
            options = { 
                where: findOptions,
            }
        }

        if(operator === 'or') {
            options = { 
                where: { [Op.or]: findOptions },
            }
        }

        return await this.model.findOne(options);
    }

    async findAll(): Promise<M[]> {
        return await this.model.findAll();
    }

    async findManyByAttribute(
        findOptions: { [attribute: string]: any }[],
        operator?: 'or',
    ): Promise<M[]> {
        let options: FindOptions;

        if(!operator) {
            options = { 
                where: findOptions,
            }
        }

        if(operator === 'or') {
            options = { 
                where: { [Op.or]: findOptions },
            }
        }

        return await this.model.findAll(options);
    }

    async create(data: C): Promise<M> {
        return await this.model.create(data as any); 
    }

    async update(id: UUID, data: U): Promise<[affectedCount: number]> {
        const options: UpdateOptions = { where: { id }, returning: true };
        const updateModel = await this.model.update(data, options);

        return updateModel;
    }

    async delete(id: UUID): Promise<M> {
        const deleteModel = await this.findOneById(id);

        if(!deleteModel) {
            return null;
        }

        await deleteModel.destroy();

        return deleteModel;
    }
}