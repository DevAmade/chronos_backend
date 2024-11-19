import { Module } from '@nestjs/common';

import { ConfigurationModule } from './config/configuration.module';
import { AdminModule } from './admin/admin.module';
import { GameModule } from './game/game.module';
import { PlayerModule } from './player/player.module';
import { AvatarModule } from './avatar/avatar.module';
import { DatabaseModule } from './database/database.module';
import { GameSessionModule } from './game_session/game_session.module';

@Module({
    imports: [
        ConfigurationModule, 
        AdminModule,
        GameModule,
        GameSessionModule,
        PlayerModule,
        AvatarModule,
        DatabaseModule,
    ],
})
export class AppModule {}