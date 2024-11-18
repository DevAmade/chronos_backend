import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Avatar } from './avatar.entity';

@Module({
    imports: [SequelizeModule.forFeature([Avatar])],
    exports: [SequelizeModule]
})
export class AvatarEntityModule {}