import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { RateLimitingConfigService } from './service/rate_limiting_config.service';

@Module({
    imports: [

        /*
        * Creation of rate-limiting module using the options configuration service.
        */
        ThrottlerModule.forRootAsync({
            useClass: RateLimitingConfigService,
        }),

    ],
    providers: [

        /*
        * Provide the rate-limiting guard inside the module using options.
        */
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    
    ],
})
export class RateLimitingModule {}