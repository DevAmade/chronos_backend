import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { RateLimitingConfigService } from './service/rate_limiting_config.service';

@Module({
    imports: [
        ThrottlerModule.forRootAsync({
            useClass: RateLimitingConfigService,
        }),
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class RateLimitingModule {}