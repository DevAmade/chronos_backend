import { InjectModel } from '@nestjs/sequelize';
import { Model, Repository } from 'sequelize-typescript';
import { UpdateOptions } from 'sequelize/types';

export class SupportService<M extends Model<M>> {
    
    constructor(@InjectModel(Model<M>) protected readonly model: Repository<M>) {}

    async findOne(id: number): Promise<M> {
        return this.model.findByPk(id);
    }

    async findAll(): Promise<M[]> {
        return this.model.findAll();
    }

    async create(data: any): Promise<M> {
        return await this.model.create(data);
    }

    async update(id: number, data: M): Promise<any> {
        const options: UpdateOptions = {
            where: { id },
        };

        return this.model.update(data, options);
    }

    async remove(id: number): Promise<void> {
        const object = await this.findOne(id);
        await object.destroy();
    }
}