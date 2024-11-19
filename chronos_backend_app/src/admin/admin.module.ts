import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Admin } from './model/admin.model';
import { AdminController } from './controller/admin.controller';
import { AdminService } from './service/admin.service';

@Module({
    imports: [
        SequelizeModule.forFeature([Admin]),
    ],
    controllers: [
        AdminController,
    ],
    providers: [
        AdminService,
    ],
})
export class AdminModule {}