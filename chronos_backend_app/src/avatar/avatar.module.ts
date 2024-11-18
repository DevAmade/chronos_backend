import { Module } from '@nestjs/common';

import { AvatarHttpModule } from './http/avatar_http.module';
import { AvatarEntityModule } from './entity/avatar_entity.module';

@Module({
    imports: [
        AvatarHttpModule,
        AvatarEntityModule,
    ],
    exports: [
        AvatarHttpModule,
        AvatarEntityModule,
    ],
})
export class AvatarModule {}