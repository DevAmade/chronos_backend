import { Module } from '@nestjs/common';

import { GameHttpModule } from './http/game_http.module';
import { GameEntityModule } from './entity/game_entity.module';

@Module({
    imports: [
        GameHttpModule,
        GameEntityModule,
    ],
    exports: [
        GameHttpModule,
        GameEntityModule,
    ],
})
export class GameModule {}