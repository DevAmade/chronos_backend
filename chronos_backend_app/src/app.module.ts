import { Module } from '@nestjs/common';

import { DomainModule } from './domain/domain.module';
import { CoreModule } from './core/core.module';

@Module({
    imports: [
        CoreModule,
        DomainModule,
    ],
})
export class AppModule {}