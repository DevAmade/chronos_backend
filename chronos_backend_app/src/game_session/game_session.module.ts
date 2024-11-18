import { Module } from '@nestjs/common';

import { GameSessionHttpModule } from './http/game_session_http.module';
import { GameSessionEntityModule } from './entity/game_session_entity.module';

@Module({
    imports: [
        GameSessionHttpModule,
        GameSessionEntityModule,
    ],
    exports: [
        GameSessionHttpModule,
        GameSessionEntityModule,
    ],
})
export class GameSessionModule {}