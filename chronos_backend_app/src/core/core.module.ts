import { Module } from '@nestjs/common';

import { DatabaseModule } from './database/database.module';
import { ConfigurationModule } from './env/configuration.module';

@Module({
    imports: [
        DatabaseModule,
        ConfigurationModule,
    ],
})
export class CoreModule {}