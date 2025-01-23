import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { DatabaseConfigService } from './service/database_config.service';

@Module({
    imports: [

        /*
        * Creation of Sequelize ORM module using the options configuration service.
        */
        SequelizeModule.forRootAsync({
            useClass: DatabaseConfigService,
        }),

    ],
})
export class DatabaseModule {}