import { Injectable } from "@nestjs/common";
import { ThrottlerModuleOptions, ThrottlerOptionsFactory } from "@nestjs/throttler";

import { RATE_LIMITING_REQUEST_LIMIT_LONG,
         RATE_LIMITING_REQUEST_LIMIT_MEDIUM,
         RATE_LIMITING_REQUEST_LIMIT_SHORT, 
         RATE_LIMITING_TIME_LIMIT_LONG, 
         RATE_LIMITING_TIME_LIMIT_MEDIUM, 
         RATE_LIMITING_TIME_LIMIT_SHORT } from "../../config/module.config";

@Injectable()
export class RateLimitingConfigService implements ThrottlerOptionsFactory {

    async createThrottlerOptions(): Promise<ThrottlerModuleOptions> {
        return Promise.resolve({
            throttlers: [
                {
                    name: 'short',
                    ttl: RATE_LIMITING_TIME_LIMIT_SHORT,
                    limit: RATE_LIMITING_REQUEST_LIMIT_SHORT,
                },
                {
                    name: 'medium',
                    ttl: RATE_LIMITING_TIME_LIMIT_MEDIUM,
                    limit: RATE_LIMITING_REQUEST_LIMIT_MEDIUM,
                },
                {
                    name: 'long',
                    ttl: RATE_LIMITING_TIME_LIMIT_LONG,
                    limit: RATE_LIMITING_REQUEST_LIMIT_LONG,
                },
            ]
        });
    }
}