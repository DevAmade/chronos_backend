import { Injectable } from '@nestjs/common';
import { WinstonModuleOptions, WinstonModuleOptionsFactory } from 'nest-winston';
import * as winston from 'winston';

import { ARCHIVED_LOG_FILE,
         LOG_FILE_MAX_SIZE,
         LOG_FILE_NAME,
         LOG_FILE_PATH,
         LOGGING_SERVER, 
         WRITE_LOG_FILE } from '../../config/module.config';

@Injectable()
export class LoggerConfigService implements WinstonModuleOptionsFactory {
    private logFormat = winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
        winston.format.printf(({ message, timestamp, level }) => 
            `${level.toUpperCase()} - ${timestamp} - ${message}`),
    )

    async createWinstonModuleOptions(): Promise<WinstonModuleOptions> {
        return Promise.resolve({
            format: this.logFormat,
            transports: [
                new winston.transports.Console({
                    silent: !LOGGING_SERVER,
                }),
                new winston.transports.File({
                    silent: !WRITE_LOG_FILE,
                    filename: LOG_FILE_NAME,
                    dirname: LOG_FILE_PATH,
                    maxsize: LOG_FILE_MAX_SIZE,
                    zippedArchive: ARCHIVED_LOG_FILE,
                }),
            ]
        });
    }
}