import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Admin } from './admin.entity';

@Module({
    imports: [SequelizeModule.forFeature([Admin])],
    exports: [SequelizeModule],
})
export class AdminEntityModule {}