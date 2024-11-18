import { Module } from '@nestjs/common';

import { AdminHttpModule } from './http/admin_http.module';
import { AdminEntityModule } from './entity/admin_entity.module';

@Module({
    imports: [
        AdminHttpModule,
        AdminEntityModule,
    ],
    exports: [
        AdminHttpModule,
        AdminEntityModule,
    ],
})
export class AdminModule {}