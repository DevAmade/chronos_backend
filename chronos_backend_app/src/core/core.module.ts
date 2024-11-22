import { Module } from '@nestjs/common';

import { DatabaseModule } from './database/database.module';
import { ConfigurationModule } from './env/configuration.module';
import { RateLimitingModule } from './rate_limiting/rate_limiting.module';

@Module({
    imports: [
        DatabaseModule,
        ConfigurationModule,
        RateLimitingModule,
    ],
})
export class CoreModule {}