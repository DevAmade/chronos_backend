import { Module } from '@nestjs/common';

import { DatabaseModule } from './database/database.module';
import { ConfigurationModule } from './env/configuration.module';
import { RateLimitingModule } from './rate_limiting/rate_limiting.module';
import { LoggerModule } from './logger/logger.module';

@Module({
    imports: [
        ConfigurationModule,
        LoggerModule,

        /*
        * Importing the rate-limiting module into the app.
        */
        RateLimitingModule,

        /*
        * Importing the Sequelize ORM module into the app.
        */
        DatabaseModule,

    ],
})
export class CoreModule {}       