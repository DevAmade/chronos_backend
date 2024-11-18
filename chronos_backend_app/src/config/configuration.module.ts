import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot(),
    ],
    providers: [
        ConfigService, 
    ],
})
export class ConfigurationModule {}