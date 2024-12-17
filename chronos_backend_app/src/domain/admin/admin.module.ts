import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';

import { AvatarModule } from '../avatar/avatar.module';
import { Admin } from './model/admin.model';
import { AdminController } from './controller/admin.controller';
import { AdminService } from './service/admin.service';

@Module({
    imports: [
        SequelizeModule.forFeature([Admin]),
        JwtModule,
        AvatarModule,
    ],
    controllers: [
        AdminController,
    ],
    providers: [
        AdminService,
    ],
})
export class AdminModule {}