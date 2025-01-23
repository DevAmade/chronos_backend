import { Module } from '@nestjs/common';

import { AdminModule } from './admin/admin.module';
import { PlayerModule } from './player/player.module';
import { GameModule } from './game/game.module';
import { GameSessionModule } from './game_session/game_session.module';
import { AvatarModule } from './avatar/avatar.module';
import { EditorModule } from './editor/editor.module';

@Module({
    imports: [
        AdminModule,
        PlayerModule,
        GameModule,
        GameSessionModule,
        AvatarModule,
        EditorModule,
    ],
})
export class DomainModule {}