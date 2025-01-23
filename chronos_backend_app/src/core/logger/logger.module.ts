import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';

import { LoggerConfigService } from './service/logger_config.service';

@Module({
    imports: [
        WinstonModule.forRootAsync({
            useClass: LoggerConfigService,
        }),
    ],
})
export class LoggerModule {}