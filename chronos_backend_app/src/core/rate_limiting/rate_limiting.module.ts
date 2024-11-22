import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { RateLimitingService } from './service/rate_limiting.service';

@Module({
    imports: [
        ThrottlerModule.forRootAsync({
            useClass: RateLimitingService,
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