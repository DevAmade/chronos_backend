import { Module } from '@nestjs/common';

import { PlayerHttpModule } from './http/player_http.module';
import { PlayerEntityModule } from './entity/player_entity.module';

@Module({
    imports: [
        PlayerHttpModule,
        PlayerEntityModule,
    ],
    exports: [
        PlayerHttpModule,
        PlayerEntityModule,
    ],
})
export class PlayerModule {}